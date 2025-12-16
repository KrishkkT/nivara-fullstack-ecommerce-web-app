import Link from "next/link"
import Image from "next/image"
import { getSession } from "@/lib/session"
import { User, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileNav } from "./mobile-nav"
import { CartButton } from "./cart-button"
import { WishlistButton } from "./wishlist-button"
import { signOut } from "@/app/actions/auth"

export async function Header() {
  // Check if user is logged in
  const session = await getSession()
  
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
          <WishlistButton />
          <CartButton />
          
          {/* Show appropriate auth links based on session status */}
          {session ? (
            <div className="flex items-center gap-2">
              {/* Show admin shield for admin users */}
              {session.role === 'admin' && (
                <Link href="/admin" className="p-2 hover:bg-accent rounded-full transition-colors">
                  <Shield className="h-5 w-5 text-blue-600" />
                </Link>
              )}
              
              <div className="relative group">
                <button className="p-2 hover:bg-accent rounded-full transition-colors">
                  <User className="h-5 w-5" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/account" className="block px-4 py-2 hover:bg-accent rounded-t-lg">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="block px-4 py-2 hover:bg-accent">
                    Profile
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 hover:bg-accent">
                    Orders
                  </Link>
                  <Link href="/profile/settings" className="block px-4 py-2 hover:bg-accent">
                    Settings
                  </Link>
                  <Link href="/profile/change-password" className="block px-4 py-2 hover:bg-accent rounded-b-lg">
                    Change Password
                  </Link>
                  <div className="border-t my-1"></div>
                  <form action={signOut}>
                    <button 
                      type="submit" 
                      className="block w-full text-left px-4 py-2 hover:bg-accent rounded-b-lg"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Sign In
              </Link>
              <span className="text-muted-foreground">|</span>
              <Link href="/register" className="text-sm font-medium hover:text-primary transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}