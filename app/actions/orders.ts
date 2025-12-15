"use server"

import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { sendEmail, generateOrderCancellationEmail } from "@/lib/email"

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
    const session = await getSession()

    if (!session) {
      return { error: "Please sign in to place an order" }
    }

    // Generate order number
    const orderNumber = `NIVARA-${Date.now()}`

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
        'pending',
        'awaiting_payment',
        ${data.paymentMethod},
        ${data.shippingAddressId ? null : JSON.stringify(data.shippingAddress)},
        ${data.shippingAddressId || null}
      )
      RETURNING id
    `

    const orderId = order[0].id

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
        try {
          console.log(`[v0] Sending cancellation email to ${customer.email}`);
          const emailHtml = generateOrderCancellationEmail(order, customer, orderItems, shippingAddress)
          await sendEmail({
            to: customer.email,
            subject: `Order #${order.order_number} Cancelled`,
            html: emailHtml
          })
          console.log(`[v0] Cancellation email sent successfully to ${customer.email}`);
        } catch (emailError) {
          console.error("[v0] Failed to send cancellation email:", emailError)
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