import { type NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { sendEmail, generateOrderNotificationEmail, generateCustomerOrderConfirmationEmail } from "@/lib/email"
import { createShiprocketOrderAutomatically } from "@/lib/logistics/shiprocket-order-creator"

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

    // Trigger Shiprocket order creation after successful payment
    try {
      console.log(`[v0] Triggering Shiprocket order creation for order ID: ${orderId}`);
      
      // Get order details for Shiprocket creation
      const orderDetails: any = await sql`
        SELECT o.*, u.full_name, u.email, u.phone
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ${orderId}
      `;
      
      if (orderDetails.length > 0) {
        const order = orderDetails[0];
        const orderNumber = order.order_number;
        
        console.log(`[v0] Creating Shiprocket order for #${orderNumber}`);
        
        // Get shipping address
        let shippingAddress = null;
        
        // First try to get from shipping_address_id
        if (order.shipping_address_id) {
          const addressResult: any = await sql`
            SELECT * FROM addresses WHERE id = ${order.shipping_address_id}
          `;
          
          if (addressResult.length > 0) {
            shippingAddress = addressResult[0];
          }
        }
        
        // If not found, try to parse from shipping_address JSON field
        if (!shippingAddress && order.shipping_address) {
          try {
            shippingAddress = JSON.parse(order.shipping_address);
          } catch (e) {
            console.warn('[v0] Failed to parse shipping_address JSON:', e);
          }
        }
        
        // Create order data object
        const orderData = {
          shippingAddressId: order.shipping_address_id,
          shippingAddress: shippingAddress,
          paymentMethod: order.payment_type || 'prepaid',
          totalAmount: parseFloat(order.total_amount),
          user: {
            full_name: order.full_name,
            email: order.email,
            phone: order.phone
          },
          items: []
        };
        
        // Get order items
        const orderItems: any = await sql`
          SELECT * FROM order_items WHERE order_id = ${orderId}
        `;
        
        orderData.items = orderItems.map((item: any) => ({
          productId: item.product_id,
          quantity: item.quantity,
          price: parseFloat(item.product_price)
        }));
        
        // Create Shiprocket order directly
        await createShiprocketOrderAutomatically(orderId, orderNumber, orderData);
        console.log(`[v0] Successfully created Shiprocket order for order #${orderNumber}`);
      } else {
        console.error(`[v0] Order not found for ID: ${orderId}`);
      }
    } catch (shiprocketError) {
      console.error('[v0] Failed to create Shiprocket order:', shiprocketError);
      // Don't fail the payment verification if Shiprocket sync fails
    }

    // Send email notifications to admin emails and customer after successful payment
    try {
      console.log("[v0] Preparing to send email notifications...");
      
      // Get active admin emails
      const adminEmailsResult: any = await sql`
        SELECT email FROM admin_emails WHERE is_active = true
      `
      
      const adminEmails = adminEmailsResult.map((row: any) => row.email)
      console.log("[v0] Admin emails found:", adminEmails);
      
      // If no admin emails found, log a warning
      if (adminEmails.length === 0) {
        console.warn("[v0] No active admin emails found in database. Please add email addresses to the admin_emails table.");
      }

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
        
        console.log("[v0] Order details retrieved for email notification");
        
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
        
        console.log("[v0] Shipping address retrieved:", shippingAddress);
        
        if (shippingAddress) {
          // Send email to admins
          if (adminEmails.length > 0) {
            console.log("[v0] Sending admin notification email to:", adminEmails);
            const emailHtml = generateOrderNotificationEmail(order, customer, orderItems, shippingAddress)
            try {
              const emailResult = await sendEmail({
                to: adminEmails,
                subject: `New Order #${order.order_number} Received`,
                html: emailHtml
              })
              console.log("[v0] Admin notification email sent:", emailResult)
            } catch (adminEmailError) {
              console.error("[v0] Failed to send admin notification email:", adminEmailError)
            }
          } else {
            console.log("[v0] No active admin emails found, skipping admin notification");
          }
          
          // Send confirmation email to customer
          console.log("[v0] Sending customer confirmation email to:", customer.email);
          const customerEmailHtml = generateCustomerOrderConfirmationEmail(order, customer, orderItems, shippingAddress)
          try {
            const emailResult = await sendEmail({
              to: customer.email,
              subject: `Order Confirmation #${order.order_number}`,
              html: customerEmailHtml
            })
            console.log("[v0] Customer confirmation email sent:", emailResult)
          } catch (customerEmailError) {
            console.error("[v0] Failed to send customer confirmation email:", customerEmailError)
          }
        } else {
          console.warn("[v0] Shipping address not found for order, skipping email notifications")
        }
      } else {
        console.warn("[v0] Order details not found, skipping email notifications")
      }
    } catch (emailError) {
      console.error("[v0] Failed to prepare/send order notification emails:", emailError)
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