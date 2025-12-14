"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

const FEATURED_PRODUCTS = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    category: "Men",
    price: 49,
    image: "/white-tshirt.png",
    rating: 4.8,
  },
  { id: "2", name: "Black Slim Jeans", category: "Men", price: 89, image: "/black-jeans.jpg", rating: 4.5 },
  { id: "3", name: "Summer Dress", category: "Women", price: 79, image: "/summer-dress.jpg", rating: 4.9 },
  {
    id: "4",
    name: "Leather Handbag",
    category: "Accessories",
    price: 129,
    image: "/leather-handbag.jpg",
    rating: 4.7,
  },
]

export default function Home() {
  const [email, setEmail] = useState("")

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 md:h-screen bg-linear-to-r from-orange-50 to-orange-100 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
                Elevate Your
                <span className="text-accent"> Style</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Discover premium fashion that makes you feel confident and beautiful every day.
              </p>
              <div className="flex gap-4">
                <Link href="/products">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-orange-600">
                    Shop Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hidden md:block h-96">
              <Image width={384} height={384} src="/fashion-model-lifestyle.jpg" alt="Hero" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-2">Browse by Category</h2>
          <p className="text-muted-foreground">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Men", image: "/mens-fashion.jpg", href: "/products?category=men" },
            { name: "Women", image: "/womens-fashion.jpg", href: "/products?category=women" },
            { name: "Accessories", image: "/fashion-accessories.jpg", href: "/products?category=accessories" },
            { name: "New Arrivals", image: "/new-fashion-trends.jpg", href: "/products?sort=newest" },
          ].map((cat) => (
            <Link key={cat.name} href={cat.href}>
              <div className="relative rounded-lg overflow-hidden h-48 md:h-64 group cursor-pointer">
                <img
                  src={cat.image || "/placeholder.svg"}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex items-end p-4">
                  <h3 className="text-white font-bold text-xl">{cat.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-2">Featured Products</h2>
          <p className="text-muted-foreground">Curated selections of our best pieces</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="bg-accent text-accent-foreground rounded-lg p-8 md:p-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Stay Updated</h2>
            <p className="text-accent-foreground/80 mb-6">
              Subscribe to our newsletter for exclusive offers and new arrivals.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-foreground"
              />
              <Button className="bg-slate-900 text-white hover:bg-slate-800">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
