import { NextResponse } from "next/server";
import { getPickupLocations } from "@/lib/logistics/shiprocket";
import { sql } from "@/lib/db";
import { verifyAuth } from "@/lib/session";

export async function GET(request: Request) {
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

    // First try to get pickup locations from our cache
    const cachedLocations: any = await sql`
      SELECT shiprocket_location_id as id, name, email, phone, address, city, state, country, pin_code, primary
      FROM shiprocket_pickup_locations
      ORDER BY primary DESC, name ASC
    `;

    // If we have cached locations, return them
    if (cachedLocations.length > 0) {
      return NextResponse.json({ pickup_locations: cachedLocations });
    }

    // Otherwise, fetch from Shiprocket API
    const pickupLocations = await getPickupLocations();
    
    // Cache the locations
    for (const location of pickupLocations.data) {
      await sql`
        INSERT INTO shiprocket_pickup_locations (
          shiprocket_location_id, name, email, phone, address, 
          city, state, country, pin_code, primary
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
          primary = EXCLUDED.primary,
          updated_at = NOW()
      `;
    }

    return NextResponse.json({ pickup_locations: pickupLocations.data });
  } catch (error) {
    console.error("Error fetching pickup locations:", error);
    return NextResponse.json({ error: "Failed to fetch pickup locations" }, { status: 500 });
  }
}