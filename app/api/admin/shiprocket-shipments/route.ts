import { NextResponse } from "next/server";
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

    // Fetch all Shiprocket shipments from our database
    const result: any = await sql`
      SELECT * FROM shiprocket_orders
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ shipments: result });
  } catch (error) {
    console.error("Error fetching Shiprocket shipments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}