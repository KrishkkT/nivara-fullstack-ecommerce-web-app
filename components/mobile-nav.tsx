"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 top-20 z-50 bg-white/98 backdrop-blur-md animate-fade-in">
          <nav className="container px-4 py-8 bg-[#F5F3F1]">
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/shop" 
                  className="text-lg font-medium block py-2 text-[#1E1C1D] hover:text-[#B29789] transition-colors" 
                  onClick={() => setIsOpen(false)}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories" 
                  className="text-lg font-medium block py-2 text-[#1E1C1D] hover:text-[#B29789] transition-colors" 
                  onClick={() => setIsOpen(false)}
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-lg font-medium block py-2 text-[#1E1C1D] hover:text-[#B29789] transition-colors" 
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-lg font-medium block py-2 text-[#1E1C1D] hover:text-[#B29789] transition-colors" 
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li className="pt-4">
                <Button asChild className="w-full">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}
