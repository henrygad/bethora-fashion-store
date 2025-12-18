"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ChevronDown } from "lucide-react"
import { useProduct } from "@/context/product-context"

export default function ProductsPage() {
  const { products } = useProduct();

  const [sortBy, setSortBy] = useState("featured")
  const [selectedGender, setSelectedGender] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 200])

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedGender !== "all") {
      filtered = filtered.filter((p) => p.gender === selectedGender)
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category.toLowerCase() === selectedCategory)
    }

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return filtered
  }, [sortBy, selectedGender, selectedCategory, priceRange, products])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Shop All Products</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="space-y-6">
            {/* Gender Filter */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Gender</h3>
              <div className="space-y-2">
                {["all", "men", "women", "unisex"].map((gender) => (
                  <label key={gender} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={selectedGender === gender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      value={gender}
                      className="cursor-pointer"
                    />
                    <span className="text-sm capitalize">{gender === "all" ? "All" : gender}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Category</h3>
              <div className="space-y-2">
                {["all", "men", "women", "accessories"].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      value={cat}
                      className="cursor-pointer"
                    />
                    <span className="text-sm capitalize">{cat === "all" ? "All" : cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {/* Sort Dropdown */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">{filteredProducts.length} results</p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-border rounded-lg px-4 py-2 pr-8 text-sm cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
