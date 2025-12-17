import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAuth } from "@/lib/session"
import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { CancelOrderButton } from "@/components/cancel-order-button"
import { UpdateOrderStatus } from "@/components/update-order-status"
import { Badge } from "@/components/ui/badge"

interface Shipment {
  waybill_number: string;
  status: string;
  event_data: any;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: number
  product_id: number | null
  quantity: number
  product_price: string
  product_name: string
  image_url: string | null
}

interface Order {
  id: number
  order_number: string
  total_amount: string
  status: string
  payment_status: string
  payment_type: string | null
  razorpay_order_id: string | null
  created_at: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address_id: number | null
  billing_address_id: number | null
  shipping_address: any | null
}

interface Address {
  id: number
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    redirect("/login")
  }

  const user = await verifyAuth(token)
  if (!user || user.role !== "admin") {
    redirect("/")
  }

  const orderResult = await sql<Order[]>`
    SELECT 
      o.id,
      o.order_number,
      o.total_amount,
      o.status,
      o.payment_status,
      o.payment_type,
      o.razorpay_order_id,
      o.created_at,
      o.shipping_address_id,
      o.billing_address_id,
      o.shipping_address,
      u.full_name as customer_name,
      u.email as customer_email,
      u.phone as customer_phone
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = ${Number.parseInt(id)}
  `

  if (!orderResult || orderResult.length === 0) {
    redirect("/admin/orders")
  }

  const order = orderResult[0]

  let shippingAddress: Address | null = null
  let billingAddress: Address | null = null

  // Handle case where shipping address is stored as ID
  if (order.shipping_address_id) {
    const shippingResult = await sql<Address[]>`
      SELECT id, address_line1, address_line2, city, state, postal_code, country
      FROM addresses
      WHERE id = ${order.shipping_address_id}
    `
    shippingAddress = shippingResult?.[0] || null
  }
  // Handle case where shipping address is stored as JSON
  else if (order.shipping_address) {
    shippingAddress = {
      id: 0,
      address_line1: order.shipping_address.address_line1 || '',
      address_line2: order.shipping_address.address_line2 || null,
      city: order.shipping_address.city || '',
      state: order.shipping_address.state || '',
      postal_code: order.shipping_address.postal_code || '',
      country: order.shipping_address.country || 'India'
    }
  }

  // Handle case where billing address is stored as ID
  if (order.billing_address_id) {
    const billingResult = await sql<Address[]>`
      SELECT id, address_line1, address_line2, city, state, postal_code, country
      FROM addresses
      WHERE id = ${order.billing_address_id}
    `
    billingAddress = billingResult?.[0] || null
  }
  // Handle case where billing address is stored as JSON
  else if (order.shipping_address && order.billing_address_id === null) {
    // For now, we'll assume billing address is the same as shipping if not explicitly set
    billingAddress = shippingAddress
  }

  const orderItemsResult = await sql<OrderItem[]>`
    SELECT 
      oi.id,
      oi.product_id,
      oi.quantity,
      oi.product_price,
      oi.product_name,
      p.image_url
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ${Number.parseInt(id)}
  `

  const orderItems: OrderItem[] = orderItemsResult || []

  const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Add shipment data fetching
  const shipmentResult = await sql<Shipment[]>`
    SELECT *
    FROM delhivery_shipments
    WHERE order_id = ${Number.parseInt(id)}
  `

  const shipment: Shipment | null = shipmentResult?.[0] || null

  return (
    <div className="container px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/orders">
          <Button variant="outline" className="cursor-pointer bg-transparent">
            ← Back to Orders
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <div className="bg-card border rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                <p className="text-lg font-semibold">{order.order_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                <p className="text-lg">{orderDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <div className="py-1">
                  <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                <p className="text-lg capitalize font-medium">{order.payment_status}</p>
              </div>
            </div>
          </div>

          {/* Cancel Order Button */}
          {order.status !== "cancelled" && (order.status === "pending" || order.status === "processing") && (
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Order Actions</h2>
              <CancelOrderButton orderId={order.id} isAdmin={true} />
            </div>
          )}

          {/* Customer Info */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.customer_email}</p>
              </div>
              {order.customer_phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.customer_phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {shippingAddress && (
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{shippingAddress.address_line1}</p>
                {shippingAddress.address_line2 && <p>{shippingAddress.address_line2}</p>}
                <p>
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
                </p>
                <p>{shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Billing Address */}
          {billingAddress && (
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Billing Address</h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{billingAddress.address_line1}</p>
                {billingAddress.address_line2 && <p>{billingAddress.address_line2}</p>}
                <p>
                  {billingAddress.city}, {billingAddress.state} {billingAddress.postal_code}
                </p>
                <p>{billingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Shipment Information */}
          {shipment && (
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Shipment Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Waybill Number</p>
                  <p className="font-medium">{shipment.waybill_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Shipment Status</p>
                  <div>
                    {shipment.status === "created" && (
                      <Badge variant="secondary">Created</Badge>
                    )}
                    {shipment.status === "in_transit" && (
                      <Badge className="bg-blue-500">In Transit</Badge>
                    )}
                    {shipment.status === "out_for_delivery" && (
                      <Badge className="bg-yellow-500">Out for Delivery</Badge>
                    )}
                    {shipment.status === "delivered" && (
                      <Badge className="bg-green-500">Delivered</Badge>
                    )}
                    {shipment.status === "rto" && (
                      <Badge variant="destructive">Returned</Badge>
                    )}
                    {shipment.status === "ndr" && (
                      <Badge variant="outline">Action Required</Badge>
                    )}
                    {!["created", "in_transit", "out_for_delivery", "delivered", "rto", "ndr"].includes(shipment.status) && (
                      <Badge variant="secondary">{shipment.status}</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Created At</p>
                  <p className="font-medium">
                    {new Date(shipment.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                  <p className="font-medium">
                    {new Date(shipment.updated_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" onClick={() => window.open(`/shipping/track?waybill=${shipment.waybill_number}`, '_blank')}>
                  View Tracking Details
                </Button>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Items</h2>
            <div className="space-y-4">
              {orderItems.length > 0 ? (
                orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                    {item.image_url && (
                      <Image
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.product_name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded"
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="font-medium">₹{(Number(item.product_price) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No items found</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card border rounded-lg p-6 h-fit sticky top-20">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.total_amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t pt-3">
              <span>Total</span>
              <span>₹{order.total_amount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
