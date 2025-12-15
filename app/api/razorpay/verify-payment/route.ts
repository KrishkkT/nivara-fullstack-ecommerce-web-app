import { type NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { sendEmail, generateOrderNotificationEmail, generateCustomerOrderConfirmationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body

    // Validate required parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const secret = process.env.RAZORPAY_KEY_SECRET!
    
    if (!secret) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const generated_signature = createHmac("sha256", secret).update(text).digest("hex")

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Update order with payment details
    await sql`
      UPDATE orders
      SET 
        payment_status = 'paid',
        status = 'processing',
        razorpay_order_id = ${razorpay_order_id},
        razorpay_payment_id = ${razorpay_payment_id},
        razorpay_signature = ${razorpay_signature},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId} AND user_id = ${session.userId}
    `

    // Send email notifications to admin emails and customer after successful payment
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
          // Send email to admins
          if (adminEmails.length > 0) {
            const emailHtml = generateOrderNotificationEmail(order, customer, orderItems, shippingAddress)
            await sendEmail({
              to: adminEmails,
              subject: `New Order #${order.order_number} Received`,
              html: emailHtml
            })
          }
          
          // Send confirmation email to customer
          const customerEmailHtml = generateCustomerOrderConfirmationEmail(order, customer, orderItems, shippingAddress)
          await sendEmail({
            to: customer.email,
            subject: `Order Confirmation #${order.order_number}`,
            html: customerEmailHtml
          })
        }
      }
    } catch (emailError) {
      console.error("[v0] Failed to send order notification email after payment:", emailError)
      // Don't fail the payment verification if email sending fails
      // But log this as a critical issue that needs attention
      console.error("[v0] CRITICAL: Email notification failed after payment - this needs immediate attention!")
    }

    // Order updated successfully
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Payment verification failed" }, { status: 500 })
  }
}