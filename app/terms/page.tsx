import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | NIVARA",
  description: "Terms of service for NIVARA Silver Jewels",
}

export default function TermsPage() {
  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif tracking-tight mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the NIVARA Silver Jewels website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Use of Site</h2>
          <p className="mb-4">
            The content and materials on this site are protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works of any content without our express written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Products and Pricing</h2>
          <p className="mb-4">
            We strive to display accurate product information and pricing. However, errors may occur. We reserve the right to correct any errors and to change prices, specifications, and descriptions at any time without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Orders and Payment</h2>
          <p className="mb-4">
            By placing an order, you are making an offer to purchase products. All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason.
          </p>
          <p className="mb-4">
            Payment must be made in full at the time of order placement. We accept various payment methods including credit/debit cards and digital wallets through our payment partner Razorpay.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Shipping and Delivery</h2>
          <p className="mb-4">
            We aim to process and ship orders within 1-2 business days. Delivery times vary based on your location and the shipping method selected. Risk of loss and title for products pass to you upon delivery.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Returns and Refunds</h2>
          <p className="mb-4">
            Our return policy allows you to return products within 7 days of receipt for a full refund or exchange. Items must be in their original condition with all packaging and tags intact.
          </p>
          <p>
            Custom-made or personalized items are non-returnable unless defective. Refunds will be processed within 5-7 business days after we receive the returned item.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Warranty</h2>
          <p>
            Our products come with a 6-month warranty against manufacturing defects. This warranty does not cover damage caused by misuse, accidents, or normal wear and tear.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Limitation of Liability</h2>
          <p>
            NIVARA Silver Jewels shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of our website or products, even if we have been advised of the possibility of such damages.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of the site after any changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif mb-4">Contact Information</h2>
          <p className="mb-4">If you have any questions about these Terms of Service, please contact us at:</p>
          <p className="mb-2"><strong>Email:</strong> <a href="mailto:nivarajewel@gmail.com" className="text-primary hover:underline">nivarajewel@gmail.com</a></p>
          <p className="mb-2"><strong>Phone:</strong> <a href="tel:+916352192939" className="text-primary hover:underline">+91 63521 92939</a></p>
          <p><strong>Address:</strong> [Company Address]</p>
        </section>
      </div>
    </div>
  )
}