import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { WishlistActions } from "@/components/wishlist-actions"

export const metadata = {
  title: "Wishlist - NIVARA",
  description: "Your saved items",
}

async function getWishlistItems(userId: number) {
  const items = await sql`
    SELECT 
      w.id,
      w.product_id,
      p.name,
      p.slug,
      p.price,
      p.compare_at_price,
      p.image_url,
      c.name as category_name
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE w.user_id = ${userId}
    ORDER BY w.created_at DESC
  `
  return items
}

export default async function WishlistPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const items = await getWishlistItems(session.userId)

  return (
    <div className="container px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif mb-2">My Wishlist</h1>
        <p className="text-muted-foreground">
          {items.length === 0 ? "Your wishlist is empty" : `${items.length} item${items.length > 1 ? "s" : ""} saved`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-24 w-24 text-muted-foreground/20 mx-auto mb-4" />
          <h2 className="text-2xl font-serif mb-4">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">Start adding items you love to your wishlist</p>
          <Button asChild size="lg">
            <Link href="/shop">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item: any) => {
            const discount = item.compare_at_price
              ? Math.round((1 - Number.parseFloat(item.price) / Number.parseFloat(item.compare_at_price)) * 100)
              : 0

            return (
              <div key={item.id} className="group animate-fade-in">
                <Link href={`/products/${item.slug}`}>
                  <div className="relative overflow-hidden rounded-xl bg-card border mb-4 shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="aspect-square relative overflow-hidden bg-muted/30">
                      <Image
                        src={item.image_url || "/placeholder.svg?height=400&width=400&query=jewellery"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {discount > 0 && (
                      <div className="absolute top-3 right-3 bg-gradient-to-br from-rose-bronze to-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                        {discount}% OFF
                      </div>
                    )}
                  </div>
                </Link>
                <div className="space-y-3 px-1">
                  <Link href={`/products/${item.slug}`}>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      {item.category_name}
                    </p>
                    <h3 className="font-serif text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-semibold text-lg">{formatPrice(Number.parseFloat(item.price))}</span>
                      {item.compare_at_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(Number.parseFloat(item.compare_at_price))}
                        </span>
                      )}
                    </div>
                  </Link>

                  <WishlistActions productId={item.product_id} productName={item.name} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
