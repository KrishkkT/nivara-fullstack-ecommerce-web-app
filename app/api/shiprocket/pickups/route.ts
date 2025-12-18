import { NextResponse } from "next/server";
import { requestPickup } from "@/lib/logistics/shiprocket";
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

    const { shipmentIds, pickupDate } = await request.json();

    if (!shipmentIds || !Array.isArray(shipmentIds) || shipmentIds.length === 0) {
      return NextResponse.json({ error: "At least one shipment ID is required" }, { status: 400 });
    }

    // Request pickup from Shiprocket
    const pickupData = {
      shipment_id: shipmentIds,
      pickup_date: pickupDate // Optional
    };

    const pickupResult = await requestPickup(pickupData);
    
    if (!pickupResult || !pickupResult.pickup_token) {
      throw new Error("Failed to request pickup");
    }

    return NextResponse.json({
      success: true,
      pickup_token: pickupResult.pickup_token,
      message: "Pickup requested successfully"
    });
  } catch (error) {
    console.error("Shiprocket pickup request error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to request pickup" 
    }, { status: 500 });
  }
}