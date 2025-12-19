import { NextResponse } from "next/server";
import { checkCourierServiceability } from "@/lib/logistics/shiprocket";
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

    const data = await request.json();
    
    // Validate required fields
    if (!data.pickup_postcode || !data.delivery_postcode) {
      return NextResponse.json({ 
        error: "pickup_postcode and delivery_postcode are required" 
      }, { status: 400 });
    }

    // One of either the 'order_id' or 'cod' and 'weight' is required
    if (!data.order_id && (data.cod === undefined || data.weight === undefined)) {
      return NextResponse.json({ 
        error: "Either order_id or both cod and weight are required" 
      }, { status: 400 });
    }

    // Check courier serviceability
    const serviceabilityData = {
      pickup_postcode: data.pickup_postcode,
      delivery_postcode: data.delivery_postcode,
      order_id: data.order_id,
      cod: data.cod,
      weight: data.weight,
      length: data.length,
      breadth: data.breadth,
      height: data.height,
      declared_value: data.declared_value,
      mode: data.mode,
      is_return: data.is_return
    };

    const serviceabilityResult = await checkCourierServiceability(serviceabilityData);
    
    return NextResponse.json({
      success: true,
      result: serviceabilityResult
    });
  } catch (error) {
    console.error("Shiprocket serviceability check error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to check serviceability" 
    }, { status: 500 });
  }
}