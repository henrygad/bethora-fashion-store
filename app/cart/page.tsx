"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

const CART_ITEMS = [
  { id: "1", name: "Classic White T-Shirt", price: 49, quantity: 2, image: "/white-tshirt.png" },
  { id: "2", name: "Black Slim Jeans", price: 89, quantity: 1, image: "/black-jeans.jpg" },
]

export default function CartPage() {
  const subtotal = CART_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 10
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {CART_ITEMS.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 flex gap-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="text-accent font-semibold">${item.price}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 border border-border rounded hover:bg-gray-50">-</button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button className="px-2 py-1 border border-border rounded hover:bg-gray-50">+</button>
                  </div>
                  <button className="text-destructive hover:text-destructive/80">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {CART_ITEMS.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Link href="/products">
                  <Button>Continue Shopping</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span className="text-accent">${total.toFixed(2)}</span>
            </div>
            <Link href="/checkout">
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-orange-600">
                Proceed to Checkout
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="w-full mt-2 bg-transparent">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
