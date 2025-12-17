import { sql } from "@/lib/db";
import { 
  sendEmail, 
  generateShipmentCreationEmail,
  generateAdminShipmentCreationEmail,
  generateShipmentCancellationEmail,
  generateAdminShipmentCancellationEmail
} from "@/lib/email";

// Delhivery API base URLs
const DELHIVERY_TRACK_URL = "https://track.delhivery.com";
const DELHIVERY_API_URL = "https://api.delhivery.com";

// Get Delhivery API token from environment variables
function getDelhiveryToken(): string {
  const token = process.env.DELHIVERY_API_TOKEN;
  if (!token) {
    throw new Error("DELHIVERY_API_TOKEN environment variable is not set");
  }
  return token;
}

// Common headers for Delhivery API requests
function getHeaders() {
  return {
    "Authorization": `Token ${getDelhiveryToken()}`,
    "Content-Type": "application/json",
  };
}

// Generic function to make GET requests to Delhivery API
async function delhiveryGet(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(endpoint, DELHIVERY_TRACK_URL);
  
  // Add query parameters
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Delhivery API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Generic function to make POST requests to Delhivery API
async function delhiveryPost(endpoint: string, body: any, useApiUrl: boolean = false) {
  const baseUrl = useApiUrl ? DELHIVERY_API_URL : DELHIVERY_TRACK_URL;
  const url = new URL(endpoint, baseUrl);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Delhivery API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// 1. Pincode Serviceability Checker
export async function checkPincodeServiceability(pickupPostcode: string, deliveryPostcode: string) {
  try {
    const response = await delhiveryGet("/c/api/pin-codes/json/", {
      pickup_postcode: pickupPostcode,
      delivery_postcode: deliveryPostcode,
    });
    
    // Assuming the response has a structure that indicates serviceability
    // This may need adjustment based on actual API response
    return {
      serviceable: response.delivery_codes && response.delivery_codes.length > 0,
      data: response
    };
  } catch (error) {
    console.error("Error checking pincode serviceability:", error);
    throw error;
  }
}

// 2. Shipping Cost Estimator
export async function calculateShippingCost(data: {
  pickup_pincode: string;
  delivery_pincode: string;
  weight: number;
  cod: boolean;
}) {
  try {
    const response = await delhiveryPost("/freight/v1/rate", data, true);
    return response;
  } catch (error) {
    console.error("Error calculating shipping cost:", error);
    throw error;
  }
}

// 3. Order Tracking
export async function trackShipment(waybill?: string, refIds?: string) {
  try {
    const params: Record<string, string> = {};
    if (waybill) {
      params.waybill = waybill;
    }
    if (refIds) {
      params.ref_ids = refIds;
    }
    
    const response = await delhiveryGet("/api/v1/packages/json/", params);
    return response;
  } catch (error) {
    console.error("Error tracking shipment:", error);
    throw error;
  }
}

// 4. Warehouse Management
export async function createWarehouse(warehouseData: any) {
  try {
    const response = await delhiveryPost("/api/backend/clientwarehouse/create/", warehouseData);
    return response;
  } catch (error) {
    console.error("Error creating warehouse:", error);
    throw error;
  }
}

export async function updateWarehouse(warehouseData: any) {
  try {
    const response = await delhiveryPost("/api/backend/clientwarehouse/update/", warehouseData);
    return response;
  } catch (error) {
    console.error("Error updating warehouse:", error);
    throw error;
  }
}

// 5. Waybill Pre-Fetch Service
export async function fetchBulkWaybills(count: number) {
  try {
    const response = await delhiveryGet("/waybill/api/bulk/json/", { count: count.toString() }, true);
    
    // Store waybills in database for future use
    if (response && response.waybills) {
      for (const waybill of response.waybills) {
        await sql`
          INSERT INTO delhivery_waybills (waybill_number, status, created_at)
          VALUES (${waybill}, 'available', NOW())
          ON CONFLICT (waybill_number) DO NOTHING
        `;
      }
    }
    
    return response;
  } catch (error) {
    console.error("Error fetching bulk waybills:", error);
    throw error;
  }
}

// 6. Get available waybill from database
export async function getAvailableWaybill() {
  try {
    const result: any = await sql`
      SELECT waybill_number 
      FROM delhivery_waybills 
      WHERE status = 'available' 
      ORDER BY created_at ASC 
      LIMIT 1
    `;
    
    if (result.length > 0) {
      // Mark waybill as used
      await sql`
        UPDATE delhivery_waybills 
        SET status = 'used', used_at = NOW() 
        WHERE waybill_number = ${result[0].waybill_number}
      `;
      
      return result[0].waybill_number;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting available waybill:", error);
    throw error;
  }
}

// 7. Shipment Creation (Manifestation)
export async function createShipment(shipmentData: any) {
  try {
    const response = await delhiveryPost("/api/cmu/create.json", shipmentData);
    
    // If shipment creation is successful, send email notifications
    if (response && response.packages && response.packages.length > 0) {
      const waybill = response.packages[0].waybill;
      const orderId = shipmentData.orderId;
      
      if (orderId && waybill) {
        try {
          // Get order and customer details
          const orderResult: any = await sql`
            SELECT o.order_number, o.total_amount, o.created_at, u.full_name, u.email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.id = ${orderId}
          `;
          
          if (orderResult.length > 0) {
            const order = orderResult[0];
            const customer = {
              full_name: order.full_name,
              email: order.email
            };
            
            // Send email to customer
            await sendEmail({
              to: order.email,
              subject: `Your Order #${order.order_number} Has Been Shipped`,
              html: generateShipmentCreationEmail(order, customer, waybill)
            });
            
            // Send notification to admins
            try {
              const adminEmailsResult: any = await sql`
                SELECT email FROM admin_emails WHERE is_active = true
              `;
              
              const adminEmails = adminEmailsResult.map((row: any) => row.email);
              
              if (adminEmails.length > 0) {
                await sendEmail({
                  to: adminEmails,
                  subject: `New Shipment Created - Order #${order.order_number}`,
                  html: generateAdminShipmentCreationEmail(order, customer, waybill)
                });
              }
            } catch (adminEmailError) {
              console.error("Failed to send admin shipment creation notification:", adminEmailError);
            }
          }
        } catch (emailError) {
          console.error("Failed to send shipment creation emails:", emailError);
        }
      }
    }
    
    return response;
  } catch (error) {
    console.error("Error creating shipment:", error);
    throw error;
  }
}

// 8. Shipping Label Generator
export async function generateShippingLabel(waybill: string) {
  try {
    const url = new URL("/api/p/packing_slip", DELHIVERY_TRACK_URL);
    url.searchParams.append("wbns", waybill);
    
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Delhivery API error: ${response.status} ${response.statusText}`);
    }

    // Return the PDF as a buffer
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Error generating shipping label:", error);
    throw error;
  }
}

// 9. Pickup Request Creation
export async function createPickupRequest(pickupData: any) {
  try {
    const response = await delhiveryPost("/fm/request/new/", pickupData);
    return response;
  } catch (error) {
    console.error("Error creating pickup request:", error);
    throw error;
  }
}

// 10. Shipment Cancellation
export async function cancelShipment(waybill: string) {
  try {
    const response = await delhiveryPost("/api/p/edit", {
      waybill: waybill,
      cancellation: "true"
    });
    
    // If cancellation is successful, send email notifications
    if (response && response.success) {
      try {
        // Get order and customer details
        const orderResult: any = await sql`
          SELECT ds.order_id, o.order_number, o.total_amount, o.created_at, u.full_name, u.email
          FROM delhivery_shipments ds
          JOIN orders o ON ds.order_id = o.id
          JOIN users u ON o.user_id = u.id
          WHERE ds.waybill_number = ${waybill}
        `;
        
        if (orderResult.length > 0) {
          const order = orderResult[0];
          const customer = {
            full_name: order.full_name,
            email: order.email
          };
          
          // Send email to customer
          await sendEmail({
            to: order.email,
            subject: `Your Shipment for Order #${order.order_number} Has Been Cancelled`,
            html: generateShipmentCancellationEmail(order, customer, waybill)
          });
          
          // Send notification to admins
          try {
            const adminEmailsResult: any = await sql`
              SELECT email FROM admin_emails WHERE is_active = true
            `;
            
            const adminEmails = adminEmailsResult.map((row: any) => row.email);
            
            if (adminEmails.length > 0) {
              await sendEmail({
                to: adminEmails,
                subject: `Shipment Cancelled - Order #${order.order_number}`,
                html: generateAdminShipmentCancellationEmail(order, customer, waybill)
              });
            }
          } catch (adminEmailError) {
            console.error("Failed to send admin shipment cancellation notification:", adminEmailError);
          }
        }
      } catch (emailError) {
        console.error("Failed to send shipment cancellation emails:", emailError);
      }
    }
    
    return response;
  } catch (error) {
    console.error("Error cancelling shipment:", error);
    throw error;
  }
}

// 11. NDR Management
export async function handleNdrAction(waybill: string, action: string, remarks?: string) {
  try {
    const payload: any = {
      waybill: waybill,
      action: action
    };
    
    if (remarks) {
      payload.remarks = remarks;
    }
    
    const response = await delhiveryPost("/api/nsl/ndr/action", payload);
    return response;
  } catch (error) {
    console.error("Error handling NDR action:", error);
    throw error;
  }
}

// Utility function to update shipment status in database
export async function updateShipmentStatus(waybill: string, status: string, eventData?: any) {
  try {
    await sql`
      INSERT INTO delhivery_shipments (waybill_number, status, event_data, updated_at)
      VALUES (${waybill}, ${status}, ${eventData ? JSON.stringify(eventData) : null}, NOW())
      ON CONFLICT (waybill_number) 
      DO UPDATE SET 
        status = EXCLUDED.status,
        event_data = EXCLUDED.event_data,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error("Error updating shipment status:", error);
    throw error;
  }
}