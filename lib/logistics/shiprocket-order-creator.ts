// Utility function for creating Shiprocket orders
// This can be imported in both server actions and API routes

import { sql } from "@/lib/db";
import { createOrder as createShiprocketOrder, getPickupLocations, checkCourierServiceability } from "@/lib/logistics/shiprocket";

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

interface OrderData {
  items: OrderItem[];
  shippingAddress: any;
  shippingAddressId: number | null;
  paymentMethod: string;
  totalAmount: number;
  user?: {
    full_name: string;
    email: string;
    phone: string;
  };
}

// Helper function to automatically create orders in Shiprocket
export async function createShiprocketOrderAutomatically(orderId: number, orderNumber: string, data: OrderData) {
  try {
    // Removed sensitive debugging logs for production
    
    // Get user details for the order
    // If user data is provided in orderData, use it; otherwise fetch from database
    let user = null;
    if (data.user) {
      user = data.user;
    } else {
      const userResult: any = await sql`
        SELECT u.full_name, u.email, u.phone, a.*
        FROM orders o
        JOIN users u ON o.user_id = u.id
        LEFT JOIN addresses a ON o.shipping_address_id = a.id
        WHERE o.id = ${orderId}
      `;

      if (userResult.length === 0) {
        throw new Error("User not found for order");
      }

      user = userResult[0];
    }
    
    // Get shipping address
    let shippingAddress = null;
    if (data.shippingAddressId) {
      const addressResult: any = await sql`
        SELECT * FROM addresses WHERE id = ${data.shippingAddressId}
      `;
      if (addressResult.length > 0) {
        shippingAddress = addressResult[0];
      }
    } else if (data.shippingAddress) {
      shippingAddress = data.shippingAddress;
    }

    if (!shippingAddress) {
      throw new Error("Shipping address not found");
    }

    // Get order items with product details
    // Note: Not all systems have SKU column, so we'll generate one if needed
    const orderItemsResult: any = await sql`
      SELECT oi.*, p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${orderId}
    `;

    // Removed sensitive debugging logs for production
    
    // Transform order items to Shiprocket format
    const shiprocketItems = orderItemsResult.map((item: any, index: number) => ({
      name: item.product_name,
      sku: `ORDER-${orderId}-ITEM-${index + 1}`, // Generate unique SKU if not available
      units: item.quantity,
      price: parseFloat(item.product_price),
      discount: 0, // No discount by default
      tax: 0, // No tax by default
      hsn: "", // HSN code can be added if available
      weight: 0.5 // Default weight in kg, you might want to get this from product data
    }));
    
    // Get pickup location
    let pickupLocation = null;
    try {
      const pickupLocations = await getPickupLocations();
      
      // Handle different response structures
      let locationsData = [];
      if (pickupLocations && pickupLocations.data) {
        // Check for shipping_address array (new API structure)
        if (Array.isArray(pickupLocations.data.shipping_address)) {
          locationsData = pickupLocations.data.shipping_address;
        } 
        // Check for pickup_locations array (old API structure)
        else if (Array.isArray(pickupLocations.data.pickup_locations)) {
          locationsData = pickupLocations.data.pickup_locations;
        } 
        // Check for nested data arrays
        else if (Array.isArray(pickupLocations.data.data)) {
          locationsData = pickupLocations.data.data;
        } 
        // Check for pickup_location array (singular form)
        else if (Array.isArray(pickupLocations.data.pickup_location)) {
          locationsData = pickupLocations.data.pickup_location;
        } 
        // Handle single object
        else if (typeof pickupLocations.data === 'object' && !Array.isArray(pickupLocations.data)) {
          locationsData = [pickupLocations.data];
        }
      }
      
      // Use primary pickup location or first available
      const primaryLocation = locationsData.find((loc: any) => loc.is_primary_location || loc.primary) || locationsData[0];
      if (primaryLocation) {
        // Based on the error data, we should use the pickup_location field
        pickupLocation = primaryLocation.pickup_location || primaryLocation.name || primaryLocation.id;
      }
    } catch (pickupError) {
      console.warn("Failed to fetch pickup locations for Shiprocket order:", pickupError);
    }

    // Fallback to hardcoded pickup location if none found
    if (!pickupLocation) {
      console.warn("No pickup location found, using fallback 'work'");
      pickupLocation = "work";
    }

    // Check courier serviceability before creating order (optional step)
    try {
      const serviceabilityData = {
        pickup_postcode: "396445", // Default to your pickup location postcode
        delivery_postcode: (shippingAddress.postal_code || '').toString(),
        weight: shiprocketItems.reduce((sum, item) => sum + ((item.weight || 0.5) * (item.units || 1)), 0),
        cod: data.paymentMethod === "cod" ? 1 : 0
      };
      
      // Actually call the serviceability check function
      const serviceabilityResult = await checkCourierServiceability(serviceabilityData);
    } catch (serviceabilityError) {
      console.warn("[v0] Serviceability check failed (continuing with order creation):", serviceabilityError);
    }

    // Prepare order data for Shiprocket (following the exact API specification)
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Format customer name properly
    const fullNameParts = (user.full_name || '').split(' ');
    const firstName = fullNameParts[0] || user.full_name || '';
    const lastName = fullNameParts.slice(1).join(' ') || '';
    
    const shiprocketOrderData = {
      order_id: orderNumber.toString(), // Ensure it's a string
      order_date: currentDate,
      pickup_location: pickupLocation.toString(), // Ensure it's a string
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: (shippingAddress.address_line1 || ''),
      billing_address_2: (shippingAddress.address_line2 || ''),
      billing_city: (shippingAddress.city || ''),
      billing_state: (shippingAddress.state || ''),
      billing_country: (shippingAddress.country || 'India'),
      billing_pincode: (shippingAddress.postal_code || '').toString(),
      billing_email: (user.email || ''),
      billing_phone: (user.phone || '').toString(),
      shipping_is_billing: true,
      order_items: shiprocketItems.map(item => ({
        name: item.name.toString(), // Ensure it's a string
        sku: item.sku.toString(), // Ensure it's a string
        selling_price: Math.round(item.price).toString(), // Ensure it's a string
        quantity: item.units.toString(), // Ensure it's a string
        hsn: item.hsn || ''
      })),
      payment_method: data.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
      sub_total: Math.round(data.totalAmount).toString(), // Ensure it's a string
      length: "15", // Ensure it's a string
      breadth: "10", // Ensure it's a string
      height: "5", // Ensure it's a string
      weight: Math.max(0.1, shiprocketItems.reduce((sum, item) => sum + (item.weight * item.units), 0)).toString() // Ensure it's a string
    };

    // Validate required fields before sending
    if (!shiprocketOrderData.pickup_location) {
      throw new Error("pickup_location is required");
    }
    
    if (!shiprocketOrderData.order_date) {
      throw new Error("order_date is required");
    }
    
    // Create the order in Shiprocket
    const orderResult = await createShiprocketOrder(shiprocketOrderData);
    
    if (!orderResult || !orderResult.order_id) {
      throw new Error("Failed to create order in Shiprocket: " + JSON.stringify(orderResult));
    }

    // Store the order mapping in our database
    await sql`
      INSERT INTO shiprocket_orders (order_id, shiprocket_order_id, shipment_id, awb_code, status, created_at)
      VALUES (${orderNumber}, ${orderResult.order_id.toString()}, ${orderResult.shipment_id ? orderResult.shipment_id.toString() : null}, ${orderResult.awb_code || null}, 'placed', NOW())
      ON CONFLICT (order_id) 
      DO UPDATE SET 
        shiprocket_order_id = EXCLUDED.shiprocket_order_id,
        shipment_id = EXCLUDED.shipment_id,
        awb_code = EXCLUDED.awb_code,
        status = EXCLUDED.status,
        updated_at = NOW()
    `;

    // Successfully created Shiprocket order
  } catch (error) {
    console.error(`[v0] Error creating Shiprocket order for order #${orderNumber}`);
    throw error;
  }
}