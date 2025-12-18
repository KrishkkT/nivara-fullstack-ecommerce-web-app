import { cookies } from "next/headers"
import { redirect } from 'next/navigation'
import { verifyAuth } from "@/lib/session"
import { sql } from "@/lib/db"
import { AdminOrdersList } from "@/components/admin-orders-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function AdminOrdersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    redirect("/login?redirect=/admin/orders")
  }

  const user = await verifyAuth(token)
  if (!user || user.role !== "admin") {
    redirect("/")
  }

  const orders = await sql`
    SELECT 
      o.id,
      o.order_number,
      o.total_amount,
      o.status,
      o.payment_status,
      o.payment_type,
      o.razorpay_order_id,
      o.created_at,
      u.full_name as customer_name,
      u.email as customer_email,
      COUNT(oi.id) as item_count
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id, u.full_name, u.email
    ORDER BY o.created_at DESC
  `

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      <AdminOrdersList orders={orders} />
    </div>
  )
}
