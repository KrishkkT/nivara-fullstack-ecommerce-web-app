import { NextResponse } from "next/server";
import { updateOrder } from "@/lib/logistics/shiprocket";
import { sql } from "@/lib/db";
import { verifyAuth } from "@/lib/session";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Verify admin access
    const token = request.headers.get("cookie")?.split("session=")[1]?.split(";")[0];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyAuth(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const data = await request.json();
    
    // Add the order ID to the data
    data.order_id = id;
    
    // Update the order in Shiprocket
    const updateResult = await updateOrder(data);
    
    // Update order in our database if needed
    if (updateResult && updateResult.order_id) {
      await sql`
        UPDATE shiprocket_orders
        SET updated_at = NOW()
        WHERE shiprocket_order_id = ${updateResult.order_id}
      `;
    }
    
    return NextResponse.json({
      success: true,
      result: updateResult,
      message: "Order updated successfully"
    });
  } catch (error) {
    console.error("Shiprocket order update error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to update order" 
    }, { status: 500 });
  }
}