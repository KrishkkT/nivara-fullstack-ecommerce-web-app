import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { sql } from "@/lib/db"
import { ProductDetail } from "@/components/product-detail"
import { isInWishlist } from "@/app/actions/wishlist"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params
    const product = await sql`
      SELECT p.name, p.description, p.image_url, p.price, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ${slug}
    `

    if (!product.length) {
      return { title: "Product Not Found" }
    }

    const prod = product[0] as any

    return {
      title: `${prod.name} | NIVARA Jewellery`,
      description: prod.description || `Shop ${prod.name} from NIVARA's premium silver collection.`,
      openGraph: {
        title: `${prod.name} | NIVARA Jewellery`,
        description: prod.description,
        images: [prod.image_url],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${prod.name} | NIVARA Jewellery`,
        description: prod.description,
        images: [prod.image_url],
      },
    }
  } catch (error) {
    return { title: "Product Not Found" }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    const product = await sql`
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.compare_at_price,
        p.image_url,
        p.images,
        p.metal_purity,
        p.design_number,
        p.is_featured,
        p.is_active,
        c.name as category_name, 
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ${slug} AND p.is_active = true
    `

    if (!product.length) {
      notFound()
    }

    const initialIsInWishlist = await isInWishlist(product[0].id).catch(() => false)

    const rawProduct = product[0] as any
    let productImages: string[] = []

    if (Array.isArray(rawProduct.images)) {
      // Already an array from JSONB
      productImages = rawProduct.images
    } else if (rawProduct.images && typeof rawProduct.images === "object") {
      // JSONB object, convert to array
      productImages = [rawProduct.image_url]
    } else {
      // Fallback to main image
      productImages = [rawProduct.image_url]
    }

    const productData = {
      id: rawProduct.id,
      name: rawProduct.name,
      slug: rawProduct.slug,
      description: rawProduct.description || "",
      price: rawProduct.price ? String(rawProduct.price) : "0",
      compare_at_price: rawProduct.compare_at_price ? String(rawProduct.compare_at_price) : null,
      image_url: rawProduct.image_url || "",
      images: productImages,
      metal_purity: rawProduct.metal_purity || null,
      design_number: rawProduct.design_number || null,
      category_name: rawProduct.category_name || "",
      category_slug: rawProduct.category_slug || "",
      is_featured: rawProduct.is_featured || false,
      is_active: rawProduct.is_active || false,
    }

    return <ProductDetail product={productData} initialIsInWishlist={initialIsInWishlist} />
  } catch (error) {
    console.error("[v0] Product page error:", error)
    notFound()
  }
}
