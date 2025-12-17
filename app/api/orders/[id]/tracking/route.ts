import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyAuth } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get session to verify user
    const token = request.headers.get("cookie")?.split("session=")[1]?.split(";")[0];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyAuth(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the waybill number for this order
    // Make sure the order belongs to the current user
    const result: any = await sql`
      SELECT ds.waybill_number
      FROM delhivery_shipments ds
      JOIN orders o ON ds.order_id = o.id
      WHERE o.id = ${id} AND o.user_id = ${user.userId}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Shipment not found for this order" }, { status: 404 });
    }

    return NextResponse.json({ waybill: result[0].waybill_number });
  } catch (error) {
    console.error("Error fetching tracking data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}