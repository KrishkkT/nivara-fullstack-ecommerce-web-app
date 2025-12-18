import { sql } from "@/lib/db";

// Shiprocket API base URL
const SHIPROCKET_API_URL = "https://apiv2.shiprocket.in/v1/external";

// Get Shiprocket API token from environment variables
function getShiprocketToken(): string {
  const token = process.env.SHIPROCKET_API_TOKEN;
  if (!token) {
    throw new Error("SHIPROCKET_API_TOKEN environment variable is not set");
  }
  return token;
}

// Common headers for Shiprocket API requests
function getHeaders() {
  return {
    "Authorization": `Bearer ${getShiprocketToken()}`,
    "Content-Type": "application/json",
  };
}

// Generic function to make GET requests to Shiprocket API
async function shiprocketGet(endpoint: string) {
  const response = await fetch(`${SHIPROCKET_API_URL}${endpoint}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Shiprocket API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Generic function to make POST requests to Shiprocket API
async function shiprocketPost(endpoint: string, data: any) {
  const response = await fetch(`${SHIPROCKET_API_URL}${endpoint}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Shiprocket API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// 1. Authentication - Login to get token
export async function authenticate(email: string, password: string) {
  try {
    const response = await fetch(`${SHIPROCKET_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error authenticating with Shiprocket:", error);
    throw error;
  }
}

// 2. Pickup Location Management
export async function getPickupLocations() {
  try {
    const response = await shiprocketGet("/settings/company/pickup");
    return response;
  } catch (error) {
    console.error("Error fetching pickup locations:", error);
    throw error;
  }
}

// 3. Order Creation
export async function createOrder(orderData: any) {
  try {
    // Validate required fields for adhoc order creation
    const requiredFields = [
      'order_id',
      'order_date',
      'pickup_location',
      'billing_customer_name',
      'billing_address',
      'billing_pincode',
      'billing_phone',
      'payment_method',
      'order_items'
    ];
    
    for (const field of requiredFields) {
      if (!orderData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Validate order_items array
    if (!Array.isArray(orderData.order_items) || orderData.order_items.length === 0) {
      throw new Error("order_items must be a non-empty array");
    }
    
    // Validate each item has required fields
    for (const item of orderData.order_items) {
      const itemRequiredFields = ['name', 'sku', 'units', 'selling_price'];
      for (const field of itemRequiredFields) {
        if (item[field] === undefined || item[field] === null) {
          throw new Error(`Missing required field in order_items: ${field}`);
        }
      }
    }
    
    const response = await shiprocketPost("/orders/create/adhoc", orderData);
    return response;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// 4. Courier Serviceability Check
export async function checkCourierServiceability(data: {
  pickup_postcode: string;
  delivery_postcode: string;
  order_id?: number;
  cod?: boolean;
  weight?: number;
  length?: number;
  breadth?: number;
  height?: number;
  declared_value?: number;
}) {
  try {
    // Validate required fields
    if (!data.pickup_postcode) {
      throw new Error("pickup_postcode is required");
    }
    
    if (!data.delivery_postcode) {
      throw new Error("delivery_postcode is required");
    }
    
    // One of either the 'order_id' or 'cod' and 'weight' is required
    if (!data.order_id && (data.cod === undefined || data.weight === undefined)) {
      throw new Error("Either order_id or both cod and weight are required");
    }
    
    const response = await shiprocketPost("/courier/serviceability", data);
    return response;
  } catch (error) {
    console.error("Error checking courier serviceability:", error);
    throw error;
  }
}

// 5. Assign AWB (Air Waybill) to Shipment
export async function assignAWB(shipmentData: {
  shipment_id: number;
  courier_id?: number;
}) {
  try {
    const response = await shiprocketPost("/courier/assign/awb", shipmentData);
    return response;
  } catch (error) {
    console.error("Error assigning AWB:", error);
    throw error;
  }
}

// 6. Generate Shipping Label
export async function generateShippingLabel(shipmentId: number) {
  try {
    const response = await shiprocketPost("/courier/generate/label", {
      shipment_id: [shipmentId]
    });
    return response;
  } catch (error) {
    console.error("Error generating shipping label:", error);
    throw error;
  }
}

// 7. Request Shipment Pickup
export async function requestPickup(shipmentData: {
  shipment_id: number[];
  pickup_date?: string;
}) {
  try {
    const response = await shiprocketPost("/courier/generate/pickup", shipmentData);
    return response;
  } catch (error) {
    console.error("Error requesting pickup:", error);
    throw error;
  }
}

// 8. Order Tracking
export async function trackShipment(awbCode?: string, shipmentId?: number, orderId?: number) {
  try {
    let endpoint = "";
    
    if (awbCode) {
      endpoint = `/courier/track/awb/${awbCode}`;
    } else if (shipmentId) {
      endpoint = `/courier/track/shipment/${shipmentId}`;
    } else if (orderId) {
      endpoint = `/courier/track?order_id=${orderId}`;
    } else {
      throw new Error("Either awbCode, shipmentId, or orderId is required for tracking");
    }
    
    const response = await shiprocketGet(endpoint);
    return response;
  } catch (error) {
    console.error("Error tracking shipment:", error);
    throw error;
  }
}

// 9. Get All Orders
export async function getAllOrders(page?: number, perPage?: number) {
  try {
    let endpoint = "/orders";
    
    if (page || perPage) {
      const params = new URLSearchParams();
      if (page) params.append("page", page.toString());
      if (perPage) params.append("per_page", perPage.toString());
      endpoint += `?${params.toString()}`;
    }
    
    const response = await shiprocketGet(endpoint);
    return response;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

// 10. Get Specific Order Details
export async function getOrderDetails(orderId: number) {
  try {
    const response = await shiprocketGet(`/orders/show/${orderId}`);
    return response;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
}

// 11. Update Order
export async function updateOrder(orderData: any) {
  try {
    const response = await shiprocketPost("/orders/update/adhoc", orderData);
    return response;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}

// 12. Cancel Order
export async function cancelOrder(data: { order_id: number[] }) {
  try {
    const response = await shiprocketPost("/orders/cancel", data);
    return response;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
}

// 13. Get Couriers List
export async function getCouriers() {
  try {
    const response = await shiprocketGet("/courier/courierListWithCounts");
    return response;
  } catch (error) {
    console.error("Error fetching couriers:", error);
    throw error;
  }
}

// 14. Refresh Couriers in Database
export async function refreshCouriersInDatabase() {
  try {
    const couriersData = await getCouriers();
    
    if (couriersData && couriersData.data) {
      // Clear existing couriers
      await sql`DELETE FROM shiprocket_couriers`;
      
      // Insert new couriers
      for (const courier of couriersData.data) {
        await sql`
          INSERT INTO shiprocket_couriers (courier_id, courier_name, status)
          VALUES (${courier.id}, ${courier.name}, ${courier.status || 'active'})
          ON CONFLICT (courier_id) 
          DO UPDATE SET
            courier_name = EXCLUDED.courier_name,
            status = EXCLUDED.status,
            updated_at = NOW()
        `;
      }
      
      return { success: true, count: couriersData.data.length };
    }
    
    return { success: false, count: 0 };
  } catch (error) {
    console.error("Error refreshing couriers in database:", error);
    throw error;
  }
}

// Utility function to normalize Shiprocket statuses into clean enums
export function normalizeStatus(status: string): string {
  const statusMap: Record<string, string> = {
    "placed": "Created",
    "confirmed": "Confirmed",
    "assigned": "Assigned",
    "picked_up": "Picked Up",
    "in_transit": "In Transit",
    "out_for_delivery": "Out for Delivery",
    "delivered": "Delivered",
    "cancelled": "Cancelled",
    "rto_initiated": "RTO Initiated",
    "rto_delivered": "RTO Delivered",
    "lost": "Lost",
    "damaged": "Damaged",
    "pending": "Pending",
    "processed": "Processed",
    "shipped": "Shipped"
  };

  return statusMap[status.toLowerCase()] || status;
}