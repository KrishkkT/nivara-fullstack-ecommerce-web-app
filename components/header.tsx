import Link from "next/link"
import Image from "next/image"
import { getSession } from "@/lib/session"
import { User, Search, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileNav } from "./mobile-nav"
import { CartButton } from "./cart-button"
import { WishlistButton } from "./wishlist-button"

export async function Header() {
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
                alt="NIVARA"
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-300"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-2xl font-serif font-bold tracking-tight leading-none group-hover:text-primary transition-colors">
                NIVARA
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-light">
                YUG DIAMONDS AND JEWELS
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" asChild>
            <Link href="/shop">Shop</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/categories">Collections</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/about">About</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/contact">Contact</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          <WishlistButton />
          <CartButton />

          {session ? (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}

          {session?.role === "admin" && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin">
                <Shield className="h-5 w-5" />
                <span className="sr-only">Admin</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}