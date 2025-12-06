import { RotateCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export const metadata = {
  title: "Returns & Exchange Policy | NIVARA",
  description: "Easy 7-day returns and exchange policy for your peace of mind",
}

export default function ReturnsPage() {
  return (
    <div className="container px-4 py-16 max-w-4xl">
      <div className="text-center space-y-4 mb-12 animate-fade-in">
        <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
          Returns & Exchange
        </div>
        <h1 className="text-5xl font-serif tracking-tight">Hassle-Free Returns</h1>
        <p className="text-xl text-muted-foreground">Your satisfaction is our priority</p>
      </div>

      <div className="space-y-8">
        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-2">Return Policy</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">7 Days Return:</strong> We offer a 7-day return and exchange
                  policy from the date of delivery. If you're not completely satisfied with your purchase, you can
                  return or exchange the product within this period, no questions asked.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Lifetime Silver Buyback Guarantee:</strong> We offer a lifetime
                  buyback guarantee on all our sterling silver products. You can return your silver jewellery at any
                  time and receive the current market price for the silver content.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-serif font-semibold mb-6">Eligible Items</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Products in original condition</p>
                <p className="text-sm text-muted-foreground">
                  Item must be unused and in the same condition as received
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Original packaging intact</p>
                <p className="text-sm text-muted-foreground">All tags, certificates, and boxes must be included</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Proof of purchase</p>
                <p className="text-sm text-muted-foreground">Original invoice or order confirmation required</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-serif font-semibold mb-6">Non-Returnable Items</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Customized or personalized jewellery</p>
                <p className="text-sm text-muted-foreground">Items made to order cannot be returned</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Items showing signs of wear</p>
                <p className="text-sm text-muted-foreground">Scratched, damaged, or altered products</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Sale or clearance items</p>
                <p className="text-sm text-muted-foreground">Final sale items are non-returnable</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-4">How to Return</h2>
              <ol className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-bold text-primary">1.</span>
                  <span>Contact our customer support team via email or phone within 7 days of delivery</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">2.</span>
                  <span>Receive a Return Authorization Number and shipping instructions</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">3.</span>
                  <span>Pack the item securely with all original packaging and accessories</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">4.</span>
                  <span>Ship the package using our prepaid return label (we cover return shipping costs)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">5.</span>
                  <span>
                    Refund will be processed within 5-7 business days after we receive and inspect the returned item
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 text-center">
          <p className="text-lg font-medium mb-2">Need help with your return?</p>
          <p className="text-muted-foreground mb-4">Our customer support team is here to assist you</p>
          <a href="/contact" className="text-primary font-semibold hover:underline">
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  )
}
