import { redirect } from 'next/navigation'
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signOut } from "@/app/actions/auth"

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
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <div className="bg-white border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Account Menu</h2>
            <nav className="space-y-2">
              <Link 
                href="/account" 
                className="block px-3 py-2 rounded-md bg-primary text-primary-foreground"
              >
                Dashboard
              </Link>
              <Link 
                href="/profile" 
                className="block px-3 py-2 rounded-md hover:bg-accent"
              >
                Profile Information
              </Link>
              <Link 
                href="/orders" 
                className="block px-3 py-2 rounded-md hover:bg-accent"
              >
                My Orders
              </Link>
              <Link 
                href="/profile/addresses" 
                className="block px-3 py-2 rounded-md hover:bg-accent"
              >
                Saved Addresses
              </Link>
              <Link 
                href="/profile/change-password" 
                className="block px-3 py-2 rounded-md hover:bg-accent"
              >
                Change Password
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome, {user[0].full_name}</h2>
            <p className="text-gray-600 mb-6">Logged in as: {user[0].email}</p>
            
            <div className="flex justify-end">
              <form action={signOut}>
                <Button type="submit" variant="outline">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No orders yet</p>
                <Button asChild>
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order: any) => (
                  <div key={order.id} className="border rounded p-3">
                    <Link href={`/orders/${order.id}`}>
                      <div className="flex justify-between">
                        <span>#{order.order_number}</span>
                        <span>${order.total_amount}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </Link>
                  </div>
                ))}
                <div className="pt-4">
                  <Button asChild variant="outline">
                    <Link href="/orders">View All Orders</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}