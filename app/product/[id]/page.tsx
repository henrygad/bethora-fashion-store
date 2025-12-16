"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Star, Heart, Share2, Truck, RotateCw, Shield } from "lucide-react"

const PRODUCTS = {
  "1": {
    id: "1",
    name: "Classic White T-Shirt",
    category: "Men",
    price: 49,
    rating: 4.8,
    reviews: 128,
    images: ["/white-tshirt-front.jpg", "/white-tshirt-back.jpg", "/white-tshirt-detail.jpg"],
    description:
      "A timeless classic. This premium cotton t-shirt is perfect for any occasion. Made with 100% organic cotton, it's soft, breathable, and designed to last.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Navy", "Gray"],
    details: ["Material: 100% Organic Cotton", "Weight: 180gsm", "Fit: Regular", "Care: Machine wash cold"],
  },
  "2": {
    id: "2",
    name: "Black Slim Jeans",
    category: "Men",
    price: 89,
    rating: 4.5,
    reviews: 84,
    images: ["/black-jeans-front.jpg", "/black-jeans-back.jpg", "/black-jeans-detail.jpg"],
    description:
      "Experience comfort meets style with these premium slim-fit jeans. Perfect for casual outings or dressing up.",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Black", "Blue", "Gray"],
    details: ["Material: 98% Cotton, 2% Elastane", "Fit: Slim", "Care: Machine wash cold, turn inside out"],
  },
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = PRODUCTS[params.id as keyof typeof PRODUCTS]
  
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "")
  const [quantity, setQuantity] = useState(1)
  const [mainImage, setMainImage] = useState(0)

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link href="/products">
            <Button className="mt-4">Back to Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-96 md:h-[600px]">
              <img
                src={product.images[mainImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(idx)}
                  className={`h-20 rounded-lg overflow-hidden border-2 transition ${
                    mainImage === idx ? "border-accent" : "border-border"
                  }`}
                >
                  <img src={img || "/placeholder.svg"} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold text-foreground">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-accent">${product.price}</div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Colors */}
            <div>
              <h3 className="font-semibold mb-3">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      selectedColor === color ? "border-accent bg-accent/10" : "border-border hover:border-accent"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 rounded-lg border-2 transition font-medium ${
                      selectedSize === size
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border hover:border-accent"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 border border-border rounded-lg hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 border border-border rounded-lg hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3 pt-4">
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-orange-600">
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="w-full bg-transparent">
                <Heart className="w-4 h-4 mr-2" />
                Save for Later
              </Button>
            </div>

            {/* Share */}
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition">
              <Share2 className="w-4 h-4" />
              Share
            </button>

            {/* Features */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="font-semibold">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCw className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="font-semibold">Easy Returns</p>
                  <p className="text-sm text-muted-foreground">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="font-semibold">Secure Checkout</p>
                  <p className="text-sm text-muted-foreground">SSL encrypted</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">Product Details</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {product.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">Customer Review</p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`w-4 h-4 ${j < (4 + i) ? "fill-accent text-accent" : "text-border"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Great quality and fast shipping! Would definitely recommend.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
