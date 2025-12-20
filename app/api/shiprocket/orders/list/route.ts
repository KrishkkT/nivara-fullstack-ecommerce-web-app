import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyAuth } from "@/lib/session";

export async function GET(request: Request) {
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

    // Fetch orders with Shiprocket integration data
    const orders: any = await sql`
      SELECT 
        so.id,
        so.order_id as local_order_number,
        so.shiprocket_order_id,
        so.shipment_id,
        so.awb_code,
        so.status,
        so.created_at,
        so.updated_at,
        o.order_number,
        o.total_amount,
        u.full_name as customer_name
      FROM shiprocket_orders so
      JOIN orders o ON so.order_id = o.order_number
      JOIN users u ON o.user_id = u.id
      ORDER BY so.created_at DESC
      LIMIT 50
    `;

    return NextResponse.json({ 
      success: true,
      orders: orders.map((order: any) => ({
        ...order,
        total_amount: parseFloat(order.total_amount)
      }))
    });
  } catch (error) {
    console.error("Error fetching Shiprocket orders:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to fetch orders" 
    }, { status: 500 });
  }
}