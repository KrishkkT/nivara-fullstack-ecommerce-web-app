import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { OrderDetails } from "@/components/order-details"

export const metadata = {
  title: "Order Details | NIVARA",
  description: "View your order details",
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const order = await sql`
    SELECT * FROM orders 
    WHERE id = ${id} AND user_id = ${session.userId}
  `

  if (!order.length) {
    notFound()
  }

  const orderItems = await sql`
    SELECT oi.*, p.image_url, p.slug
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ${id}
  `

  return <OrderDetails order={order[0]} items={orderItems} />
}
