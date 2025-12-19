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
        WHERE shiprocket_location_id IS NOT NULL AND name IS NOT NULL AND name != ''
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
    
    // Handle different response structures based on Shiprocket API response
    let locationsData = [];
    if (pickupLocations && pickupLocations.data) {
      // Check for shipping_address array (new API structure)
      if (Array.isArray(pickupLocations.data.shipping_address)) {
        locationsData = pickupLocations.data.shipping_address;
      } 
      // Check for pickup_locations array (old API structure)
      else if (Array.isArray(pickupLocations.data.pickup_locations)) {
        locationsData = pickupLocations.data.pickup_locations;
      } 
      // Check for nested data arrays
      else if (Array.isArray(pickupLocations.data.data)) {
        locationsData = pickupLocations.data.data;
      } 
      // Check for pickup_location array (singular form)
      else if (Array.isArray(pickupLocations.data.pickup_location)) {
        locationsData = pickupLocations.data.pickup_location;
      } 
      // Handle single object
      else if (typeof pickupLocations.data === 'object' && !Array.isArray(pickupLocations.data)) {
        locationsData = [pickupLocations.data];
      }
    }
    
    // Filter out locations without valid IDs
    locationsData = locationsData.filter((location: any) => 
      location && (location.id || location.shiprocket_location_id)
    );
    
    console.log("Processed pickup locations data:", JSON.stringify(locationsData, null, 2));
    
    // Cache the locations
    for (const location of locationsData) {
      // Skip locations with missing required fields
      if (!location.id && !location.shiprocket_location_id) {
        console.warn('Skipping pickup location with missing ID:', location);
        continue;
      }
      
      // Map fields from Shiprocket response to our database schema
      const locationId = location.id || location.shiprocket_location_id;
      const name = location.name || location.pickup_location || 'Unknown Location';
      
      // Skip locations with missing names
      if (!name || name === 'Unknown Location') {
        console.warn('Skipping pickup location with missing name:', location);
        continue;
      }
      
      const address = location.address || location.address_2 || 'Unknown Address';
      const city = location.city || 'Unknown City';
      const state = location.state || 'Unknown State';
      const country = location.country || 'India';
      const pinCode = location.pin_code || location.pincode || location['pin_code'] || '000000';
      const isPrimary = location.is_primary_location || location.primary || location['primary'] || false;
      
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
          ${isPrimary}
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

    // Filter one more time before returning
    const validLocations = locationsData.filter((location: any) => 
      location && (location.id || location.shiprocket_location_id) && location.name
    );
    
    return NextResponse.json({ pickup_locations: validLocations });
  } catch (error) {
    console.error("Error fetching pickup locations:", error);
    return NextResponse.json({ error: "Failed to fetch pickup locations" }, { status: 500 });
  }
}