import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyAuth } from "@/lib/session";

// GET /api/admin/warehouses - Get all warehouses
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

    // Fetch Shiprocket pickup locations
    const warehouses: any = await sql`
      SELECT * FROM shiprocket_pickup_locations ORDER BY created_at DESC
    `;

    return NextResponse.json({ warehouses });
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/warehouses - Create a new warehouse
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
    if (!data.warehouse_name || !data.warehouse_code || !data.address_line1 || 
        !data.city || !data.state || !data.postal_code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create Shiprocket pickup location
    // Note: This is a simplified version. In practice, you'd sync with Shiprocket API
    const result: any = await sql`
      INSERT INTO shiprocket_pickup_locations (
        shiprocket_location_id, name, email, phone, address, 
        city, state, pin_code, country, "primary"
      )
      VALUES (
        ${Math.floor(Math.random() * 1000000)}, ${data.warehouse_name}, ${data.email || ''}, ${data.phone || ''}, ${data.address_line1},
        ${data.city}, ${data.state}, ${data.postal_code}, ${data.country || 'India'},
        ${data.is_active !== undefined ? data.is_active : true}
      )
      RETURNING *
    `;

    return NextResponse.json({ warehouse: result[0] });
  } catch (error) {
    console.error("Error creating warehouse:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}