import { NextResponse } from "next/server";
import { getPickupLocations } from "@/lib/logistics/shiprocket";
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

    // Fetch pickup locations from Shiprocket
    const pickupLocations = await getPickupLocations();
    
    if (!pickupLocations || !pickupLocations.data) {
      throw new Error("Failed to fetch pickup locations from Shiprocket");
    }

    // Clear existing pickup locations
    await sql`DELETE FROM shiprocket_pickup_locations`;

    // Insert new pickup locations
    for (const location of pickupLocations.data) {
      await sql`
        INSERT INTO shiprocket_pickup_locations (
          shiprocket_location_id, name, email, phone, address, 
          city, state, country, pin_code, "primary"
        )
        VALUES (
          ${location.id}, ${location.name}, ${location.email || null}, ${location.phone || null}, 
          ${location.address}, ${location.city}, ${location.state}, ${location.country}, 
          ${location.pin_code}, ${location.primary || false}
        )
        ON CONFLICT (shiprocket_location_id) 
        DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          address = EXCLUDED.address,
          city = EXCLUDED.city,
          state = EXCLUDED.state,
          country = EXCLUDED.country,
          pin_code = EXCLUDED.pin_code,
          "primary" = EXCLUDED."primary",
          updated_at = NOW()
      `;
    }

    return NextResponse.json({ 
      success: true, 
      pickup_locations: pickupLocations.data,
      message: "Pickup locations refreshed successfully"
    });
  } catch (error) {
    console.error("Error refreshing pickup locations:", error);
    return NextResponse.json({ error: "Failed to refresh pickup locations" }, { status: 500 });
  }
}