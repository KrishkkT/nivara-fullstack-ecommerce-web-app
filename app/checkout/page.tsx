import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { CheckoutForm } from "@/components/checkout-form"

export const metadata = {
  title: "Checkout | NIVARA",
  description: "Complete your purchase",
}

export default async function CheckoutPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const cartItems = await sql`
    SELECT 
      ci.*,
      p.name,
      p.price,
      p.image_url
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ${session.userId}
  `

  if (cartItems.length === 0) {
    redirect("/cart")
  }

  const user = await sql`
    SELECT * FROM users WHERE id = ${session.userId}
  `

  const addresses = await sql`
    SELECT * FROM addresses WHERE user_id = ${session.userId}
    ORDER BY is_default DESC, created_at DESC
  `

  const total = cartItems.reduce((sum: number, item: any) => {
    return sum + Number.parseFloat(item.price) * item.quantity
  }, 0)

  return (
    <div className="container px-4 py-12">
      <h1 className="text-4xl font-serif tracking-tight mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm user={user[0]} addresses={addresses} cartItems={cartItems} total={total} />
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-6 space-y-4 sticky top-20">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="space-y-3">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="flex-1">
                    {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
                  </span>
                  <span>₹{(Number.parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 py-4 border-y">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
