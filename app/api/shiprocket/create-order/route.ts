// API route to trigger Shiprocket order creation for an existing order
// POST /api/shiprocket/create-order
// Body: { orderId: number }

import { type NextRequest, NextResponse } from "next/server"
import { createShiprocketOrderAutomatically } from "@/app/actions/orders"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 })
    }

    // Get order details
    const orderResult: any = await sql`
      SELECT order_number FROM orders WHERE id = ${orderId}
    `

    if (orderResult.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const orderNumber = orderResult[0].order_number

    // Get order details for Shiprocket creation
    const orderDetails: any = await sql`
      SELECT o.*, u.full_name, u.email, u.phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ${orderId}
    `;

    if (orderDetails.length === 0) {
      return NextResponse.json({ error: "Order details not found" }, { status: 404 })
    }

    const order = orderDetails[0]

    // Get shipping address
    let shippingAddress = null;
        
    // First try to get from shipping_address_id
    if (order.shipping_address_id) {
      const addressResult: any = await sql`
        SELECT * FROM addresses WHERE id = ${order.shipping_address_id}
      `;
          
      if (addressResult.length > 0) {
        shippingAddress = addressResult[0];
      }
    }
        
    // If not found, try to parse from shipping_address JSON field
    if (!shippingAddress && order.shipping_address) {
      try {
        shippingAddress = JSON.parse(order.shipping_address);
      } catch (e) {
        console.warn('[v0] Failed to parse shipping_address JSON:', e);
      }
    }
        
    // Create order data object
    const orderData = {
      shippingAddressId: order.shipping_address_id,
      shippingAddress: shippingAddress,
      paymentMethod: order.payment_type || 'prepaid',
      totalAmount: parseFloat(order.total_amount),
      user: {
        full_name: order.full_name,
        email: order.email,
        phone: order.phone
      },
      items: []
    };

    // Get order items
    const orderItems: any = await sql`
      SELECT * FROM order_items WHERE order_id = ${orderId}
    `

    orderData.items = orderItems.map((item: any) => ({
      productId: item.product_id,
      quantity: item.quantity,
      price: parseFloat(item.product_price)
    }))

    // Create Shiprocket order
    await createShiprocketOrderAutomatically(orderId, orderNumber, orderData)

    return NextResponse.json({ success: true, message: "Shiprocket order created successfully" })
  } catch (error: any) {
    console.error('[v0] Failed to create Shiprocket order:', error)
    return NextResponse.json({ error: error.message || "Failed to create Shiprocket order" }, { status: 500 })
  }
}