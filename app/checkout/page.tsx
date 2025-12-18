"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/context/cart-context"

export default function CheckoutPage() {
  const { carts } = useCart();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  })

  const subtotal = carts.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 10
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const total = subtotal + shipping + tax


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">First Name</label>
                    <Input
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Last Name</label>
                    <Input name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Address</label>
                  <Input
                    name="address"
                    placeholder="123 Main St"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">City</label>
                    <Input name="city" placeholder="New York" value={formData.city} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">State</label>
                    <Input name="state" placeholder="NY" value={formData.state} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Zip Code</label>
                    <Input name="zip" placeholder="10001" value={formData.zip} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Country</label>
                    <Input
                      name="country"
                      placeholder="United States"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Payment Method</h2>
              <Tabs defaultValue="card" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="card">Credit Card</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Card Number</label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">CVC</label>
                      <Input placeholder="123" />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="paypal" className="mt-4">
                  <p className="text-muted-foreground">You will be redirected to PayPal to complete your purchase.</p>
                </TabsContent>
              </Tabs>
            </div>

            <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-orange-600">
              Complete Order
            </Button>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 pb-4 border-b max-h-64 overflow-y-auto">
              {(carts || []).map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.primaryImage || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="text-accent font-semibold">${item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-accent">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
