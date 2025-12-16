import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { CartList } from "@/components/cart-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Shopping Cart | NIVARA",
  description: "Review your cart items",
}

export default async function CartPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Debug: Log session info
  console.log(`[v0] Cart page accessed by user ${session.userId} (${session.email})`);

  // Fetch cart items from database
  let cartItemsResult = []
  let total = 0
  
  try {
    // Debug: First check if there are any cart items for this user
    const userCartItems = await sql`
      SELECT * FROM cart_items WHERE user_id = ${session.userId}
    `
    console.log(`[v0] Found ${userCartItems.length} cart items for user ${session.userId}`, userCartItems);
    
    // Debug: Check if products exist
    const allProducts = await sql`
      SELECT id, name FROM products LIMIT 5
    `
    console.log(`[v0] Sample products in database:`, allProducts);
    
    // Main query to fetch cart items with product details
    cartItemsResult = await sql`
      SELECT 
        ci.id as cart_item_id,
        ci.quantity,
        p.id as product_id,
        p.name,
        p.slug,
        p.price,
        p.compare_at_price,
        p.image_url
      FROM cart_items ci
      LEFT JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ${session.userId}
      ORDER BY ci.created_at DESC
    `
    
    console.log(`[v0] Cart items with product details:`, cartItemsResult);
    
    // Filter out any items where product was not found (LEFT JOIN resulted in NULLs)
    cartItemsResult = cartItemsResult.filter((item: any) => item.name !== null);
    
    // Calculate total
    total = cartItemsResult.reduce((sum: number, item: any) => {
      return sum + (Number.parseFloat(item.price) * item.quantity)
    }, 0)
    
    console.log(`[v0] Final cart items count: ${cartItemsResult.length}, Total: ${total}`);
  } catch (error) {
    console.error("[v0] Error fetching cart items:", error)
    // If there's an error, we'll show an empty cart
    cartItemsResult = []
    total = 0
  }

  return (
    <div className="container px-4 py-12">
      <h1 className="text-4xl font-serif tracking-tight mb-8">Shopping Cart</h1>

      {cartItemsResult.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <p className="text-lg text-muted-foreground">Your cart is empty</p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartList items={cartItemsResult} />
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