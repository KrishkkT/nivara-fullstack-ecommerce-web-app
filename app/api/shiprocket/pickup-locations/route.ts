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
    try {
      const cachedLocations: any = await sql`
        SELECT shiprocket_location_id as id, name, email, phone, address, city, state, country, pin_code, "primary"
        FROM shiprocket_pickup_locations
        ORDER BY "primary" DESC, name ASC
      `;

      // If we have cached locations, return them
      if (cachedLocations && cachedLocations.length > 0) {
        return NextResponse.json({ pickup_locations: cachedLocations });
      }
    } catch (cacheError) {
      console.warn("Failed to fetch cached pickup locations, fetching from Shiprocket API:", cacheError);
    }

    // Otherwise, fetch from Shiprocket API
    const pickupLocations = await getPickupLocations();
    
    // Handle different response structures
    let locationsData = [];
    if (pickupLocations && Array.isArray(pickupLocations.data)) {
      locationsData = pickupLocations.data;
    } else if (pickupLocations && pickupLocations.data && typeof pickupLocations.data === 'object') {
      // Check if it's an object with a pickup_locations array
      if (Array.isArray(pickupLocations.data.pickup_locations)) {
        locationsData = pickupLocations.data.pickup_locations;
      } else if (Array.isArray((pickupLocations.data as any).data)) {
        // Some APIs nest data in data.data
        locationsData = (pickupLocations.data as any).data;
      } else if (pickupLocations.data.pickup_location && Array.isArray(pickupLocations.data.pickup_location)) {
        // Handle pickup_location array (singular form)
        locationsData = pickupLocations.data.pickup_location;
      } else {
        // Convert single object to array
        locationsData = [pickupLocations.data];
      }
    }
    
    console.log("Processed pickup locations data:", JSON.stringify(locationsData, null, 2));
    
    // Cache the locations
    for (const location of locationsData) {
      // Skip locations with missing required fields
      if (!location.id && !location.shiprocket_location_id) {
        console.warn('Skipping pickup location with missing ID:', location);
        continue;
      }
      
      const locationId = location.id || location.shiprocket_location_id;
      const name = location.name || 'Unknown Location';
      const address = location.address || 'Unknown Address';
      const city = location.city || 'Unknown City';
      const state = location.state || 'Unknown State';
      const country = location.country || 'India';
      const pinCode = location.pin_code || location.pincode || location['pin_code'] || '000000';
      
      await sql`
        INSERT INTO shiprocket_pickup_locations (
          shiprocket_location_id, name, email, phone, address, 
          city, state, country, pin_code, "primary"
        )
        VALUES (
          ${locationId}, 
          ${name}, 
          ${location.email || null}, 
          ${location.phone || null}, 
          ${address}, 
          ${city}, 
          ${state}, 
          ${country}, 
          ${pinCode}, 
          ${location.primary || location['primary'] || false}
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

    return NextResponse.json({ pickup_locations: locationsData });
  } catch (error) {
    console.error("Error fetching pickup locations:", error);
    return NextResponse.json({ error: "Failed to fetch pickup locations" }, { status: 500 });
  }
}