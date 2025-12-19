import { NextResponse } from "next/server";
import { trackShipment } from "@/lib/logistics/shiprocket";
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

    const { awbCode } = await request.json();
    
    if (!awbCode) {
      return NextResponse.json({ error: "AWB Code is required" }, { status: 400 });
    }

    // Track shipment by AWB code
    const trackingData = await trackShipment(awbCode);
    
    return NextResponse.json({
      success: true,
      tracking_data: trackingData.data
    });
  } catch (error) {
    console.error("Shiprocket AWB tracking error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to track shipment" 
    }, { status: 500 });
  }
}