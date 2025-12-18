import { NextResponse } from "next/server";
import { refreshCouriersInDatabase } from "@/lib/logistics/shiprocket";
import { verifyAuth } from "@/lib/session";

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

    // Refresh couriers in database
    const result = await refreshCouriersInDatabase();

    return NextResponse.json({ 
      success: true, 
      message: `Successfully refreshed ${result.count} couriers`,
      count: result.count
    });
  } catch (error) {
    console.error("Error refreshing couriers:", error);
    return NextResponse.json({ error: "Failed to refresh couriers" }, { status: 500 });
  }
}