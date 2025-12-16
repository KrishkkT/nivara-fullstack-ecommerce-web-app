import { redirect } from 'next/navigation'
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signOut } from "@/app/actions/auth"
import { formatPrice } from "@/lib/utils"
import { CancelOrderButton } from "@/components/cancel-order-button"
import { User } from 'lucide-react'

export const metadata = {
  title: "My Account | NIVARA",
  description: "Manage your account and orders",
}

export default async function AccountPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const user = await sql`
    SELECT * FROM users WHERE id = ${session.userId}
  `

  const orders = await sql`
    SELECT * FROM orders 
    WHERE user_id = ${session.userId}
    ORDER BY created_at DESC
    LIMIT 5
  `

  return (
    <div className="container px-4 py-12 animate-fadeIn">
      <h1 className="text-4xl font-serif tracking-tight mb-8">My Account</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-card border rounded-lg p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">{user[0].full_name}</h2>
              <p className="text-sm text-muted-foreground">{user[0].email}</p>
              {user[0].phone && <p className="text-sm text-muted-foreground">{user[0].phone}</p>}
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              
              <form action={async () => {
                'use server'
                await signOut()
                redirect("/")
              }}>
                <Button type="submit" variant="outline" className="w-full bg-transparent">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <Button variant="outline" size="sm" asChild>
                <Link href="/orders">View All</Link>
              </Button>
            </div>

            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-accent transition-all hover:shadow-md">
                    <Link href={`/orders/${order.id}`} className="block">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(Number.parseFloat(order.total_amount))}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                    {(order.status === "pending" || order.status === "processing") && (
                      <div className="mt-3 pt-3 border-t">
                        <CancelOrderButton orderId={order.id} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}