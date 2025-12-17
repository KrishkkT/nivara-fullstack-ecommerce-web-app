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

    // Fetch warehouses
    const warehouses: any = await sql`
      SELECT * FROM delhivery_warehouses ORDER BY created_at DESC
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

    // Create warehouse
    const result: any = await sql`
      INSERT INTO delhivery_warehouses (
        warehouse_name, warehouse_code, address_line1, address_line2, 
        city, state, postal_code, country, phone, email, is_active
      )
      VALUES (
        ${data.warehouse_name}, ${data.warehouse_code}, ${data.address_line1}, ${data.address_line2 || ''},
        ${data.city}, ${data.state}, ${data.postal_code}, ${data.country || 'India'},
        ${data.phone || ''}, ${data.email || ''}, ${data.is_active !== undefined ? data.is_active : true}
      )
      RETURNING *
    `;

    return NextResponse.json({ warehouse: result[0] });
  } catch (error) {
    console.error("Error creating warehouse:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}