import { redirect } from 'next/navigation'
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signOut } from "@/app/actions/auth"
import { withAuth } from '@/components/with-auth'

export const metadata = {
  title: "My Account | NIVARA",
  description: "Manage your account and orders",
}

async function AccountPageContent({ session }: { session: any }) {
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
              <Link 
                href="/orders" 
                className="block px-3 py-2 rounded-md hover:bg-accent"
              >
                My Orders
              </Link>
            </nav>
            
            <form action={signOut} className="mt-6">
              <Button variant="outline" className="w-full">
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome, {session.fullName}</h2>
            <p className="text-muted-foreground mb-6">Email: {session.email}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="border rounded-lg p-4 text-center">
                <h3 className="text-lg font-semibold">Total Orders</h3>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h3 className="text-lg font-semibold">Pending Orders</h3>
                <p className="text-2xl font-bold">
                  {orders.filter((order: any) => order.status === 'pending').length}
                </p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h3 className="text-lg font-semibold">Completed Orders</h3>
                <p className="text-2xl font-bold">
                  {orders.filter((order: any) => order.status === 'paid').length}
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order: any) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Order #{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{order.total_amount}</p>
                        <p className="text-sm capitalize">{order.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No orders yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrap the component with authentication
const AccountPage = withAuth(AccountPageContent)

export default AccountPage