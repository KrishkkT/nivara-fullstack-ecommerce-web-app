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

    // Fetch the AWB code for this order from Shiprocket
    // Make sure the order belongs to the current user
    let result: any = [];
    try {
      result = await sql`
        SELECT so.awb_code
        FROM shiprocket_orders so
        JOIN orders o ON so.order_id = o.id
        WHERE o.id = ${id} AND o.user_id = ${user.userId}
      `;
    } catch (error) {
      // Handle case where shiprocket_orders table doesn't exist
      console.warn("Shiprocket orders table not found, continuing without tracking data");
      result = [];
    }

    if (result.length === 0) {
      return NextResponse.json({ error: "Shipment not found for this order" }, { status: 404 });
    }

    return NextResponse.json({ awb_code: result[0].awb_code });
  } catch (error) {
    console.error("Error fetching tracking data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}