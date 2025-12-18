import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAuth } from "@/lib/session"
import { sql } from "@/lib/db"
import { AdminProductsList } from "@/components/admin-products-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function AdminProductsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    redirect("/login?redirect=/admin/products")
  }

  const user = await verifyAuth(token)
  if (!user || user.role !== "admin") {
    redirect("/")
  }

  const products = await sql`
    SELECT 
      p.*,
      c.name as category_name,
      c.id as category_id,
      COALESCE(COUNT(DISTINCT oi.id), 0) as total_sales
    FROM products p
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN order_items oi ON p.id = oi.product_id
    GROUP BY p.id, c.name, c.id
    ORDER BY p.created_at DESC
  `

  return (
    <div>
      <div>
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      <AdminProductsList products={products} />
    </div>
  )
}