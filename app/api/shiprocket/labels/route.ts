import { NextResponse } from "next/server";
import { generateShippingLabel } from "@/lib/logistics/shiprocket";
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

    const { shipmentId } = await request.json();

    if (!shipmentId) {
      return NextResponse.json({ error: "Shipment ID is required" }, { status: 400 });
    }

    // Generate the shipping label
    const labelResult = await generateShippingLabel(shipmentId);
    
    if (!labelResult || !labelResult.label_url) {
      throw new Error("Failed to generate shipping label");
    }

    // For now, we'll return the label URL
    // In a production environment, you might want to download and serve the PDF directly
    return NextResponse.json({
      success: true,
      label_url: labelResult.label_url,
      message: "Label generated successfully"
    });
  } catch (error) {
    console.error("Shiprocket label generation error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to generate shipping label" 
    }, { status: 500 });
  }
}