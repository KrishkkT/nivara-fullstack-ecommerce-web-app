import { redirect } from 'next/navigation'
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { ChevronRight, Package } from 'lucide-react'

export const metadata = {
  title: "My Orders | NIVARA",
  description: "View all your orders",
}

export default async function OrdersPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const orders = await sql`
    SELECT *
    FROM orders 
    WHERE user_id = ${session.userId}
    ORDER BY created_at DESC
  `

  return (
    <div className="container px-4 py-12 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-serif tracking-tight mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-card border rounded-lg">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const paymentMethod = order.payment_type === 'razorpay' ? 'Razorpay' : 'COD'
              const isCancelled = order.status === 'cancelled'
              
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-card border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-lg mb-1">Order #{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-2 flex-wrap">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-800">
                        {paymentMethod}
                      </span>
                      {!isCancelled && order.payment_status !== "paid" && (
                        <span className="text-xs px-3 py-1 rounded-full font-medium bg-yellow-100 text-yellow-800">
                          {order.payment_status === 'awaiting_payment' ? 'Pending Payment' : order.payment_status}
                        </span>
                      )}
                      {order.payment_status === "paid" && (
                        <span className="text-xs px-3 py-1 rounded-full font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-semibold">{formatPrice(Number.parseFloat(order.total_amount))}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
