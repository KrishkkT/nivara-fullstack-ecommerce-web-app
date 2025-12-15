"use server"

import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { sendEmail, generateOrderNotificationEmail } from "@/lib/email"

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

    // Send email notifications to admin emails and customer
    try {
      // Get active admin emails
      const adminEmailsResult: any = await sql`
        SELECT email FROM admin_emails WHERE is_active = true
      `
      
      const adminEmails = adminEmailsResult.map((row: any) => row.email)
      
      // Get order details for email
      const orderDetails: any = await sql`
        SELECT o.*, u.full_name, u.email as customer_email, u.phone as customer_phone
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ${orderId}
      `
      
      const orderItems: any = await sql`
        SELECT * FROM order_items WHERE order_id = ${orderId}
      `
      
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
          const emailHtml = generateOrderNotificationEmail(order, customer, orderItems, shippingAddress)
          
          // Send email to admins
          if (adminEmails.length > 0) {
            await sendEmail({
              to: adminEmails,
              subject: `New Order #${order.order_number} Received`,
              html: emailHtml
            })
          }
          
          // Send confirmation email to customer
          await sendEmail({
            to: customer.email,
            subject: `Order Confirmation #${order.order_number}`,
            html: generateCustomerOrderConfirmationEmail(order, customer, orderItems, shippingAddress)
          })
        }
      }
    } catch (emailError) {
      console.error("[v0] Failed to send order notification email:", emailError)
      // Don't fail the order creation if email sending fails
      // But log this as a critical issue that needs attention
      console.error("[v0] CRITICAL: Email notification failed - this needs immediate attention!")
    }

    return { success: true, orderId, orderNumber }
  } catch (error) {
    console.error("[v0] Create order error:", error)
    return { error: "Failed to create order" }
  }
}

export async function cancelOrder(orderId: number) {
  try {
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

    // Update order status
    await sql`
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = ${orderId}
    `

    revalidatePath("/account")
    revalidatePath("/orders")
    revalidatePath(`/orders/${orderId}`)

    return { success: true }
  } catch (error) {
    console.error("[v0] Cancel order error:", error)
    return { error: "Failed to cancel order" }
  }
}

// Generate HTML email template for customer order confirmation
function generateCustomerOrderConfirmationEmail(order: any, customer: any, items: any[], shippingAddress: any): string {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">
        ${item.product_name}
        ${item.quantity > 1 ? `<br/><small>Quantity: ${item.quantity}</small>` : ''}
      </td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${(Number(item.product_price) * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">Order Confirmation</h1>
        
        <p>Dear ${customer.full_name},</p>
        
        <p>Thank you for your order! We've received your order and are processing it.</p>
        
        <p><strong>Order Number:</strong> ${order.order_number}</p>
        <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleString('en-IN')}</p>
        <p><strong>Payment Method:</strong> Online Payment</p>
        
        <h2 style="color: #B29789; border-bottom: 2px solid #B29789; padding-bottom: 5px;">Shipping Address</h2>
        <p>
          ${shippingAddress.address_line1}<br>
          ${shippingAddress.address_line2 ? `${shippingAddress.address_line2}<br>` : ''}
          ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postal_code}<br>
          ${shippingAddress.country}
        </p>
        
        <h2 style="color: #B29789; border-bottom: 2px solid #B29789; padding-bottom: 5px;">Order Items</h2>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Item</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Total Amount</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">₹${Number(order.total_amount).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <p style="margin-top: 20px;">
          We'll notify you when your order has been shipped. If you have any questions, please contact us.
        </p>
        
        <p>Thank you for shopping with NIVARA!</p>
        
        <p style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.com'}/orders/${order.id}" 
             style="display: inline-block; padding: 10px 20px; background-color: #B29789; color: white; text-decoration: none; border-radius: 4px;">
            View Order Details
          </a>
        </p>
      </div>
    </body>
    </html>
  `;
}