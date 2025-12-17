import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { updateShipmentStatus } from "@/lib/logistics/delhivery";
import { 
  sendEmail, 
  generateShipmentCreationEmail,
  generateAdminShipmentCreationEmail,
  generateShipmentCancellationEmail,
  generateAdminShipmentCancellationEmail,
  generateNdrNotificationEmail,
  generateAdminNdrNotificationEmail
} from "@/lib/email";

// POST /api/webhooks/delhivery - Handle Delhivery webhook events
export async function POST(request: Request) {
  try {
    // Get raw body for signature verification (if needed)
    const bodyText = await request.text();
    const body = JSON.parse(bodyText);
    
    console.log("Delhivery webhook received:", body);
    
    // Verify webhook signature if needed
    // const signature = request.headers.get("x-delhivery-signature");
    // if (!verifyWebhookSignature(bodyText, signature)) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }
    
    // Process the webhook event
    const { waybill, status, event, timestamp, location, remarks } = body;
    
    if (!waybill || !status) {
      return NextResponse.json({ error: "Missing required fields: waybill, status" }, { status: 400 });
    }
    
    // Update shipment status in our database
    await updateShipmentStatus(waybill, status, body);
    
    // Send notifications based on status changes
    try {
      // Get order information
      const orderResult: any = await sql`
        SELECT ds.order_id, o.order_number, o.user_id, o.total_amount, o.created_at, u.email, u.full_name
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
        
        // Send email notifications for significant status changes
        switch (status.toLowerCase()) {
          case "created":
            // Send email to customer that shipment has been created
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
            break;
            
          case "in_transit":
            // Send email to customer that order is in transit
            await sendEmail({
              to: order.email,
              subject: `Your Order #${order.order_number} is In Transit`,
              html: `
                <div>
                  <h2>Order Update</h2>
                  <p>Hello ${order.full_name},</p>
                  <p>Your order #${order.order_number} is now in transit.</p>
                  <p>Waybill: ${waybill}</p>
                  <p>Current Location: ${location || 'N/A'}</p>
                  <p>Timestamp: ${timestamp || new Date().toISOString()}</p>
                  <p>We'll notify you when your order is out for delivery.</p>
                </div>
              `
            });
            break;
            
          case "out_for_delivery":
            // Send email to customer that order is out for delivery
            await sendEmail({
              to: order.email,
              subject: `Your Order #${order.order_number} is Out for Delivery`,
              html: `
                <div>
                  <h2>Order Update</h2>
                  <p>Hello ${order.full_name},</p>
                  <p>Your order #${order.order_number} is out for delivery.</p>
                  <p>Waybill: ${waybill}</p>
                  <p>Current Location: ${location || 'N/A'}</p>
                  <p>Timestamp: ${timestamp || new Date().toISOString()}</p>
                  <p>Our delivery executive will contact you shortly.</p>
                </div>
              `
            });
            break;
            
          case "delivered":
            // Send email to customer that order has been delivered
            await sendEmail({
              to: order.email,
              subject: `Your Order #${order.order_number} has been Delivered`,
              html: `
                <div>
                  <h2>Order Delivered</h2>
                  <p>Hello ${order.full_name},</p>
                  <p>Great news! Your order #${order.order_number} has been successfully delivered.</p>
                  <p>Waybill: ${waybill}</p>
                  <p>Delivered at: ${timestamp || new Date().toISOString()}</p>
                  <p>Location: ${location || 'N/A'}</p>
                  <p>Thank you for shopping with us!</p>
                </div>
              `
            });
            break;
            
          case "cancelled":
            // Send email to customer that shipment has been cancelled
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
            break;
            
          case "rto":
            // Send email to customer that order is being returned
            await sendEmail({
              to: order.email,
              subject: `Your Order #${order.order_number} is Being Returned`,
              html: `
                <div>
                  <h2>Order Return Initiated</h2>
                  <p>Hello ${order.full_name},</p>
                  <p>Your order #${order.order_number} is being returned to our warehouse.</p>
                  <p>Waybill: ${waybill}</p>
                  <p>Reason: ${remarks || 'N/A'}</p>
                  <p>Timestamp: ${timestamp || new Date().toISOString()}</p>
                  <p>We'll process a refund once we receive the returned item.</p>
                </div>
              `
            });
            break;
            
          case "ndr":
            // Send email to customer about NDR (Not Delivered Response)
            await sendEmail({
              to: order.email,
              subject: `Action Required for Your Order #${order.order_number}`,
              html: generateNdrNotificationEmail(order, customer, waybill, remarks || 'N/A')
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
                  subject: `NDR Alert - Order #${order.order_number}`,
                  html: generateAdminNdrNotificationEmail(order, customer, waybill, remarks || 'N/A')
                });
              }
            } catch (adminEmailError) {
              console.error("Failed to send admin NDR notification:", adminEmailError);
            }
            break;
        }
      }
    } catch (notificationError) {
      console.error("Failed to send notifications:", notificationError);
      // Don't fail the webhook processing if notifications fail
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delhivery webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/webhooks/delhivery - Health check endpoint
export async function GET() {
  return NextResponse.json({ message: "Delhivery Webhook Receiver" });
}