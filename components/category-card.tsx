import Link from "next/link"
import Image from "next/image"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  image_url: string
}

export function CategoryCard({ category, index }: { category: Category; index: number }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative overflow-hidden rounded-lg bg-card border animate-scale-in hover:shadow-lg transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={category.image_url || "/placeholder.svg"}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-2xl font-serif mb-2">{category.name}</h3>
        {category.description && (
          <p className="text-sm text-white/90">{category.description}</p>
        )}
      </div>
    </Link>
  )
}
