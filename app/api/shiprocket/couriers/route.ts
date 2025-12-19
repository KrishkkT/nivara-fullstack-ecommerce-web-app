import { NextResponse } from "next/server";
import { getCouriers } from "@/lib/logistics/shiprocket";
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

    // First try to get couriers from our cache
    const cachedCouriers: any = await sql`
      SELECT courier_id as id, courier_name as name, status
      FROM shiprocket_couriers
      ORDER BY courier_name ASC
    `;

    // If we have cached couriers, return them
    if (cachedCouriers.length > 0) {
      return NextResponse.json({ couriers: cachedCouriers });
    }

    // Otherwise, fetch from Shiprocket API
    const couriersData = await getCouriers();
    
    return NextResponse.json({ couriers: couriersData.data || [] });
  } catch (error: any) {
    console.error("Error fetching couriers:", error);
    return NextResponse.json({ error: "Failed to fetch couriers" }, { status: 500 });
  }
}