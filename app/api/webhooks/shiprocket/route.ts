import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// POST /api/webhooks/shiprocket - Handle Shiprocket webhook events
export async function POST(request: Request) {
  try {
    // Get raw body for signature verification (if needed)
    const bodyText = await request.text();
    const body = JSON.parse(bodyText);
    
    console.log("Shiprocket webhook received:", body);
    
    // Verify webhook signature if needed
    // const signature = request.headers.get("x-shiprocket-signature");
    // if (!verifyWebhookSignature(bodyText, signature)) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }
    
    // Process the webhook event
    const { 
      event, 
      data,
      awb,
      order_id,
      shipment_id,
      current_status,
      timestamp
    } = body;
    
    // Validate required fields
    if (!event) {
      return NextResponse.json({ error: "Missing event field" }, { status: 400 });
    }
    
    // Store the event in our tracking events table
    if (order_id) {
      await sql`
        INSERT INTO shiprocket_tracking_events (
          shiprocket_order_id, 
          awb_code, 
          event_type, 
          status, 
          location, 
          timestamp, 
          remarks, 
          raw_data
        )
        VALUES (
          ${order_id}, 
          ${awb || null}, 
          ${event}, 
          ${current_status || null}, 
          ${data?.location || null}, 
          ${timestamp ? new Date(timestamp) : null}, 
          ${data?.remarks || null}, 
          ${JSON.stringify(body)}
        )
      `;
    }
    
    // Handle different events
    switch (event) {
      case "shipment_created":
        // Update shipment status to created
        if (order_id) {
          await updateShipmentStatus(order_id, "created", body);
        }
        break;
        
      case "shipment_cancelled":
        // Update shipment status to cancelled
        if (order_id) {
          await updateShipmentStatus(order_id, "cancelled", body);
        }
        break;
        
      case "courier_assigned":
        // Update shipment status to assigned
        if (order_id) {
          await updateShipmentStatus(order_id, "assigned", body);
        }
        break;
        
      case "picked_up":
        // Update shipment status to picked up
        if (order_id) {
          await updateShipmentStatus(order_id, "picked_up", body);
        }
        break;
        
      case "in_transit":
        // Update shipment status to in transit
        if (order_id) {
          await updateShipmentStatus(order_id, "in_transit", body);
        }
        break;
        
      case "out_for_delivery":
        // Update shipment status to out for delivery
        if (order_id) {
          await updateShipmentStatus(order_id, "out_for_delivery", body);
        }
        break;
        
      case "delivered":
        // Update shipment status to delivered
        if (order_id) {
          await updateShipmentStatus(order_id, "delivered", body);
        }
        break;
        
      case "rto_initiated":
        // Update shipment status to rto initiated
        if (order_id) {
          await updateShipmentStatus(order_id, "rto_initiated", body);
        }
        break;
        
      case "rto_delivered":
        // Update shipment status to rto delivered
        if (order_id) {
          await updateShipmentStatus(order_id, "rto_delivered", body);
        }
        break;
        
      case "lost":
        // Update shipment status to lost
        if (order_id) {
          await updateShipmentStatus(order_id, "lost", body);
        }
        break;
        
      case "damaged":
        // Update shipment status to damaged
        if (order_id) {
          await updateShipmentStatus(order_id, "damaged", body);
        }
        break;
        
      case "shipment_delivered":
        // Special case for shipment_delivered event (mentioned in docs)
        if (order_id) {
          await updateShipmentStatus(order_id, "delivered", body);
        }
        break;
        
      default:
        console.warn(`Unhandled Shiprocket event: ${event}`);
        break;
    }
    
    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing Shiprocket webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Helper function to update shipment status in database
async function updateShipmentStatus(orderId: number, status: string, eventData: any) {
  try {
    // Update the shiprocket_orders table with new status
    await sql`
      UPDATE shiprocket_orders 
      SET status = ${status}, 
          event_data = ${JSON.stringify(eventData)},
          updated_at = NOW()
      WHERE order_id = ${orderId}
    `;
    
    // Also update the main orders table status if needed
    // Map Shiprocket statuses to our internal order statuses
    let orderStatus = "processing"; // default
    
    switch (status) {
      case "created":
      case "assigned":
      case "picked_up":
        orderStatus = "shipped";
        break;
      case "in_transit":
      case "out_for_delivery":
        orderStatus = "shipped";
        break;
      case "delivered":
        orderStatus = "delivered";
        break;
      case "cancelled":
        orderStatus = "cancelled";
        break;
      case "rto_initiated":
      case "rto_delivered":
        orderStatus = "returned";
        break;
    }
    
    // Update the main orders table
    await sql`
      UPDATE orders 
      SET status = ${orderStatus},
          updated_at = NOW()
      WHERE id = ${orderId}
    `;
    
    console.log(`Updated shipment status for order ${orderId} to ${status}`);
  } catch (error) {
    console.error(`Error updating shipment status for order ${orderId}:`, error);
    throw error;
  }
}