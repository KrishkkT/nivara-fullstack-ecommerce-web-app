import { sql } from "@/lib/db";

// Shiprocket API base URL
const SHIPROCKET_API_URL = "https://apiv2.shiprocket.in/v1/external";

let shiprocketToken: string | null = null;
let tokenExpiry: number | null = null;

// Authenticate with Shiprocket and get token
async function authenticateAndGetToken(): Promise<string> {
  // Return cached token if still valid
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  
  if (!email || !password) {
    throw new Error("SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD environment variables are not set");
  }

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

    const data = await response.json();
    shiprocketToken = data.token;
    // Token usually expires in 24 hours, set expiry to 23 hours for safety
    tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
    
    return shiprocketToken;
  } catch (error) {
    console.error("Error authenticating with Shiprocket:", error);
    throw error;
  }
}

// Common headers for Shiprocket API requests
async function getHeaders() {
  const token = await authenticateAndGetToken();
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// Generic function to make GET requests to Shiprocket API
async function shiprocketGet(endpoint: string) {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${SHIPROCKET_API_URL}${endpoint}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shiprocket API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in shiprocketGet for ${endpoint}:`, error);
    throw error;
  }
}

// Generic function to make POST requests to Shiprocket API
async function shiprocketPost(endpoint: string, data: any) {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${SHIPROCKET_API_URL}${endpoint}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shiprocket API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in shiprocketPost for ${endpoint}:`, error);
    throw error;
  }
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
  } catch (error: any) {
    console.error("Error fetching pickup locations:", error);
    throw new Error(`Failed to fetch pickup locations: ${error.message || error}`);
  }
}

// 3. Order Creation
export async function createOrder(orderData: any) {
  try {
    // Validate required fields for adhoc order creation (according to API specification)
    const requiredFields = [
      'order_id',
      'order_date',
      'pickup_location',
      'billing_customer_name',
      'billing_address',
      'billing_city',
      'billing_pincode',
      'billing_state',
      'billing_country',
      'billing_email',
      'billing_phone',
      'shipping_is_billing',
      'order_items',
      'payment_method',
      'sub_total',
      'length',
      'breadth',
      'height',
      'weight'
    ];
    
    for (const field of requiredFields) {
      if (orderData[field] === undefined || orderData[field] === null || orderData[field] === '') {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Validate order_items array
    if (!Array.isArray(orderData.order_items) || orderData.order_items.length === 0) {
      throw new Error("order_items must be a non-empty array");
    }
    
    // Validate each item has required fields
    for (const item of orderData.order_items) {
      // Generate defaults for missing fields
      if (!item.name) item.name = "Unnamed Product";
      if (!item.sku) item.sku = `GEN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      if (item.units === undefined || item.units === null) item.units = 1;
      if (item.selling_price === undefined || item.selling_price === null) item.selling_price = 0;
      
      // Validate that we have valid values
      const itemRequiredFields = ['name', 'sku', 'units', 'selling_price'];
      for (const field of itemRequiredFields) {
        if (item[field] === undefined || item[field] === null || item[field] === '') {
          throw new Error(`Missing required field in order_items: ${field}`);
        }
      }
    }
    
    // Additional validations
    if (typeof orderData.shipping_is_billing !== 'boolean') {
      throw new Error("shipping_is_billing must be a boolean value");
    }
    
    if (!orderData.shipping_is_billing) {
      // If shipping is not billing, these fields are required
      const shippingFields = ['shipping_customer_name', 'shipping_address', 'shipping_city', 'shipping_pincode', 'shipping_state', 'shipping_country'];
      for (const field of shippingFields) {
        if (!orderData[field]) {
          throw new Error(`Missing required field for separate shipping address: ${field}`);
        }
      }
    }
    
    const response = await shiprocketPost("/orders/create/adhoc", orderData);
    return response;
  } catch (error: any) {
    console.error("Error creating order:", error);
    throw new Error(`Failed to create order: ${error.message || error}`);
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
    
    const response = await shiprocketGet("/courier/serviceability?" + new URLSearchParams(data as any).toString());
    return response;
  } catch (error: any) {
    console.error("Error checking courier serviceability:", error);
    throw new Error(`Failed to check courier serviceability: ${error.message || error}`);
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
  } catch (error: any) {
    console.error("Error assigning AWB:", error);
    throw new Error(`Failed to assign AWB: ${error.message || error}`);
  }
}

// 6. Generate Shipping Label
export async function generateShippingLabel(shipmentId: number) {
  try {
    const response = await shiprocketPost("/courier/generate/label", {
      shipment_id: [shipmentId]
    });
    return response;
  } catch (error: any) {
    console.error("Error generating shipping label:", error);
    throw new Error(`Failed to generate shipping label: ${error.message || error}`);
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
  } catch (error: any) {
    console.error("Error requesting pickup:", error);
    throw new Error(`Failed to request pickup: ${error.message || error}`);
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
  } catch (error: any) {
    console.error("Error tracking shipment:", error);
    throw new Error(`Failed to track shipment: ${error.message || error}`);
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
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    throw new Error(`Failed to fetch orders: ${error.message || error}`);
  }
}

// 10. Get Specific Order Details
export async function getOrderDetails(orderId: number) {
  try {
    const response = await shiprocketGet(`/orders/show/${orderId}`);
    return response;
  } catch (error: any) {
    console.error("Error fetching order details:", error);
    throw new Error(`Failed to fetch order details: ${error.message || error}`);
  }
}

// 11. Update Order
export async function updateOrder(orderData: any) {
  try {
    const response = await shiprocketPost("/orders/update/adhoc", orderData);
    return response;
  } catch (error: any) {
    console.error("Error updating order:", error);
    throw new Error(`Failed to update order: ${error.message || error}`);
  }
}

// 12. Cancel Order
export async function cancelOrder(data: { order_id: number[] }) {
  try {
    const response = await shiprocketPost("/orders/cancel", data);
    return response;
  } catch (error: any) {
    console.error("Error cancelling order:", error);
    throw new Error(`Failed to cancel order: ${error.message || error}`);
  }
}

// 13. Get Couriers List
export async function getCouriers() {
  try {
    const response = await shiprocketGet("/courier/courierListWithCounts");
    return response;
  } catch (error: any) {
    console.error("Error fetching couriers:", error);
    throw new Error(`Failed to fetch couriers: ${error.message || error}`);
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