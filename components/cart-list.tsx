"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { updateCartQuantity, removeFromCart } from "@/app/actions/cart"
import { moveToWishlist } from "@/app/actions/wishlist"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { mutate } from "swr"

interface CartItem {
  cart_item_id: number
  product_id: number
  name: string
  slug: string
  price: string
  image_url: string
  quantity: number
}

export function CartList({ items }: { items: CartItem[] }) {
  const router = useRouter()
  const { toast } = useToast()

  async function handleUpdateQuantity(itemId: number, newQuantity: number) {
    if (newQuantity < 1) return
    await updateCartQuantity(itemId, newQuantity)
    router.refresh()
  }

  async function handleRemove(itemId: number) {
    await removeFromCart(itemId)
    mutate("/api/cart/count")
    router.refresh()
  }

  async function handleMoveToWishlist(itemId: number, productName: string) {
    const result = await moveToWishlist(itemId)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Moved to wishlist",
        description: `${productName} moved to your wishlist`,
      })
      mutate("/api/cart/count")
      mutate("/api/wishlist/count")
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.cart_item_id} className="bg-card border rounded-lg p-4 flex gap-4 animate-fade-in">
          <Link href={`/products/${item.slug}`} className="flex-shrink-0">
            <div className="relative w-24 h-24 rounded-md overflow-hidden">
              <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>
          </Link>

          <div className="flex-1 space-y-2">
            <Link href={`/products/${item.slug}`}>
              <h3 className="font-medium hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
            </Link>
            <p className="text-lg font-semibold">{formatPrice(Number.parseFloat(item.price))}</p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between">
            <p className="font-semibold">{formatPrice(Number.parseFloat(item.price) * item.quantity)}</p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => handleMoveToWishlist(item.cart_item_id, item.name)}
              >
                <Heart className="h-4 w-4 mr-1" />
                Wishlist
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleRemove(item.cart_item_id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}