import { ProductCard } from "./product-card"

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

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {products.map((product: Product, index: number) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}