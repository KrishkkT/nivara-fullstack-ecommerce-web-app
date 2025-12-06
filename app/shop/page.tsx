import { sql } from "@/lib/db"
import { ShopFilters } from "@/components/shop-filters"
import { ProductCard } from "@/components/product-card"

export const metadata = {
  title: "Shop All Products | NIVARA",
  description: "Browse our complete collection of premium sterling silver jewellery",
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; minPrice?: string; maxPrice?: string }>
}) {
  const params = await searchParams
  const { category, sort = "newest", minPrice, maxPrice } = params

  let query = sql`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = true
  `

  // Category filter
  if (category && category !== "all") {
    query = sql`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true AND c.slug = ${category}
    `
  }

  // Get all products first
  let products = await query

  // Price filter
  if (minPrice || maxPrice) {
    products = products.filter((p: any) => {
      const price = Number.parseFloat(p.price)
      if (minPrice && price < Number.parseFloat(minPrice)) return false
      if (maxPrice && price > Number.parseFloat(maxPrice)) return false
      return true
    })
  }

  // Sorting
  if (sort === "price-low") {
    products.sort((a: any, b: any) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
  } else if (sort === "price-high") {
    products.sort((a: any, b: any) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
  } else if (sort === "name") {
    products.sort((a: any, b: any) => a.name.localeCompare(b.name))
  }

  const categories = await sql`
    SELECT * FROM categories 
    ORDER BY name
  `

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 py-16">
        <div className="text-center space-y-6 mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
            Complete Collection
          </div>
          <h1 className="text-5xl md:text-6xl font-serif tracking-tight text-balance">Handcrafted Excellence</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Discover our full range of premium sterling silver jewellery, each piece crafted with meticulous attention
            to detail
          </p>
        </div>

        <ShopFilters categories={categories} currentCategory={category} currentSort={sort} />

        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-8">
            {products.map((product: any, index: number) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
