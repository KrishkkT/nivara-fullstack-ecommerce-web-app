import Link from "next/link"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, ShoppingCart } from "lucide-react"

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
    SELECT 
      o.id,
      o.order_number,
      o.total_amount,
      o.status,
      o.created_at,
      COUNT(oi.id) as item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ${session.userId}
    GROUP BY o.id, o.order_number, o.total_amount, o.status, o.created_at
    ORDER BY o.created_at DESC
  `

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "processing":
        return <Badge variant="secondary">Processing</Badge>
      case "shipped":
        return <Badge variant="default">Shipped</Badge>
      case "delivered":
        return <Badge variant="default">Delivered</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="container px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/account" className="hover:text-foreground transition-colors">Account</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Orders</span>
      </nav>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif tracking-tight mb-2">My Orders</h1>
          <p className="text-muted-foreground">View your order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
            <p className="mt-2 text-muted-foreground">You haven't placed any orders yet.</p>
            <Button className="mt-4" asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.order_number}
                      </CardTitle>
                      <CardDescription>
                        {new Date(order.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.item_count} {order.item_count === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <Button variant="outline" asChild size="sm">
                      <Link href={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}