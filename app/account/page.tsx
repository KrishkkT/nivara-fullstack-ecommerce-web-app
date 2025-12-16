import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signOut } from "@/app/actions/auth"

export const metadata = {
  title: "My Account | NIVARA",
  description: "Manage your account and orders",
}

export default async function AccountPage() {
  // Temporary: Show a simple account page without authentication
  // This is to verify that login/register flow works without getting stuck
  
  // Mock user data for demonstration
  const user = [{
    id: 1,
    email: "user@example.com",
    full_name: "Test User"
  }]
  
  // Mock orders data for demonstration
  const orders = []

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{user[0].full_name}</h2>
            <p className="text-gray-600">{user[0].email}</p>
            
            <form action={signOut} className="mt-4">
              <Button type="submit" variant="outline">
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order: any) => (
                  <div key={order.id} className="border rounded p-3">
                    <Link href={`/orders/${order.id}`}>
                      <div className="flex justify-between">
                        <span>{order.order_number}</span>
                        <span>${order.total_amount}</span>
                      </div>
                    </Link>
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