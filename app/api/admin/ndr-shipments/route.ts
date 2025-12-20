import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyAuth } from "@/lib/session";

// GET /api/admin/ndr-shipments - Get all NDR shipments
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

    // For Shiprocket, NDR is handled differently and tracked in shiprocket_tracking_events
    // Returning empty array as placeholder
    const shipments: any = [];

    return NextResponse.json({ shipments });
  } catch (error) {
    console.error("Error fetching NDR shipments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}