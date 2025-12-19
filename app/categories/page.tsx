import { sql } from "@/lib/db"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Categories | NIVARA",
  description: "Explore our sterling silver jewellery categories",
}

export default async function CategoriesPage() {
  const categories = await sql`
    SELECT * FROM categories 
    ORDER BY id ASC
  `

  const categoryDetails: Record<string, any> = {
    necklace: {
      longDescription:
        "Our exquisite collection of sterling silver necklaces embodies timeless elegance and contemporary design. Each necklace is meticulously handcrafted by skilled artisans who pour their expertise into every detail. From delicate chains perfect for layering to statement pieces adorned with intricate patterns, our necklaces celebrate the versatility of silver jewellery. Made from 925 sterling silver, each piece tells its own unique story and is designed to be cherished for generations.",
      features: [
        "925 Sterling Silver purity guaranteed",
        "Hypoallergenic and skin-friendly",
        "Multiple chain lengths available",
        "Oxidized and polished finishes",
      ],
    },
    "pendent-set": {
      longDescription:
        "Discover the artistry of our pendant sets, where sacred symbols meet modern aesthetics. Each set features carefully selected pendants that range from spiritual lotus flowers to ethereal moonstones, all suspended on delicate sterling silver chains. Our pendant sets are designed to be versatile—wear them as single statements or layer them for a contemporary look. Perfect for gifting or personal collection.",
      features: [
        "Matching chains included with each pendant",
        "Adjustable chain lengths",
        "Secure clasps for worry-free wear",
        "Perfect for layering or solo statements",
      ],
    },
    "mop-ring": {
      longDescription:
        "Elegant mother of pearl silver rings that blend natural beauty with expert craftsmanship. Each ring features genuine mother of pearl inlays set in 925 sterling silver, creating a unique piece where no two are exactly alike. The iridescent shimmer of MOP combined with the lustrous silver creates a sophisticated accessory perfect for any occasion, from casual daily wear to special celebrations.",
      features: [
        "Genuine mother of pearl inlays",
        "925 Sterling Silver setting",
        "Adjustable and fixed sizes available",
        "Unique natural patterns in each piece",
      ],
    },
    "solitare-ring": {
      longDescription:
        "Classic silver solitaire rings featuring carefully selected precious and semi-precious stones. Each ring showcases a single stone in an elegant silver setting, emphasizing the beauty of both the gemstone and the metalwork. From sparkling cubic zirconia to natural gemstones, our solitaire collection offers timeless designs that symbolize commitment, love, and personal style. Perfect for engagements, anniversaries, or as a special gift.",
      features: [
        "Premium stone selection",
        "Secure prong or bezel settings",
        "Multiple stone options available",
        "Elegant minimalist designs",
      ],
    },
    bracelet: {
      longDescription:
        "Our bracelet collection showcases the perfect marriage of elegance and durability in sterling silver. From delicate charm bracelets that tell your personal story to bold cuff designs featuring traditional motifs, each piece is designed to make a statement. Our artisans employ time-honored techniques to create textures that catch the light beautifully. Whether you prefer chains, cuffs, or bangles, our collection offers something for every wrist and style.",
      features: [
        "Adjustable and fixed sizes available",
        "From delicate chains to bold cuffs",
        "Customizable charm options",
        "Comfortable for all-day wear",
      ],
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 py-16">
        <div className="text-center space-y-6 mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
            Our Collections
          </div>
          <h1 className="text-5xl md:text-6xl font-serif tracking-tight text-balance">Jewellery Categories</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Explore our carefully curated categories of premium sterling silver jewellery, each piece a testament to
            timeless craftsmanship
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {categories.map((category: any) => {
            const details = categoryDetails[category.slug as keyof typeof categoryDetails]
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group bg-card rounded-2xl overflow-hidden border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-2xl animate-fade-in"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
                  <Image
                    src={
                      category.image_url ||
                      `/placeholder.svg?height=400&width=600&query=silver ${category.name.toLowerCase() || "/placeholder.svg"}`
                    }
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h2 className="text-3xl font-serif font-bold text-white mb-2 drop-shadow-lg">{category.name}</h2>
                    {category.description && (
                      <p className="text-white/90 text-sm drop-shadow">{category.description}</p>
                    )}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">{details?.longDescription}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {details?.features.slice(0, 2).map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                    Explore Collection
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
