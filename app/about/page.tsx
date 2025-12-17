import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-12">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground">About NIVARA</h1>
            <p className="text-xl text-muted-foreground">The Art of Subtle Luxury</p>
          </div>

          <div className="relative h-96 overflow-hidden rounded-lg">
            <Image src="/luxury-silver-jewellery-workshop-artisan-crafting-.jpg" alt="NIVARA Workshop" fill className="object-cover" />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Our Story</h2>
            <p className="leading-relaxed text-muted-foreground">
              With over 30 years of excellence in gold and diamond jewellery, Yug Diamonds and Jewel has built a legacy of trust and craftsmanship. From this rich experience comes Nivara, our dedicated silver jewellery brand.            </p>
            <p className="leading-relaxed text-muted-foreground">
              Rooted in heritage yet designed for modern elegance, Nivara reflects three decades of expertise, bringing refined silver creations that carry the same quality, authenticity, and timeless appeal.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Our Craftsmanship</h2>
            <p className="leading-relaxed text-muted-foreground">
              We work exclusively with 925 sterling silver, ensuring the highest quality for every piece. Our artisans
              blend traditional techniques with contemporary designs, creating jewellery that is both timeless and
              modern. Each item undergoes rigorous quality checks to meet our exacting standards.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 text-4xl font-bold text-primary">925</div>
              <h3 className="mb-2 font-semibold">Sterling Silver</h3>
              <p className="text-sm text-muted-foreground">Premium quality guaranteed</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl font-bold text-primary">100%</div>
              <h3 className="mb-2 font-semibold">Handcrafted</h3>
              <p className="text-sm text-muted-foreground">By skilled artisans</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl font-bold text-primary">∞</div>
              <h3 className="mb-2 font-semibold">Timeless Design</h3>
              <p className="text-sm text-muted-foreground">Elegance that endures</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Our Commitment</h2>
            <p className="leading-relaxed text-muted-foreground">
              At NIVARA, we are committed to sustainable practices and ethical sourcing. We believe in creating
              jewellery that you can wear with pride, knowing that it was made with respect for both people and the
              planet. Our packaging is eco-friendly, and we continuously work to minimize our environmental footprint.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
