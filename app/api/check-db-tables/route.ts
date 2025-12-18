import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Checking database tables...");
    
    // Check if shiprocket_orders table exists
    const ordersTable = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'shiprocket_orders'
      );
    `;
    
    // Check if shiprocket_pickup_locations table exists
    const pickupTable = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'shiprocket_pickup_locations'
      );
    `;
    
    // Check if shiprocket_couriers table exists
    const couriersTable = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'shiprocket_couriers'
      );
    `;
    
    // Check if shiprocket_tracking_events table exists
    const trackingTable = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'shiprocket_tracking_events'
      );
    `;
    
    const tablesExist = {
      shiprocket_orders: ordersTable[0].exists,
      shiprocket_pickup_locations: pickupTable[0].exists,
      shiprocket_couriers: couriersTable[0].exists,
      shiprocket_tracking_events: trackingTable[0].exists
    };
    
    console.log("Database tables status:", tablesExist);
    
    return NextResponse.json({ 
      success: true, 
      tables: tablesExist,
      message: "Database tables checked successfully!"
    });
  } catch (error) {
    console.error("Error checking database tables:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}