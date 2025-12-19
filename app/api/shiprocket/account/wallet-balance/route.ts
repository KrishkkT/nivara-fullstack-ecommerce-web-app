import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/session";

// Generic function to make GET requests to Shiprocket API
async function shiprocketGet(endpoint: string) {
  // Import here to avoid circular dependencies
  const { default: sr } = await import("@/lib/logistics/shiprocket");
  
  try {
    const token = await sr.authenticateAndGetToken();
    const response = await fetch(`https://apiv2.shiprocket.in/v1/external${endpoint}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shiprocket API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in shiprocketGet for ${endpoint}:`, error);
    throw error;
  }
}

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

    // Get wallet balance from Shiprocket
    const walletData = await shiprocketGet("/account/details/wallet-balance");
    
    return NextResponse.json({
      success: true,
      balance: walletData.data
    });
  } catch (error) {
    console.error("Shiprocket wallet balance error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to fetch wallet balance" 
    }, { status: 500 });
  }
}