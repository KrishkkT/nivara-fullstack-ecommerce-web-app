import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const waybill = searchParams.get("waybill");
  
  if (!waybill) {
    return NextResponse.json({ error: "Missing waybill parameter" }, { status: 400 });
  }

  try {
    // Check if this waybill exists in our system
    const result: any = await sql`
      SELECT waybill_number, status, event_data, created_at, updated_at
      FROM delhivery_shipments
      WHERE waybill_number = ${waybill}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    return NextResponse.json({ shipment: result[0] });
  } catch (error) {
    console.error("Error fetching shipment data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}