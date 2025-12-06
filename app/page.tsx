import Link from "next/link"
import { sql } from "@/lib/db"
import { ProductGrid } from "@/components/product-grid"
import { CategoryCard } from "@/components/category-card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default async function HomePage() {
  let featuredProducts = []
  let categories = []

  try {
    // Fetch featured products
    const productsResult = await sql`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = true AND p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT 8
    `
    featuredProducts = productsResult

    // Fetch categories
    const categoriesResult = await sql`
      SELECT * FROM categories
      ORDER BY name
    `
    categories = categoriesResult
  } catch (error) {
    console.error("[ERROR] Failed to fetch data:", error)
    // Continue with empty arrays
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-beige via-card to-muted">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-rose-bronze rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-taupe rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container px-4 text-center space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-balance">The Art of Subtle Luxury</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Handcrafted sterling silver jewellery that tells your story
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link href="/shop">Explore Collection</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features - Simplified to only show 925 Sterling Silver */}
      <section className="py-16 border-y bg-card">
        <div className="container px-4">
          <div className="flex justify-center">
            <div className="flex flex-col items-center text-center space-y-3 animate-fade-in max-w-md">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">925 Sterling Silver</h3>
              <p className="text-sm text-muted-foreground">Certified hallmarked jewellery with purity guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20">
          <div className="container px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-serif tracking-tight">Shop by Category</h2>
              <p className="text-muted-foreground text-lg">Discover our curated collections</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {categories.map((category: any, index: number) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-serif tracking-tight">Featured Pieces</h2>
              <p className="text-muted-foreground text-lg">Handpicked selections from our artisans</p>
            </div>
            <ProductGrid products={featuredProducts} />
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link href="/shop">View All Products</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/10">
        <div className="container px-4 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-balance">Begin Your Journey</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Each piece is crafted with love and attention to detail. Start your collection today.
          </p>
          <Button size="lg" asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
