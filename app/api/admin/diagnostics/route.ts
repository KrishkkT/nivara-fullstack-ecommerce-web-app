import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyAuth } from "@/lib/session";

// GET /api/admin/diagnostics - Get diagnostics information
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

    // Get waybill statistics
    const waybillStats: any = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
        COUNT(CASE WHEN status = 'used' THEN 1 END) as used,
        COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired
      FROM delhivery_waybills
    `;

    // Get recent waybills
    const recentWaybills: any = await sql`
      SELECT waybill_number, status, created_at, used_at
      FROM delhivery_waybills
      ORDER BY created_at DESC
      LIMIT 10
    `;

    // Get shipment statistics
    const shipmentStats: any = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'created' THEN 1 END) as created,
        COUNT(CASE WHEN status = 'in_transit' THEN 1 END) as in_transit,
        COUNT(CASE WHEN status = 'out_for_delivery' THEN 1 END) as out_for_delivery,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
        COUNT(CASE WHEN status = 'rto' THEN 1 END) as rto,
        COUNT(CASE WHEN status = 'ndr' THEN 1 END) as ndr
      FROM delhivery_shipments
    `;

    // Get recent shipments
    const recentShipments: any = await sql`
      SELECT waybill_number, order_id, status, created_at, updated_at, event_data
      FROM delhivery_shipments
      ORDER BY created_at DESC
      LIMIT 10
    `;

    // Get warehouse information
    const warehouses: any = await sql`
      SELECT warehouse_name, warehouse_code, city, state, is_active, created_at
      FROM delhivery_warehouses
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      waybillStats: waybillStats[0],
      recentWaybills,
      shipmentStats: shipmentStats[0],
      recentShipments,
      warehouses
    });
  } catch (error) {
    console.error("Error fetching diagnostics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}