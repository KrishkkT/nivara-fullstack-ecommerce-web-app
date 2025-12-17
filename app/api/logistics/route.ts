import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { 
  checkPincodeServiceability, 
  calculateShippingCost, 
  trackShipment,
  createWarehouse,
  updateWarehouse,
  fetchBulkWaybills,
  createShipment,
  generateShippingLabel,
  createPickupRequest,
  cancelShipment,
  handleNdrAction,
  getAvailableWaybill,
  updateShipmentStatus
} from "@/lib/logistics/delhivery";

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
  return NextResponse.json({ message: "Delhivery Logistics API" });
}

// POST /api/logistics/check-pincode - Check pincode serviceability
export async function POST(request: Request) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case "check-pincode":
        const { pickupPostcode, deliveryPostcode } = data;
        if (!pickupPostcode || !deliveryPostcode) {
          return NextResponse.json({ error: "Missing required fields: pickupPostcode, deliveryPostcode" }, { status: 400 });
        }
        
        const pincodeResult = await checkPincodeServiceability(pickupPostcode, deliveryPostcode);
        return NextResponse.json(pincodeResult);

      case "calculate-cost":
        const { pickup_pincode, delivery_pincode, weight, cod } = data;
        if (!pickup_pincode || !delivery_pincode || !weight) {
          return NextResponse.json({ error: "Missing required fields: pickup_pincode, delivery_pincode, weight" }, { status: 400 });
        }
        
        const costResult = await calculateShippingCost({ pickup_pincode, delivery_pincode, weight, cod: cod || false });
        return NextResponse.json(costResult);

      case "track-shipment":
        const { waybill, refIds } = data;
        if (!waybill && !refIds) {
          return NextResponse.json({ error: "Missing required fields: waybill or refIds" }, { status: 400 });
        }
        
        const trackResult = await trackShipment(waybill, refIds);
        return NextResponse.json(trackResult);

      case "create-warehouse":
        const adminCheck1 = await verifyAdmin(request);
        if (!adminCheck1.success) {
          return NextResponse.json({ error: adminCheck1.error }, { status: 401 });
        }
        
        const warehouseResult = await createWarehouse(data);
        return NextResponse.json(warehouseResult);

      case "update-warehouse":
        const adminCheck2 = await verifyAdmin(request);
        if (!adminCheck2.success) {
          return NextResponse.json({ error: adminCheck2.error }, { status: 401 });
        }
        
        const updateResult = await updateWarehouse(data);
        return NextResponse.json(updateResult);

      case "fetch-waybills":
        const adminCheck3 = await verifyAdmin(request);
        if (!adminCheck3.success) {
          return NextResponse.json({ error: adminCheck3.error }, { status: 401 });
        }
        
        const { count } = data;
        if (!count) {
          return NextResponse.json({ error: "Missing required field: count" }, { status: 400 });
        }
        
        const waybillResult = await fetchBulkWaybills(count);
        return NextResponse.json(waybillResult);

      case "create-shipment":
        const adminCheck4 = await verifyAdmin(request);
        if (!adminCheck4.success) {
          return NextResponse.json({ error: adminCheck4.error }, { status: 401 });
        }
        
        // Validate required fields
        if (!data.shipments || !data.pickup_location) {
          return NextResponse.json({ error: "Missing required fields: shipments, pickup_location" }, { status: 400 });
        }
        
        // Get an available waybill
        const availableWaybill = await getAvailableWaybill();
        if (!availableWaybill) {
          return NextResponse.json({ error: "No available waybills. Please prefetch waybills first." }, { status: 400 });
        }
        
        // Add waybill to shipment data
        const shipmentData = {
          ...data,
          waybill: availableWaybill
        };
        
        const shipmentResult = await createShipment(shipmentData);
        
        // If shipment creation is successful, link it to the order
        if (shipmentResult && shipmentResult.success && data.orderId) {
          await sql`
            INSERT INTO delhivery_shipments (waybill_number, order_id, status)
            VALUES (${availableWaybill}, ${data.orderId}, 'created')
            ON CONFLICT (waybill_number) 
            DO UPDATE SET 
              order_id = EXCLUDED.order_id,
              status = EXCLUDED.status
          `;
        }
        
        return NextResponse.json(shipmentResult);

      case "generate-label":
        const adminCheck5 = await verifyAdmin(request);
        if (!adminCheck5.success) {
          return NextResponse.json({ error: adminCheck5.error }, { status: 401 });
        }
        
        const { waybill: labelWaybill } = data;
        if (!labelWaybill) {
          return NextResponse.json({ error: "Missing required field: waybill" }, { status: 400 });
        }
        
        const pdfBuffer = await generateShippingLabel(labelWaybill);
        
        // Return PDF as response
        return new NextResponse(pdfBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="shipping-label-${labelWaybill}.pdf"`,
          },
        });

      case "create-pickup":
        const adminCheck6 = await verifyAdmin(request);
        if (!adminCheck6.success) {
          return NextResponse.json({ error: adminCheck6.error }, { status: 401 });
        }
        
        const pickupResult = await createPickupRequest(data);
        return NextResponse.json(pickupResult);

      case "cancel-shipment":
        const adminCheck7 = await verifyAdmin(request);
        if (!adminCheck7.success) {
          return NextResponse.json({ error: adminCheck7.error }, { status: 401 });
        }
        
        const { waybill: cancelWaybill } = data;
        if (!cancelWaybill) {
          return NextResponse.json({ error: "Missing required field: waybill" }, { status: 400 });
        }
        
        const cancelResult = await cancelShipment(cancelWaybill);
        
        // Update local shipment status
        if (cancelResult && cancelResult.success) {
          await updateShipmentStatus(cancelWaybill, "cancelled");
        }
        
        return NextResponse.json(cancelResult);

      case "handle-ndr":
        const adminCheck8 = await verifyAdmin(request);
        if (!adminCheck8.success) {
          return NextResponse.json({ error: adminCheck8.error }, { status: 401 });
        }
        
        const { waybill: ndrWaybill, action: ndrAction, remarks } = data;
        if (!ndrWaybill || !ndrAction) {
          return NextResponse.json({ error: "Missing required fields: waybill, action" }, { status: 400 });
        }
        
        const ndrResult = await handleNdrAction(ndrWaybill, ndrAction, remarks);
        return NextResponse.json(ndrResult);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Delhivery API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}