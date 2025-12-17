import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyAuth } from "@/lib/session";

// GET /api/admin/waybills - Get all waybills
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

    // Fetch waybills
    const waybills: any = await sql`
      SELECT * FROM delhivery_waybills ORDER BY created_at DESC LIMIT 100
    `;

    return NextResponse.json({ waybills });
  } catch (error) {
    console.error("Error fetching waybills:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}