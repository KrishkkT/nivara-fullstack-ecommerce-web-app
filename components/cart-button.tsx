"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCartCount } from "@/hooks/use-cart"

export function CartButton() {
  const { count } = useCartCount()

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
        <span className="sr-only">Cart</span>
      </Link>
    </Button>
  )
}
