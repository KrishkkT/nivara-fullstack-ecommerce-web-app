import { NextResponse } from "next/server";
import { getOrderDetails } from "@/lib/logistics/shiprocket";
import { verifyAuth } from "@/lib/session";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Verify admin access
    const token = request.headers.get("cookie")?.split("session=")[1]?.split(";")[0];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyAuth(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Get order details from Shiprocket
    const orderDetails = await getOrderDetails(parseInt(id));
    
    return NextResponse.json({ order: orderDetails });
  } catch (error) {
    console.error("Shiprocket order details error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to fetch order details" 
    }, { status: 500 });
  }
}