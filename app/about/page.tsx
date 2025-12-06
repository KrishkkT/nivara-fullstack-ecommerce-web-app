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
              Founded with a passion for timeless elegance, NIVARA brings you exquisite premium silver jewellery that
              celebrates the art of subtle luxury. Each piece in our collection is meticulously crafted by skilled
              artisans who pour their heart and soul into creating jewellery that transcends trends.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Our name, NIVARA, symbolizes shelter and protection – a reflection of how we view our jewellery as more
              than mere accessories. They are treasured companions that accompany you through life's precious moments,
              creating memories that last forever.
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
