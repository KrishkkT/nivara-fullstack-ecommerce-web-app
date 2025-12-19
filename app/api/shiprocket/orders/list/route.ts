import { NextResponse } from "next/server";
import { getAllOrders } from "@/lib/logistics/shiprocket";
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const perPage = searchParams.get("per_page");
    
    // Get all orders from Shiprocket
    const orders = await getAllOrders(
      page ? parseInt(page) : undefined,
      perPage ? parseInt(perPage) : undefined
    );
    
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Shiprocket orders list error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to fetch orders" 
    }, { status: 500 });
  }
}