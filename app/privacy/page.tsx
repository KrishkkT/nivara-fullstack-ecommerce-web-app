import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | NIVARA",
  description: "Privacy policy for NIVARA Silver Jewels",
}

export default function PrivacyPage() {
  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif tracking-tight mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Introduction</h2>
          <p className="mb-4">
            At NIVARA Silver Jewels (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases from our store.
          </p>
          <p>
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Information We Collect</h2>
          <p className="mb-4">We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Name and contact information (email address, phone number)</li>
            <li>Billing and shipping address</li>
            <li>Payment information</li>
            <li>Order history and preferences</li>
          </ul>
          <p>We also automatically collect certain information when you visit our site, including:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>IP address and browser type</li>
            <li>Device information</li>
            <li>Browsing activity and pages visited</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">How We Use Your Information</h2>
          <p className="mb-4">We use your information to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Communicate with you about your account and orders</li>
            <li>Improve our website and services</li>
            <li>Prevent fraud and unauthorized transactions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Information Sharing</h2>
          <p className="mb-4">We do not sell or rent your personal information to third parties. We may share your information with:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Service providers who assist us in operating our business</li>
            <li>Payment processors to complete transactions</li>
            <li>Shipping carriers to deliver your orders</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Access and update your personal information</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Object to certain uses of your information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your browsing experience. You can control cookies through your browser settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif mb-4">Contact Us</h2>
          <p className="mb-4">If you have questions about this Privacy Policy, please contact us at:</p>
          <p className="mb-2"><strong>Email:</strong> <a href="mailto:nivarajewel@gmail.com" className="text-primary hover:underline">nivarajewel@gmail.com</a></p>
          <p className="mb-2"><strong>Phone:</strong> <a href="tel:+916352192939" className="text-primary hover:underline">+91 63521 92939</a></p>
        </section>
      </div>
    </div>
  )
}