"use client"

import Link from "next/link"
import { ShoppingCart, Search, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter();

  return (
    <header className="border-b bg-white sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-accent-foreground">B</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">Bethora</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-foreground hover:text-accent transition">
              All Products
            </Link>
            <Link href="/products?category=men" className="text-foreground hover:text-accent transition">
              Men
            </Link>
            <Link href="/products?category=women" className="text-foreground hover:text-accent transition">
              Women
            </Link>
            <Link href="/products?category=accessories" className="text-foreground hover:text-accent transition">
              Accessories
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={()=> router.push("/auth/login")}
            >
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </Button>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-3">
            <Link href="/products" className="text-foreground hover:text-accent transition py-2">
              All Products
            </Link>
            <Link href="/products?category=men" className="text-foreground hover:text-accent transition py-2">
              Men
            </Link>
            <Link href="/products?category=women" className="text-foreground hover:text-accent transition py-2">
              Women
            </Link>
            <Link href="/products?category=accessories" className="text-foreground hover:text-accent transition py-2">
              Accessories
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
