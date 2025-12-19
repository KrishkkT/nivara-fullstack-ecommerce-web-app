import { NextResponse } from "next/server";
import { cancelOrder } from "@/lib/logistics/shiprocket";
import { sql } from "@/lib/db";
import { verifyAuth } from "@/lib/session";

export async function POST(request: Request) {
  try {
    // Verify admin access
    const token = request.headers.get("cookie")?.split("session=")[1]?.split(";")[0];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyAuth(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderIds } = await request.json();
    
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: "At least one order ID is required" }, { status: 400 });
    }

    // Cancel orders in Shiprocket
    const cancelData = {
      order_id: orderIds
    };
    
    const cancelResult = await cancelOrder(cancelData);
    
    // Update order status in our database
    for (const orderId of orderIds) {
      await sql`
        UPDATE shiprocket_orders
        SET status = 'cancelled', updated_at = NOW()
        WHERE shiprocket_order_id = ${orderId}
      `;
    }
    
    return NextResponse.json({
      success: true,
      result: cancelResult,
      message: `Successfully cancelled ${orderIds.length} order(s)`
    });
  } catch (error) {
    console.error("Shiprocket order cancellation error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to cancel order(s)" 
    }, { status: 500 });
  }
}