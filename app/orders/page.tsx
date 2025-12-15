import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "My Orders | NIVARA",
  description: "View your order history",
}

export default async function OrdersPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const orders = await sql`
    SELECT * FROM orders 
    WHERE user_id = ${session.userId}
    ORDER BY created_at DESC
  `

  return (
    <div className="container px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif tracking-tight mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const paymentMethod = "Online Payment"
              
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-card border rounded-lg p-6 hover:bg-accent transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="font-medium">Order #{order.order_number}</h2>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {paymentMethod}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm capitalize">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "delivered" ? "bg-green-100 text-green-800" :
                          order.status === "cancelled" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.status}
                        </span>
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(Number.parseFloat(order.total_amount))}</p>
                      <p className="text-sm text-muted-foreground">View Details</p>
                    </div>
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