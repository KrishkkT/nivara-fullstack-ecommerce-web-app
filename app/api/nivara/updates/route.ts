// Webhook handler for Nivara logistics notifications
// Endpoint: https://www.nivarasilver.in/api/nivara/updates
// This endpoint receives notifications from Shiprocket when order status changes

import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { sendEmail } from "@/lib/email"

// Define the webhook event structure according to Shiprocket specifications
// Note: Many fields are optional as they may not be present in all webhook events
interface ShiprocketWebhookEvent {
  awb?: string; // Tracking number - may not be present initially
  shipment_id?: number; // Shiprocket shipment ID - may not be present initially
  order_id: string; // This is your order number (e.g., NIVARA-1766221372643)
  current_status: string; // Status like 'SHIPPED', 'DELIVERED', etc.
  rider_name?: string; // May not be available for all shipments
  rider_contact?: string; // May not be available for all shipments
  pickup_otp?: string; // Optional pickup OTP
  drop_otp?: string; // Optional delivery OTP
  // Additional fields that might be present in some webhook events
  courier_name?: string;
  etd?: string; // Estimated delivery date
  [key: string]: any; // Allow for additional fields that Shiprocket might send
}

export async function POST(request: NextRequest) {
  try {
    const body: ShiprocketWebhookEvent = await request.json()
    
    // Handle order status updates
    await handleOrderStatusUpdate(body)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error processing Shiprocket webhook:", error)
    // According to specifications, we should respond with status code 200 even in case of errors
    return NextResponse.json({ success: false, error: "Failed to process webhook" }, { status: 200 })
  }
}

async function handleOrderStatusUpdate(data: ShiprocketWebhookEvent) {
  try {
    // Update our database with shipment information and status
    // We'll update all fields but use null for missing ones
    await sql`
      UPDATE shiprocket_orders 
      SET 
        shipment_id = ${data.shipment_id || null},
        awb_code = ${data.awb || null},
        status = ${data.current_status},
        courier_name = ${data.courier_name || null},
        estimated_delivery_date = ${data.etd || null},
        updated_at = NOW()
      WHERE order_id = ${data.order_id}
    `
    
    // If the order has been shipped, send email notification to customer
    const lowerStatus = data.current_status.toLowerCase();
    if (lowerStatus.includes('shipped') || 
        lowerStatus.includes('rider assigned') ||
        lowerStatus.includes('out for delivery') ||
        lowerStatus.includes('delivered')) {
      
      await sendShipmentNotification(data)
    }
  } catch (error) {
    console.error(`[v0] Error handling order status update for order ${data.order_id}`)
  }
}

async function sendShipmentNotification(data: ShiprocketWebhookEvent) {
  try {
    // Get order details from our database
    const orderResult: any = await sql`
      SELECT o.*, u.full_name, u.email, u.phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.order_number = ${data.order_id}
    `
    
    if (orderResult.length === 0) {
      return
    }
    
    const order = orderResult[0]
    
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
        // Failed to parse shipping address
      }
    }
    
    // Get order items
    const orderItems: any = await sql`
      SELECT * FROM order_items WHERE order_id = ${order.id}
    `
    
    // Get shipment details from our database to ensure we have all information
    const shipmentResult: any = await sql`
      SELECT *
      FROM shiprocket_orders
      WHERE order_id = ${data.order_id}
    `
    
    // Merge webhook data with database shipment data to ensure we have all information
    const mergedShipmentData = {
      ...data,
      ...(shipmentResult.length > 0 ? {
        courier_name: data.courier_name || shipmentResult[0].courier_name,
        etd: data.etd || shipmentResult[0].estimated_delivery_date
      } : {})
    };
    
    // Send shipment notification email to customer
    try {
      const emailHtml = generateShipmentNotificationEmail(
        order, 
        orderItems, 
        shippingAddress,
        mergedShipmentData
      )
      
      await sendEmail({
        to: order.email,
        subject: `Your Order #${order.order_number} Has Been Shipped!`,
        html: emailHtml
      })
    } catch (emailError) {
      console.error(`[v0] Failed to send shipment notification email for order ${order.order_number}`)
    }
  } catch (error) {
    console.error(`[v0] Error sending shipment notification for order ${data.order_id}`)
  }
}

// Generate HTML email template for shipment notification
function generateShipmentNotificationEmail(
  order: any, 
  items: any[], 
  shippingAddress: any,
  shipmentInfo: ShiprocketWebhookEvent
): string {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <div style="font-weight: bold;">${item.product_name}</div>
        <div>Quantity: ${item.quantity}</div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ₹${(item.product_price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('')
  
  // Safely handle shipping address
  let shippingAddressHtml = '';
  if (shippingAddress) {
    shippingAddressHtml = `
      <p><strong>Shipping Address:</strong></p>
      <div style="margin: 10px 0; padding: 15px; background-color: #f8f8f8; border-radius: 5px;">
        <div>${shippingAddress?.address_line1 || ''}</div>
        ${(shippingAddress?.address_line2 || '') ? `<div>${shippingAddress.address_line2}</div>` : ''}
        <div>${[shippingAddress?.city || '', shippingAddress?.state || '', shippingAddress?.postal_code || ''].filter(Boolean).join(', ')}</div>
        <div>${shippingAddress?.country || 'India'}</div>
      </div>
    `;
  }
  
  // Shipment information
  let shipmentInfoHtml = '';
  
  // Collect all available shipment information
  const shipmentDetails = [];
  
  if (shipmentInfo.awb) {
    shipmentDetails.push(`<li><strong>Tracking Number:</strong> ${shipmentInfo.awb}</li>`);
  }
  
  if (shipmentInfo.courier_name) {
    shipmentDetails.push(`<li><strong>Courier:</strong> ${shipmentInfo.courier_name}</li>`);
  }
  
  if (shipmentInfo.rider_name) {
    shipmentDetails.push(`<li><strong>Rider Name:</strong> ${shipmentInfo.rider_name}</li>`);
  }
  
  if (shipmentInfo.rider_contact) {
    shipmentDetails.push(`<li><strong>Rider Contact:</strong> ${shipmentInfo.rider_contact}</li>`);
  }
  
  if (shipmentInfo.pickup_otp) {
    shipmentDetails.push(`<li><strong>Pickup OTP:</strong> ${shipmentInfo.pickup_otp}</li>`);
  }
  
  if (shipmentInfo.drop_otp) {
    shipmentDetails.push(`<li><strong>Delivery OTP:</strong> ${shipmentInfo.drop_otp}</li>`);
  }
  
  if (shipmentInfo.etd) {
    // Format the estimated delivery date
    let formattedEtd = shipmentInfo.etd;
    try {
      const etdDate = new Date(shipmentInfo.etd);
      if (!isNaN(etdDate.getTime())) {
        formattedEtd = etdDate.toLocaleDateString('en-IN');
      }
    } catch (e) {
      // Keep original value if parsing fails
    }
    shipmentDetails.push(`<li><strong>Estimated Delivery:</strong> ${formattedEtd}</li>`);
  }
  
  // Only show shipment details section if we have any information
  if (shipmentDetails.length > 0) {
    shipmentInfoHtml = `
      <p><strong>Shipment Details:</strong></p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        ${shipmentDetails.join('\n        ')}
      </ul>
    `;
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Order Has Been Shipped!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">Your Order Has Been Shipped!</h1>
        
        <p>Dear Customer,</p>
        
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <p><strong>Order Details:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Order Number:</strong> ${order.order_number || ''}</li>
          <li><strong>Order Date:</strong> ${order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : ''}</li>
          <li><strong>Total Amount:</strong> ₹${order.total_amount ? parseFloat(order.total_amount).toFixed(2) : '0.00'}</li>
          <li><strong>Current Status:</strong> ${shipmentInfo.current_status}</li>
          ${order.contact_phone ? `<li><strong>Contact Phone:</strong> ${order.contact_phone}</li>` : ''}
          ${order.contact_email ? `<li><strong>Contact Email:</strong> ${order.contact_email}</li>` : ''}
        </ul>
        
        ${shipmentInfoHtml}
        
        <p><strong>Items Shipped:</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <thead>
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        ${shippingAddressHtml}
        
        <p>You can track your shipment using the tracking number above. You should receive your order soon.</p>
        
        <p>Thank you for shopping with us!</p>
      </div>
    </body>
    </html>
  `
}