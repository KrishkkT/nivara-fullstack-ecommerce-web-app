import { Package, Truck, Clock, MapPin, Shield } from 'lucide-react'

export const metadata = {
  title: "Shipping Information | NIVARA",
  description: "Learn about our shipping policies and delivery timelines",
}

export default function ShippingPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 animate-fadeIn">
      <div className="text-center space-y-4 mb-12 animate-fade-in">
        <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
          Shipping Information
        </div>
        <h1 className="text-5xl font-serif tracking-tight">Delivery & Shipping</h1>
        <p className="text-xl text-muted-foreground">
          We ensure your precious jewellery reaches you safely and securely
        </p>
      </div>

      <div className="space-y-8">
        {/* Removed "Free Shipping" section completely */}
        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-4">Delivery Timeline</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="font-medium">Metro Cities</span>
                  <span className="text-primary font-semibold">3-5 Business Days</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="font-medium">Other Cities</span>
                  <span className="text-primary font-semibold">5-7 Business Days</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="font-medium">Remote Areas</span>
                  <span className="text-primary font-semibold">7-10 Business Days</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                * Timelines may vary during peak seasons and public holidays
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-2">Order Processing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All orders are processed within 24-48 hours of payment confirmation. You will receive a tracking number
                via email once your order has been dispatched.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Orders placed before 2 PM IST are processed the same day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Weekend orders are processed on the next business day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Customized orders may take 5-7 additional business days</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-2">Tracking Your Order</h2>
              <p className="text-muted-foreground leading-relaxed">
                Once your order is shipped, you'll receive a tracking link via email and SMS. You can track your package
                in real-time through our courier partner's website. For any shipping queries, please contact our
                customer support team.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-4">Privacy Policy</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Information We Collect</h3>
                  <p className="text-muted-foreground">
                    We may collect your name, email, phone number, address, and order details. Payment details are processed by secure payment gateways.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. How We Use Your Information</h3>
                  <p className="text-muted-foreground">
                    We use your data to process orders, improve the website, and provide customer support. Marketing communication is sent only with your permission.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Sharing Your Information</h3>
                  <p className="text-muted-foreground">
                    We share required information with courier partners, payment gateways, and trusted service providers. We never sell personal data.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Cookies</h3>
                  <p className="text-muted-foreground">
                    Cookies help us improve user experience. You can disable cookies through your browser settings.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. Data Security</h3>
                  <p className="text-muted-foreground">
                    We follow industry standards to protect your personal information.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. Your Rights</h3>
                  <p className="text-muted-foreground">
                    You may request data correction or deletion at any time.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">7. Contact</h3>
                  <p className="text-muted-foreground">
                    For privacy-related concerns, contact: <a href="mailto:nivarajewel@gmail.com" className="text-primary hover:underline">nivarajewel@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}