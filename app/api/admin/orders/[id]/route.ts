import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyAuth } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get session to verify admin
    const token = request.headers.get("cookie")?.split("session=")[1]?.split(";")[0];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyAuth(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch order details
    const orderResult: any = await sql`
      SELECT o.*, u.full_name as customer_name, u.email as customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ${id}
    `;

    if (orderResult.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Fetch order items
    const itemsResult: any = await sql`
      SELECT oi.*, p.name as product_name, p.slug as product_slug
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${id}
    `;

    // Fetch shipment details if exists
    let shipmentResult: any = [];
    try {
      shipmentResult = await sql`
        SELECT *
        FROM shiprocket_orders
        WHERE order_id = ${id}
      `;
    } catch (error) {
      // Handle case where shiprocket_orders table doesn't exist
      console.warn("Shiprocket orders table not found, continuing without shipment data");
      shipmentResult = [];
    }

    return NextResponse.json({
      order: orderResult[0],
      items: itemsResult,
      shipment: shipmentResult.length > 0 ? shipmentResult[0] : null
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}