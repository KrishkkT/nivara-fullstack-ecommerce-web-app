"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Category {
  id: number
  name: string
  slug: string
}

export function ShopFilters({
  categories,
  currentCategory,
  currentSort,
}: {
  categories: Category[]
  currentCategory?: string
  currentSort?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilters(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-4 items-center justify-between bg-card border rounded-xl p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!currentCategory || currentCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilters("category", "")}
          className="rounded-full"
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={currentCategory === cat.slug ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilters("category", cat.slug)}
            className="rounded-full"
          >
            {cat.name}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Select value={currentSort || "newest"} onValueChange={(value) => updateFilters("sort", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="name">Name: A to Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
