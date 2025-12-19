import { NextResponse } from "next/server";
import { assignAWB } from "@/lib/logistics/shiprocket";
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

    const { shipmentId, courierId } = await request.json();
    
    if (!shipmentId) {
      return NextResponse.json({ error: "Shipment ID is required" }, { status: 400 });
    }

    // Assign AWB to shipment
    const awbData = {
      shipment_id: shipmentId,
      courier_id: courierId
    };
    
    const awbResult = await assignAWB(awbData);
    
    // Update shipment in our database
    if (awbResult && awbResult.awb_code) {
      await sql`
        UPDATE shiprocket_orders
        SET awb_code = ${awbResult.awb_code}, status = 'assigned', updated_at = NOW()
        WHERE shipment_id = ${shipmentId}
      `;
    }
    
    return NextResponse.json({
      success: true,
      result: awbResult,
      message: "AWB assigned successfully"
    });
  } catch (error) {
    console.error("Shiprocket AWB assignment error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to assign AWB" 
    }, { status: 500 });
  }
}