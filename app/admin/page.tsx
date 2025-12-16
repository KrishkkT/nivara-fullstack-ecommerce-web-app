import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAuth } from "@/lib/session"
import { sql } from "@/lib/db"
import { AdminDashboard } from "@/components/admin-dashboard"
import { withAuth } from '@/components/with-auth'

async function AdminPageContent({ session }: { session: any }) {
  // Fetch dashboard statistics
  const [stats] = await sql`
    SELECT 
      (SELECT COUNT(*) FROM orders) as total_orders,
      (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
      (SELECT COUNT(*) FROM orders WHERE status = 'paid') as paid_orders,
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM products) as total_products,
      (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'paid') as total_revenue
  `

  const recentOrders = await sql`
    SELECT 
      o.id,
      o.order_number,
      o.total_amount,
      o.status,
      o.created_at,
      u.full_name as customer_name,
      u.email as customer_email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT 10
  `

  const topProducts = await sql`
    SELECT 
      p.id,
      p.name,
      p.image_url,
      p.price,
      COUNT(oi.id) as order_count
    FROM products p
    LEFT JOIN order_items oi ON p.id = oi.product_id
    GROUP BY p.id
    ORDER BY order_count DESC
    LIMIT 5
  `

  return <AdminDashboard stats={stats} recentOrders={recentOrders} topProducts={topProducts} />
}

// Wrap the component with authentication and require admin role
const AdminPage = withAuth(AdminPageContent, 'admin')

export default AdminPage