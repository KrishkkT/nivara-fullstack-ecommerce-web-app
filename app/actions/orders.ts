"use server"

import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { sendEmail, generateCancellationConfirmationEmail } from "@/lib/email"
import { createOrder as createShiprocketOrder, getPickupLocations, checkCourierServiceability } from "@/lib/logistics/shiprocket"

interface OrderItem {
  productId: number
  quantity: number
  price: number
}

interface OrderData {
  items: OrderItem[]
  shippingAddress: any
  shippingAddressId: number | null
  paymentMethod: string
  totalAmount: number
}

export async function createOrder(data: OrderData) {
  try {
    console.log("[v0] Creating order with data:", JSON.stringify(data, null, 2));
    
    const session = await getSession()

    if (!session) {
      return { error: "Please sign in to place an order" }
    }
    
    console.log(`[v0] User authenticated: ${session.userId}`);

    // Generate order number
    const orderNumber = `NIVARA-${Date.now()}`
    console.log(`[v0] Generated order number: ${orderNumber}`);

    const order: any = await sql`
      INSERT INTO orders (
        user_id, 
        order_number, 
        total_amount, 
        status, 
        payment_status,
        payment_type,
        shipping_address,
        shipping_address_id
      )
      VALUES (
        ${session.userId},
        ${orderNumber},
        ${data.totalAmount},
        'processing',
        'paid',
        ${data.paymentMethod},
        ${data.shippingAddressId ? null : JSON.stringify(data.shippingAddress)},
        ${data.shippingAddressId || null}
      )
      RETURNING id
    `

    const orderId = order[0].id
    console.log(`[v0] Created order in database with ID: ${orderId}`);

    // Insert order items
    for (const item of data.items) {
      const product: any = await sql`
        SELECT name, price FROM products WHERE id = ${item.productId}
      `

      await sql`
        INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
        VALUES (${orderId}, ${item.productId}, ${product[0].name}, ${item.price}, ${item.quantity})
      `
    }

    // Clear cart
    await sql`
      DELETE FROM cart_items WHERE user_id = ${session.userId}
    `

    revalidatePath("/cart")
    revalidatePath("/orders")
    // Revalidate the cart count API endpoint to update the cart counter
    revalidatePath("/api/cart/count")

    // Save the checkout address as default if it's a new address
    try {
      // Only save if it's a new address (not from existing saved addresses)
      if (!data.shippingAddressId && data.shippingAddress) {
        // Check if this address already exists for this user
        const existingAddresses: any = await sql`
          SELECT id FROM addresses 
          WHERE user_id = ${session.userId}
          AND address_line1 = ${data.shippingAddress.address_line1}
          AND city = ${data.shippingAddress.city}
          AND state = ${data.shippingAddress.state}
          AND postal_code = ${data.shippingAddress.postal_code}
        `

        if (existingAddresses.length === 0) {
          // Mark all existing addresses as non-default
          await sql`
            UPDATE addresses 
            SET is_default = false 
            WHERE user_id = ${session.userId}
          `

          // Save the new address as default
          await sql`
            INSERT INTO addresses (
              user_id, 
              address_line1, 
              address_line2, 
              city, 
              state, 
              postal_code, 
              country, 
              is_default
            )
            VALUES (
              ${session.userId},
              ${data.shippingAddress.address_line1},
              ${data.shippingAddress.address_line2 || ''},
              ${data.shippingAddress.city},
              ${data.shippingAddress.state},
              ${data.shippingAddress.postal_code},
              ${data.shippingAddress.country || 'India'},
              true
            )
          `
        } else {
          // If address exists, make it the default
          const addressId = existingAddresses[0].id
          await sql`
            UPDATE addresses 
            SET is_default = false 
            WHERE user_id = ${session.userId}
          `
          await sql`
            UPDATE addresses 
            SET is_default = true 
            WHERE id = ${addressId}
          `
        }
      } else if (data.shippingAddressId) {
        // If using an existing address, make it the default
        await sql`
          UPDATE addresses 
          SET is_default = false 
          WHERE user_id = ${session.userId}
        `
        await sql`
          UPDATE addresses 
          SET is_default = true 
          WHERE id = ${data.shippingAddressId}
        `
      }
    } catch (addressError) {
      console.error("[v0] Failed to save default address:", addressError)
      // Don't fail the order creation if address saving fails
    }

    // Automatically create order in Shiprocket
    console.log(`[v0] Attempting to create Shiprocket order for order #${orderNumber} (ID: ${orderId})`);
    try {
      await createShiprocketOrderAutomatically(orderId, orderNumber, data);
    } catch (shiprocketError) {
      console.error("[v0] Failed to create Shiprocket order:", shiprocketError);
      // Don't fail the order creation if Shiprocket sync fails
    }

    // Email notifications will be sent after successful payment verification

    return { success: true, orderId, orderNumber }
  } catch (error) {
    return { error: "Failed to create order" }
  }
}

export async function cancelOrder(orderId: number) {
  try {
    console.log(`[v0] User attempting to cancel order ${orderId}`);
    
    const session = await getSession()

    if (!session) {
      return { error: "Please sign in to cancel order" }
    }

    // Check if order belongs to user
    const order: any = await sql`
      SELECT * FROM orders WHERE id = ${orderId} AND user_id = ${session.userId}
    `

    if (order.length === 0) {
      return { error: "Order not found" }
    }

    // Only allow cancellation for pending or processing orders
    if (!["pending", "processing"].includes(order[0].status)) {
      return { error: "Cannot cancel order in current status" }
    }

    // Get order details for email
    const orderDetails: any = await sql`
      SELECT o.*, u.full_name, u.email as customer_email, u.phone as customer_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ${orderId} AND o.user_id = ${session.userId}
    `

    const orderItems: any = await sql`
      SELECT * FROM order_items WHERE order_id = ${orderId}
    `

    // Update order status
    await sql`
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = ${orderId}
    `
    
    console.log(`[v0] Order ${orderId} cancelled successfully by user`);

    // Send cancellation email to customer
    if (orderDetails.length > 0) {
      const order = orderDetails[0]
      const customer = {
        full_name: order.full_name,
        email: order.customer_email,
        phone: order.customer_phone
      }

      // Get shipping address
      let shippingAddress = null
      if (order.shipping_address_id) {
        const addressResult: any = await sql`
          SELECT * FROM addresses WHERE id = ${order.shipping_address_id}
        `
        if (addressResult.length > 0) {
          shippingAddress = addressResult[0]
        }
      } else if (order.shipping_address) {
        try {
          shippingAddress = JSON.parse(order.shipping_address)
        } catch (e) {
          shippingAddress = {}
        }
      }

      if (shippingAddress) {
        // Send cancellation email to customer
        try {
          console.log(`[v0] Sending cancellation email to ${customer.email}`);
          const emailHtml = generateCancellationConfirmationEmail(order, customer, orderItems)
          await sendEmail({
            to: customer.email,
            subject: `Order #${order.order_number} Cancelled`,
            html: emailHtml
          })
          console.log(`[v0] Cancellation email sent successfully to ${customer.email}`);
        } catch (emailError) {
          console.error("[v0] Failed to send cancellation email to customer:", emailError)
        }
        
        // Send cancellation notification to admins
        try {
          // Get active admin emails
          const adminEmailsResult: any = await sql`
            SELECT email FROM admin_emails WHERE is_active = true
          `
          
          const adminEmails = adminEmailsResult.map((row: any) => row.email)
          
          if (adminEmails.length > 0) {
            const emailHtml = generateCancellationConfirmationEmail(order, customer, orderItems)
            await sendEmail({
              to: adminEmails,
              subject: `Order #${order.order_number} Cancelled by User - Admin Notification`,
              html: emailHtml
            })
            console.log(`[v0] Cancellation notification email sent successfully to admins`);
          }
        } catch (adminEmailError) {
          console.error("[v0] Failed to send cancellation notification email to admins:", adminEmailError)
        }
      } else {
        console.warn("[v0] No shipping address found for order, skipping cancellation email");
      }
    }

    revalidatePath("/account")
    revalidatePath("/orders")
    revalidatePath(`/orders/${orderId}`)

    return { success: true }
  } catch (error) {
    console.error("[v0] Failed to cancel order:", error);
    return { error: "Failed to cancel order" }
  }
}

// Helper function to automatically create orders in Shiprocket
async function createShiprocketOrderAutomatically(orderId: number, orderNumber: string, data: OrderData) {
  try {
    console.log(`[v0] Starting automatic Shiprocket order creation for order #${orderNumber} (ID: ${orderId})`);
    console.log(`[v0] Order data:`, JSON.stringify(data, null, 2));
    
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

    // Log for debugging
    console.log('[v0] Order items result:', JSON.stringify(orderItemsResult, null, 2));
    
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
    
    console.log('[v0] Shiprocket items:', JSON.stringify(shiprocketItems, null, 2));

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
        pickupLocation = primaryLocation.name || primaryLocation.pickup_location || primaryLocation.id;
      }
    } catch (pickupError) {
      console.warn("Failed to fetch pickup locations for Shiprocket order:", pickupError);
    }

    if (!pickupLocation) {
      throw new Error("No pickup location configured");
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
      console.log("[v0] Checking courier serviceability with data:", JSON.stringify(serviceabilityData, null, 2));
      const serviceabilityResult = await checkCourierServiceability(serviceabilityData);
      console.log("[v0] Serviceability check result:", JSON.stringify(serviceabilityResult, null, 2));
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
      order_id: orderNumber,
      order_date: currentDate,
      pickup_location: pickupLocation,
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
        name: item.name,
        sku: item.sku,
        selling_price: Math.round(item.price),
        units: item.units,
        hsn: item.hsn || ''
      })),
      payment_method: data.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
      sub_total: Math.round(data.totalAmount),
      length: 15,
      breadth: 10,
      height: 5,
      weight: Math.max(0.1, shiprocketItems.reduce((sum, item) => sum + (item.weight * item.units), 0))
    };

    // Log the data being sent to Shiprocket for debugging
    console.log('[v0] Sending data to Shiprocket:', JSON.stringify(shiprocketOrderData, null, 2));
    
    // Create the order in Shiprocket
    const orderResult = await createShiprocketOrder(shiprocketOrderData);
    
    console.log('[v0] Shiprocket response:', JSON.stringify(orderResult, null, 2));
    
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

    console.log(`[v0] Successfully created Shiprocket order for order #${orderNumber}`);
  } catch (error) {
    console.error(`[v0] Error creating Shiprocket order for order #${orderNumber}:`, error);
    throw error;
  }
}