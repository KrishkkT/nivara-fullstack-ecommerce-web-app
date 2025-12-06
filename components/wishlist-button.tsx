"use client"

import { Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function WishlistButton() {
  const { data } = useSWR("/api/wishlist/count", fetcher, {
    refreshInterval: 3000,
  })

  const count = data?.count || 0

  return (
    <Button variant="ghost" size="icon" asChild className="relative hover:bg-primary/10">
      <Link href="/wishlist">
        <Heart className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
            {count}
          </span>
        )}
        <span className="sr-only">Wishlist ({count} items)</span>
      </Link>
    </Button>
  )
}
