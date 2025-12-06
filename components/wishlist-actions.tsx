"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, X } from "lucide-react"
import { addToCart } from "@/app/actions/cart"
import { removeFromWishlist } from "@/app/actions/wishlist"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { mutate } from "swr"
import { useState } from "react"

interface WishlistActionsProps {
  productId: number
  productName: string
}

export function WishlistActions({ productId, productName }: WishlistActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  async function handleAddToCart() {
    setIsAddingToCart(true)
    const result = await addToCart(productId)
    setIsAddingToCart(false)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Added to cart",
        description: `${productName} added to your cart`,
      })
      mutate("/api/cart/count")
      router.refresh()
    }
  }

  async function handleRemove() {
    setIsRemoving(true)
    const result = await removeFromWishlist(productId)
    setIsRemoving(false)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Removed from wishlist",
        description: `${productName} removed from your wishlist`,
      })
      mutate("/api/wishlist/count")
      router.refresh()
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        className="flex-1 h-9 text-sm shadow-md hover:shadow-lg transition-all"
        onClick={handleAddToCart}
        disabled={isAddingToCart}
      >
        <ShoppingCart className="mr-1.5 h-4 w-4" />
        {isAddingToCart ? "Adding..." : "Add to Cart"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-9 px-3 bg-transparent"
        onClick={handleRemove}
        disabled={isRemoving}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
