"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { Plus, Minus, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { addToCart } from "@/app/actions/cart"
import { addToWishlist, removeFromWishlist, isInWishlist } from "@/app/actions/wishlist"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { mutate } from "swr"
import { useEffect } from "react"

interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: string
  compare_at_price: string
  image_url: string
  category_name: string
  category_slug: string
}

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const router = useRouter()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isInWishlistState, setIsInWishlistState] = useState(false)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)

  const discount = product.compare_at_price
    ? Math.round((1 - Number.parseFloat(product.price) / Number.parseFloat(product.compare_at_price)) * 100)
    : 0

  useEffect(() => {
    isInWishlist(product.id).then(setIsInWishlistState)
  }, [product.id])

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    console.log(`[v0] Adding ${quantity} of product ${product.id} (${product.name}) to cart`);

    setIsAddingToCart(true)

    let lastResult = null
    for (let i = 0; i < quantity; i++) {
      lastResult = await addToCart(product.id)
      console.log(`[v0] Add to cart attempt ${i + 1}:`, lastResult);
    }

    setIsAddingToCart(false)

    if (lastResult?.error) {
      if (lastResult.error === "Please sign in to add items to cart") {
        toast({
          title: "Sign in required",
          description: "Please sign in to add items to your cart",
          variant: "destructive",
        })
        router.push("/login")
      } else {
        toast({
          title: "Error",
          description: lastResult.error,
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Added to cart!",
        description: `${product.name} (${quantity}) added to your cart`,
      })
      mutate("/api/cart/count")
      router.refresh()
      setQuantity(1)
    }
  }

  function incrementQuantity(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setQuantity((q) => q + 1)
  }

  function decrementQuantity(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (quantity > 1) {
      setQuantity((q) => q - 1)
    }
  }

  async function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    setIsTogglingWishlist(true)

    const result = isInWishlistState ? await removeFromWishlist(product.id) : await addToWishlist(product.id)

    setIsTogglingWishlist(false)

    if (result.error) {
      if (result.error.includes("sign in")) {
        toast({
          title: "Sign in required",
          description: "Please sign in to manage your wishlist",
          variant: "destructive",
        })
        router.push("/login")
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } else {
      setIsInWishlistState(!isInWishlistState)
      toast({
        title: isInWishlistState ? "Removed from wishlist" : "Added to wishlist",
        description: isInWishlistState
          ? `${product.name} removed from your wishlist`
          : `${product.name} added to your wishlist`,
      })
      mutate("/api/wishlist/count")
    }
  }

  return (
    <div className="group animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
      <Link href={`/products/${product.slug}`}>
        <div className="relative overflow-hidden rounded-xl bg-card border border-border/50 mb-4 shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="aspect-square relative overflow-hidden bg-muted/30">
            <Image
              src={product.image_url || "/placeholder.svg?height=400&width=400&query=premium silver jewellery"}
              alt={product.name}
              fill
              className="object-cover luxury-image-hover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer" />
          </div>
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-br from-rose-bronze to-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">
              {discount}% OFF
            </div>
          )}
          <button
            onClick={handleToggleWishlist}
            disabled={isTogglingWishlist}
            className="absolute top-3 left-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all hover:scale-110 disabled:opacity-50"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isInWishlistState ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`}
            />
          </button>
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>
      <div className="space-y-3 px-1">
        <Link href={`/products/${product.slug}`}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{product.category_name}</p>
          <h3 className="font-serif text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 pt-1">
            <span className="font-semibold text-lg">{formatPrice(Number.parseFloat(product.price))}</span>
            {product.compare_at_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(Number.parseFloat(product.compare_at_price))}
              </span>
            )}
          </div>
        </Link>

        <div className="flex items-center gap-2 pt-2">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-none hover:bg-muted"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="w-10 text-center font-medium text-sm">{quantity}</div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-none hover:bg-muted"
              onClick={incrementQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            size="sm"
            className="flex-1 h-9 text-sm shadow-md hover:shadow-lg transition-all"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <ShoppingCart className="mr-1.5 h-4 w-4" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  )
}