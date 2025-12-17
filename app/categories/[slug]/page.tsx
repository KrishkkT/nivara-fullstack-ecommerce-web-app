import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { sql } from "@/lib/db"
import { ProductGrid } from "@/components/product-grid"

export async function generateStaticParams() {
  try {
    const categories = await sql`SELECT slug FROM categories`
    return categories.map((cat: any) => ({ slug: cat.slug }))
  } catch (error) {
    // If database is not available during build, return empty array
    // This is common in CI/CD environments
    console.warn('Could not fetch categories for static generation:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = await sql`
    SELECT name, description, meta_title, meta_description, image_url 
    FROM categories 
    WHERE slug = ${slug}
  `

  if (!category.length) {
    return { title: "Category Not Found" }
  }

  const cat = category[0]

  return {
    title: cat.meta_title || `${cat.name} | NIVARA Jewellery`,
    description: cat.meta_description || cat.description || `Shop our ${cat.name} collection at NIVARA.`,
    openGraph: {
      title: cat.meta_title || `${cat.name} | NIVARA Jewellery`,
      description: cat.meta_description || cat.description,
      images: [cat.image_url],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: cat.meta_title || `${cat.name} | NIVARA Jewellery`,
      description: cat.meta_description || cat.description,
      images: [cat.image_url],
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const category = await sql`SELECT * FROM categories WHERE slug = ${slug}`

  if (!category.length) {
    notFound()
  }

  const products = await sql`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE c.slug = ${slug} AND p.is_active = true
    ORDER BY p.created_at DESC
  `

  return (
    <div className="container px-4 py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight">{category[0].name}</h1>
        <p className="text-lg text-muted-foreground">{category[0].description}</p>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found in this category.</p>
        </div>
      )}
    </div>
  )
}
