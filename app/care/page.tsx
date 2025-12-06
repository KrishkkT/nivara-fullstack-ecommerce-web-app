import type { Metadata } from "next"
import { Sparkles, Droplets, ShieldCheck, Package } from "lucide-react"

export const metadata: Metadata = {
  title: "Jewellery Care | NIVARA",
  description: "Learn how to care for and maintain your NIVARA silver jewellery",
}

export default function CarePage() {
  return (
    <div className="container px-4 py-12 max-w-5xl animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">Jewellery Care Guide</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Keep your NIVARA silver jewellery looking beautiful for years with these simple care tips
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-card border rounded-lg p-8 hover:shadow-lg transition-all">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-serif mb-3">Daily Care</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Put on your jewellery last, after applying makeup, perfume, and hair products</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Remove jewellery before swimming, bathing, or exercising</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Wipe with a soft, lint-free cloth after each wear to remove oils and dirt</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Avoid contact with household chemicals, chlorine, and harsh cleaning agents</span>
            </li>
          </ul>
        </div>

        <div className="bg-card border rounded-lg p-8 hover:shadow-lg transition-all">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Droplets className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-serif mb-3">Cleaning</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Clean regularly with warm water and mild soap using a soft brush</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Rinse thoroughly and dry completely with a soft cloth</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Use a silver polishing cloth for extra shine and to remove tarnish</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Never use abrasive materials or harsh chemicals on your silver</span>
            </li>
          </ul>
        </div>

        <div className="bg-card border rounded-lg p-8 hover:shadow-lg transition-all">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-serif mb-3">Storage</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Store each piece separately in a soft pouch or lined jewellery box</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Keep away from direct sunlight and excessive heat or humidity</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Use anti-tarnish strips in your jewellery box to slow oxidation</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Avoid storing in the bathroom due to high moisture levels</span>
            </li>
          </ul>
        </div>

        <div className="bg-card border rounded-lg p-8 hover:shadow-lg transition-all">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-serif mb-3">Protection</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Remove jewellery during household chores and gardening</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Avoid exposing to extreme temperatures or sudden temperature changes</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Be gentle when putting on or taking off to avoid bending or breaking</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Check clasps and settings regularly to ensure they're secure</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-muted/30 border rounded-lg p-8">
        <h2 className="text-2xl font-serif mb-4">Understanding Silver Tarnish</h2>
        <p className="text-muted-foreground mb-4">
          Tarnishing is a natural process that occurs when sterling silver reacts with sulfur compounds in the air,
          forming a dark layer on the surface. This doesn't mean your jewellery is damaged - it's simply a chemical
          reaction that can be easily reversed.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-semibold mb-2">Factors That Accelerate Tarnish:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>High humidity and moisture</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Exposure to certain foods (eggs, onions)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Contact with rubber, wool, or latex</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Air pollutants and chemicals</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">How to Prevent Tarnish:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Wear your silver regularly - skin oils help prevent tarnish</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Store in airtight containers or zip-lock bags</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Keep away from moisture and direct sunlight</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Use silica gel packets in storage boxes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 p-8 bg-primary/5 rounded-lg text-center border border-primary/20">
        <h2 className="text-2xl font-serif mb-3">Professional Cleaning</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          For heavily tarnished pieces or intricate designs, we recommend professional cleaning. Contact us to learn
          more about our cleaning and maintenance services.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
        >
          Get Professional Help
        </a>
      </div>
    </div>
  )
}
