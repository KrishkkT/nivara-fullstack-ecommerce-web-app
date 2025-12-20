import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const awb_code = searchParams.get("awb_code");
  
  if (!awb_code) {
    return NextResponse.json({ error: "Missing AWB code parameter" }, { status: 400 });
  }

  try {
    // Check if this AWB code exists in our Shiprocket system
    let result: any = [];
    try {
      result = await sql`
        SELECT awb_code, status, event_data, created_at, updated_at
        FROM shiprocket_orders
        WHERE awb_code = ${awb_code}
      `;
    } catch (error) {
      // Handle case where shiprocket_orders table doesn't exist
      console.warn("Shiprocket orders table not found, continuing without tracking data");
      result = [];
    }

    if (result.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    return NextResponse.json({ shipment: result[0] });
  } catch (error) {
    console.error("Error fetching shipment data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}