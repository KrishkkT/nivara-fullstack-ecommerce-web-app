"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, Heart, Package, Sparkles, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { addToCart } from "@/app/actions/cart"
import { addToWishlist, removeFromWishlist } from "@/app/actions/wishlist"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { mutate } from "swr"

interface Product {
  id: number
  name: string
  description: string
  price: string
  compare_at_price: string | null
  image_url: string
  images: string[]
  metal_purity: string | null
  design_number: string | null
  category_name: string
  category_slug: string
  is_featured?: boolean
  is_active?: boolean
}

export function ProductDetail({
  product,
  initialIsInWishlist = false,
}: { product: Product; initialIsInWishlist?: boolean }) {
  const router = useRouter()
  const { toast } = useToast()

  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image_url]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isInWishlistState, setIsInWishlistState] = useState(initialIsInWishlist)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)
  const [mounted, setMounted] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const selectedImage = images[currentImageIndex]
  const discount = product.compare_at_price
    ? Math.round((1 - Number.parseFloat(product.price) / Number.parseFloat(product.compare_at_price)) * 100)
    : 0

  useEffect(() => {
    setMounted(true)
  }, [])

  function nextImage() {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  function prevImage() {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.touches[0].clientX
  }

  function handleTouchEnd() {
    const swipeDistance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        nextImage()
      } else {
        prevImage()
      }
    }
  }

  async function handleAddToCart() {
    setLoading(true)
    const result = await addToCart(product.id)
    setLoading(false)

    if (result.error) {
      if (result.error === "Please sign in to add items to cart") {
        toast({
          title: "Sign in required",
          description: "Please sign in to add items to your cart",
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
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      })
      mutate("/api/cart/count")
    }
  }

  async function handleToggleWishlist() {
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
    <div className="container px-4 py-12">
      <nav className="mb-10 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link href={`/categories/${product.category_slug}`} className="hover:text-primary transition-colors">
            {product.category_name}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </div>
      </nav>

      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-6 animate-fade-in">
          <div
            className="relative aspect-square rounded-2xl overflow-hidden bg-muted/30 border-2 border-border shadow-2xl group"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={selectedImage || "/placeholder.svg?height=600&width=600&query=premium silver jewellery"}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              quality={95}
            />
            {discount > 0 && (
              <div className="absolute top-6 right-6 bg-gradient-to-br from-destructive to-destructive/80 text-white text-base font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                Save {discount}%
              </div>
            )}
            <div className="absolute top-6 left-6 bg-gradient-to-br from-primary/90 to-secondary/90 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              925 Silver
            </div>

            {images.length > 1 && mounted && (
              <>
                <Button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_: string, idx: number) => (
                    <Button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      variant="ghost"
                      size="icon"
                      className={`w-2 h-2 p-0 rounded-full transition-all ${
                        idx === currentImageIndex ? "bg-white w-8" : "bg-white/50"
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && mounted && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img: string, idx: number) => (
                <Button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  variant="ghost"
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 p-0 h-auto ${
                    currentImageIndex === idx ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-border"
                  }`}
                >
                  <Image
                    src={img || "/placeholder.svg?height=150&width=150&query=silver jewellery"}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 150px"
                    quality={95}
                  />
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8 animate-slide-in">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground font-medium">
              <Star className="h-4 w-4 fill-primary text-primary" />
              {product.category_name}
            </div>
            <h1 className="text-5xl font-serif tracking-tight leading-tight text-balance">{product.name}</h1>

            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-4xl font-bold tracking-tight">{formatPrice(Number.parseFloat(product.price))}</span>
              {product.compare_at_price && (
                <span className="text-2xl text-muted-foreground line-through">
                  {formatPrice(Number.parseFloat(product.compare_at_price))}
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed text-lg text-pretty">{product.description}</p>
          </div>

          <div className="space-y-4 py-8 border-y-2">
            {product.metal_purity && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Metal Purity</p>
                  <p className="text-muted-foreground">{product.metal_purity}</p>
                </div>
              </div>
            )}
            {product.design_number && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Package className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Design Number</p>
                  <p className="text-muted-foreground">{product.design_number}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1 h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={handleAddToCart}
              disabled={loading}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {loading ? "Adding..." : "Add to Cart"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-6 border-2 hover:bg-muted/50 bg-transparent"
              onClick={handleToggleWishlist}
              disabled={isTogglingWishlist}
            >
              <Heart className={`h-5 w-5 transition-colors ${isInWishlistState ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
