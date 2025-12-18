import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { 
  getPickupLocations,
  getCouriers,
  createOrder,
  checkCourierServiceability,
  assignAWB,
  generateShippingLabel,
  requestPickup,
  trackShipment,
  cancelOrder
} from "@/lib/logistics/shiprocket";

// Helper function to verify admin access
async function verifyAdmin(request: Request) {
  const token = request.headers.get("cookie")?.split("session=")[1]?.split(";")[0];
  if (!token) {
    return { success: false, error: "Unauthorized" };
  }

  const user = await verifyAuth(token);
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  return { success: true, user };
}

// GET /api/logistics - Health check endpoint
export async function GET() {
  return NextResponse.json({ message: "Shiprocket Logistics API" });
}

// POST /api/logistics - Handle various logistics operations
export async function POST(request: Request) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case "get-pickup-locations":
        // Try to get from cache first
        const cachedLocations: any = await sql`
          SELECT shiprocket_location_id as id, name, email, phone, address, city, state, country, pin_code, "primary"
          FROM shiprocket_pickup_locations
          ORDER BY "primary" DESC, name ASC
        `;

        // If we have cached locations, return them
        if (cachedLocations.length > 0) {
          return NextResponse.json({ pickup_locations: cachedLocations });
        }

        // Otherwise, fetch from Shiprocket API
        const pickupLocations = await getPickupLocations();
        
        // Cache the locations
        for (const location of pickupLocations.data) {
          await sql`
            INSERT INTO shiprocket_pickup_locations (
              shiprocket_location_id, name, email, phone, address, 
              city, state, country, pin_code, "primary"
            )
            VALUES (
              ${location.id}, ${location.name}, ${location.email || null}, ${location.phone || null}, 
              ${location.address}, ${location.city}, ${location.state}, ${location.country}, 
              ${location.pin_code}, ${location.primary || false}
            )
            ON CONFLICT (shiprocket_location_id) 
            DO UPDATE SET
              name = EXCLUDED.name,
              email = EXCLUDED.email,
              phone = EXCLUDED.phone,
              address = EXCLUDED.address,
              city = EXCLUDED.city,
              state = EXCLUDED.state,
              country = EXCLUDED.country,
              pin_code = EXCLUDED.pin_code,
              "primary" = EXCLUDED."primary",
              updated_at = NOW()
          `;
        }

        return NextResponse.json({ pickup_locations: pickupLocations.data });

      case "get-couriers":
        const couriers = await getCouriers();
        return NextResponse.json(couriers);

      case "check-serviceability":
        const { pickup_postcode, delivery_postcode, order_id, cod, weight, length, breadth, height, declared_value } = data;
        if (!pickup_postcode || !delivery_postcode) {
          return NextResponse.json({ error: "Missing required fields: pickup_postcode, delivery_postcode" }, { status: 400 });
        }
        
        // One of either the 'order_id' or 'cod' and 'weight' is required
        if (!order_id && (cod === undefined || weight === undefined)) {
          return NextResponse.json({ error: "Either order_id or both cod and weight are required" }, { status: 400 });
        }
        
        const serviceabilityData = {
          pickup_postcode,
          delivery_postcode,
          order_id,
          cod,
          weight,
          length,
          breadth,
          height,
          declared_value
        };
        
        const serviceabilityResult = await checkCourierServiceability(serviceabilityData);
        return NextResponse.json(serviceabilityResult);

      case "create-order":
        const adminCheck1 = await verifyAdmin(request);
        if (!adminCheck1.success) {
          return NextResponse.json({ error: adminCheck1.error }, { status: 401 });
        }
        
        // Validate required fields for adhoc order creation
        const requiredFields = [
          'order_id',
          'order_date',
          'pickup_location',
          'billing_customer_name',
          'billing_address',
          'billing_pincode',
          'billing_phone',
          'payment_method',
          'order_items'
        ];
        
        for (const field of requiredFields) {
          if (!data[field]) {
            return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
          }
        }
        
        const orderResult = await createOrder(data);
        
        // Store order data in our database
        if (orderResult && orderResult.order_id) {
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
        }
        
        return NextResponse.json(orderResult);

      case "assign-awb":
        const adminCheck2 = await verifyAdmin(request);
        if (!adminCheck2.success) {
          return NextResponse.json({ error: adminCheck2.error }, { status: 401 });
        }
        
        const { shipment_id, courier_id } = data;
        if (!shipment_id) {
          return NextResponse.json({ error: "Missing required field: shipment_id" }, { status: 400 });
        }
        
        const awbData = {
          shipment_id,
          courier_id
        };
        
        const awbResult = await assignAWB(awbData);
        return NextResponse.json(awbResult);

      case "generate-label":
        const adminCheck3 = await verifyAdmin(request);
        if (!adminCheck3.success) {
          return NextResponse.json({ error: adminCheck3.error }, { status: 401 });
        }
        
        const { shipmentId } = data;
        if (!shipmentId) {
          return NextResponse.json({ error: "Missing required field: shipmentId" }, { status: 400 });
        }
        
        const labelResult = await generateShippingLabel(shipmentId);
        return NextResponse.json(labelResult);

      case "request-pickup":
        const adminCheck4 = await verifyAdmin(request);
        if (!adminCheck4.success) {
          return NextResponse.json({ error: adminCheck4.error }, { status: 401 });
        }
        
        const { shipmentIds, pickupDate } = data;
        if (!shipmentIds || !Array.isArray(shipmentIds) || shipmentIds.length === 0) {
          return NextResponse.json({ error: "At least one shipment ID is required" }, { status: 400 });
        }
        
        const pickupData = {
          shipment_id: shipmentIds,
          pickup_date: pickupDate
        };
        
        const pickupResult = await requestPickup(pickupData);
        return NextResponse.json(pickupResult);

      case "track-shipment":
        const { awbCode, shipmentId, orderId } = data;
        if (!awbCode && !shipmentId && !orderId) {
          return NextResponse.json({ error: "Either awbCode, shipmentId, or orderId is required for tracking" }, { status: 400 });
        }
        
        const trackingResult = await trackShipment(awbCode, shipmentId, orderId);
        return NextResponse.json(trackingResult);

      case "cancel-order":
        const adminCheck5 = await verifyAdmin(request);
        if (!adminCheck5.success) {
          return NextResponse.json({ error: adminCheck5.error }, { status: 401 });
        }
        
        const { orderIds } = data;
        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
          return NextResponse.json({ error: "At least one order ID is required" }, { status: 400 });
        }
        
        const cancelData = {
          order_id: orderIds
        };
        
        const cancelResult = await cancelOrder(cancelData);
        return NextResponse.json(cancelResult);

      case "refresh-pickup-locations":
        const adminCheck6 = await verifyAdmin(request);
        if (!adminCheck6.success) {
          return NextResponse.json({ error: adminCheck6.error }, { status: 401 });
        }
        
        // Fetch pickup locations from Shiprocket
        const refreshPickupLocations = await getPickupLocations();
        
        if (!refreshPickupLocations || !refreshPickupLocations.data) {
          throw new Error("Failed to fetch pickup locations from Shiprocket");
        }

        // Clear existing pickup locations
        await sql`DELETE FROM shiprocket_pickup_locations`;

        // Insert new pickup locations
        for (const location of refreshPickupLocations.data) {
          await sql`
            INSERT INTO shiprocket_pickup_locations (
              shiprocket_location_id, name, email, phone, address, 
              city, state, country, pin_code, "primary"
            )
            VALUES (
              ${location.id}, ${location.name}, ${location.email || null}, ${location.phone || null}, 
              ${location.address}, ${location.city}, ${location.state}, ${location.country}, 
              ${location.pin_code}, ${location.primary || false}
            )
            ON CONFLICT (shiprocket_location_id) 
            DO UPDATE SET
              name = EXCLUDED.name,
              email = EXCLUDED.email,
              phone = EXCLUDED.phone,
              address = EXCLUDED.address,
              city = EXCLUDED.city,
              state = EXCLUDED.state,
              country = EXCLUDED.country,
              pin_code = EXCLUDED.pin_code,
              "primary" = EXCLUDED."primary",
              updated_at = NOW()
          `;
        }

        return NextResponse.json({ 
          success: true, 
          pickup_locations: refreshPickupLocations.data,
          message: "Pickup locations refreshed successfully"
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Shiprocket API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}