import { NextResponse } from "next/server";
import { createOrder, checkCourierServiceability, getPickupLocations } from "@/lib/logistics/shiprocket";
import { sql } from "@/lib/db";
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

    const data = await request.json();
    
    // Validate required fields
    if (!data.order_id || !data.billing_customer_name || !data.billing_address || 
        !data.billing_city || !data.billing_state || !data.billing_pincode || 
        !data.billing_phone || !data.shipping_is_billing || !data.order_items || 
        !data.payment_method || !data.sub_total) {
      return NextResponse.json({ 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    // Get pickup location
    let pickupLocation = data.pickup_location;
    if (!pickupLocation) {
      try {
        const pickupLocations = await getPickupLocations();
        
        // Handle different response structures
        let locationsData = [];
        if (Array.isArray(pickupLocations.data)) {
          locationsData = pickupLocations.data;
        } else if (pickupLocations.data && typeof pickupLocations.data === 'object') {
          // Check if it's an object with a pickup_locations array
          if (Array.isArray(pickupLocations.data.pickup_locations)) {
            locationsData = pickupLocations.data.pickup_locations;
          } else if (Array.isArray((pickupLocations.data as any).data)) {
            // Some APIs nest data in data.data
            locationsData = (pickupLocations.data as any).data;
          } else {
            // Convert single object to array
            locationsData = [pickupLocations.data];
          }
        }
        
        // Use primary pickup location or first available
        const primaryLocation = locationsData.find((loc: any) => loc.primary) || locationsData[0];
        if (primaryLocation) {
          pickupLocation = primaryLocation.name || primaryLocation.id;
        }
      } catch (pickupError) {
        console.warn("Failed to fetch pickup locations:", pickupError);
      }
    }
    
    // If we still don't have a pickup location, return an error
    if (!pickupLocation) {
      return NextResponse.json({ 
        error: "No pickup location configured. Please configure a pickup location in your Shiprocket account." 
      }, { status: 400 });
    }

    // Check courier serviceability before creating order
    const serviceabilityData = {
      pickup_postcode: data.pickup_postcode || "110001", // Default to Delhi pincode
      delivery_postcode: data.billing_pincode,
      weight: data.order_items.reduce((sum: number, item: any) => sum + (item.weight || 0.5), 0),
      cod: data.payment_method === "cod"
    };

    try {
      const serviceability = await checkCourierServiceability(serviceabilityData);
      console.log("Serviceability check result:", serviceability);
    } catch (serviceabilityError) {
      console.warn("Serviceability check failed:", serviceabilityError);
      // Continue with order creation even if serviceability check fails
    }

    // Prepare order data with pickup location
    // Use pickup location from frontend if provided, otherwise use fetched location
    const orderData = {
      ...data,
      pickup_location: data.pickup_location || data.pickup_address_id || pickupLocation
    };
    
    // Create the order in Shiprocket
    const orderResult = await createOrder(orderData);
    
    if (!orderResult || !orderResult.order_id) {
      throw new Error("Failed to create order in Shiprocket");
    }

    // Store order data in our database
    const orderId = orderResult.order_id;
    const shipmentId = orderResult.shipment_id;
    const awbCode = orderResult.awb_code;

    // Store the order mapping in our database
    await sql`
      INSERT INTO shiprocket_orders (order_id, shiprocket_order_id, shipment_id, awb_code, status, created_at)
      VALUES (${data.order_id}, ${orderId}, ${shipmentId || null}, ${awbCode || null}, 'placed', NOW())
      ON CONFLICT (order_id) 
      DO UPDATE SET 
        shiprocket_order_id = EXCLUDED.shiprocket_order_id,
        shipment_id = EXCLUDED.shipment_id,
        awb_code = EXCLUDED.awb_code,
        status = EXCLUDED.status,
        updated_at = NOW()
    `;

    return NextResponse.json({
      success: true,
      order_id: orderId,
      shipment_id: shipmentId,
      awb_code: awbCode,
      message: "Order created successfully"
    });
  } catch (error) {
    console.error("Shiprocket order creation error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to create order" 
    }, { status: 500 });
  }
}