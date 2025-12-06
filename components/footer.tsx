"use client"

import Link from "next/link"
import Image from "next/image"
import { MessageCircle, Instagram } from "lucide-react"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image src="/images/nivara-logo.png" alt="NIVARA" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-serif font-bold leading-none">NIVARA</h3>
                <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-light">
                  The Art of Subtle Luxury
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Handcrafted sterling silver jewellery.</p>
            <div className="flex gap-3">
              <Link
                href="https://wa.me/+916352192939"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with NIVARA on WhatsApp"
                className="transition-all hover:scale-110"
              >
                <MessageCircle className="h-5 w-5 text-[#B29789] hover:text-[#C9B7A6]" />
              </Link>
              <Link
                href="https://www.instagram.com/nivara_silver_?igsh=eHVwNmVyYXd1MnU4&utm_source=qr"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/shop"
                  onClick={scrollToTop}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/rings"
                  onClick={scrollToTop}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Rings
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/pendant-sets"
                  onClick={scrollToTop}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Pendant Sets
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/earrings"
                  onClick={scrollToTop}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Earrings
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/necklaces"
                  onClick={scrollToTop}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Necklaces
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  onClick={scrollToTop}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/care"
                  onClick={scrollToTop}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Jewellery Care
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  onClick={scrollToTop}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  onClick={scrollToTop}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  onClick={scrollToTop}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  onClick={scrollToTop}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:nivarajewel@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Email Support
                </Link>
              </li>
              <li>
                <Link
                  href="tel:+916352192939"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Call Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  onClick={scrollToTop}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  onClick={scrollToTop}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NIVARA Silver Jewels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}