import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { CartList } from "@/components/cart-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Shopping Cart | NIVARA",
  description: "Review your cart items",
}

export default async function CartPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const cartItems = await sql`
    SELECT 
      ci.*,
      p.name,
      p.slug,
      p.price,
      p.image_url
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ${session.userId}
    ORDER BY ci.created_at DESC
  `

  const total = cartItems.reduce((sum: number, item: any) => {
    return sum + Number.parseFloat(item.price) * item.quantity
  }, 0)

  return (
    <div className="container px-4 py-12">
      <h1 className="text-4xl font-serif tracking-tight mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <p className="text-lg text-muted-foreground">Your cart is empty</p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartList items={cartItems} />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border rounded-lg p-6 space-y-4 sticky top-20">
              <h2 className="text-xl font-semibold">Order Summary</h2>

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

              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
