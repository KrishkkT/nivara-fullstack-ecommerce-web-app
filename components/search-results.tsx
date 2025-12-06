"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"

interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: string
  compare_at_price: string
  image_url: string
  stock_quantity: number
  category_name: string
  category_slug: string
  design_number?: string
}

export function SearchResults({ query, products }: { query: string; products: Product[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(query)
  const [designNumber, setDesignNumber] = useState(searchParams.get("designNumber") || "")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    
    if (searchQuery.trim()) {
      params.set("q", searchQuery)
    }
    
    if (designNumber.trim()) {
      params.set("designNumber", designNumber)
    }
    
    if (minPrice.trim()) {
      params.set("minPrice", minPrice)
    }
    
    if (maxPrice.trim()) {
      params.set("maxPrice", maxPrice)
    }
    
    const queryString = params.toString()
    router.push(`/search${queryString ? `?${queryString}` : ""}`)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setDesignNumber("")
    setMinPrice("")
    setMaxPrice("")
    router.push("/search")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-6 text-3xl font-bold">Search Products</h1>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, description, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Design Number"
                  value={designNumber}
                  onChange={(e) => setDesignNumber(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Min Price (₹)</label>
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Max Price (₹)</label>
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit">Search</Button>
              <Button type="button" variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </form>
        </div>

        {(query || designNumber || minPrice || maxPrice) && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              {products.length > 0
                ? `Found ${products.length} result${products.length === 1 ? "" : "s"}`
                : `No results found`}
            </p>
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (query || designNumber || minPrice || maxPrice) ? (
          <div className="rounded-lg border-2 border-dashed p-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">No products found</h2>
            <p className="text-muted-foreground">Try adjusting your search terms or browse our categories</p>
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed p-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">Start searching</h2>
            <p className="text-muted-foreground">Enter a search term to find your perfect piece of jewellery</p>
          </div>
        )}
      </div>
    </div>
  )
}