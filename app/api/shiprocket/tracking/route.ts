import { NextResponse } from "next/server";
import { trackShipment } from "@/lib/logistics/shiprocket";

export async function POST(request: Request) {
  try {
    const { trackingId } = await request.json();

    if (!trackingId) {
      return NextResponse.json({ error: "Tracking ID is required" }, { status: 400 });
    }

    // Try to track by different methods
    let trackingData;
    
    // If it's numeric, try as AWB code first
    if (/^\d+$/.test(trackingId)) {
      try {
        trackingData = await trackShipment(trackingId);
      } catch (error) {
        // If AWB tracking fails, try as order ID
        trackingData = await trackShipment(undefined, undefined, parseInt(trackingId));
      }
    } else {
      // Try as order ID
      trackingData = await trackShipment(undefined, undefined, parseInt(trackingId));
    }

    return NextResponse.json({ tracking_data: trackingData.data });
  } catch (error) {
    console.error("Error tracking shipment:", error);
    return NextResponse.json({ error: "Failed to track shipment" }, { status: 500 });
  }
}