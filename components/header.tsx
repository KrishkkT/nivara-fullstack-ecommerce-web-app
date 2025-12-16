import Link from "next/link"
import Image from "next/image"
import { User, Search, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileNav } from "./mobile-nav"
import { CartButton } from "./cart-button"
import { WishlistButton } from "./wishlist-button"

export async function Header() {
  // Simplified header without session checking since middleware is disabled
  // This will show the account link to everyone
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <MobileNav />
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src="/images/nivara-logo.png"
                alt="Nivara Silver Logo"
                fill
                className="object-contain transition-transform group-hover:scale-105"
                priority
              />
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">
            Shop
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
            Categories
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/care" className="text-sm font-medium hover:text-primary transition-colors">
            Care
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/search" className="p-2 hover:bg-accent rounded-full transition-colors">
            <Search className="h-5 w-5" />
          </Link>
          
          <WishlistButton />
          <CartButton />
          
          {/* Show account link to everyone since middleware is disabled */}
          <Link href="/account" className="p-2 hover:bg-accent rounded-full transition-colors">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}