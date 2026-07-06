"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Minus, Plus, X } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, changeQty, subtotal, delivery, total, count } = useCart();

  if (count === 0) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛍️</p>
        <p className="text-gray-400 text-sm mb-6">Your cart is empty</p>
        <button
          onClick={() => router.push("/products")}
          className="bg-primary-400 text-gray-900 font-semibold px-6 py-2.5 rounded-full hover:bg-primary-500 transition"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-5">
        <div className="flex items-center gap-2 mb-5">
          <button onClick={() => router.back()} className="p-1.5 rounded-full hover:bg-gray-100 transition">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Your Cart</h1>
        </div>

        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-3 border border-gray-100 rounded-2xl p-3 bg-white">
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{item.name}</p>
                {(item.size || item.color) && (
                  <p className="text-xs text-gray-400">{[item.size, item.color].filter(Boolean).join(" · ")}</p>
                )}
                <p className="text-sm text-gray-500">₦{item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                <button onClick={() => changeQty(item.productId, -1)} className="active:scale-90"><Minus size={13} /></button>
                <span className="w-5 text-center text-sm font-medium">{item.qty}</span>
                <button onClick={() => changeQty(item.productId, 1)} className="active:scale-90"><Plus size={13} /></button>
              </div>
              <button onClick={() => removeItem(item.productId)} className="text-gray-400 hover:text-red-500 transition active:scale-90">
                <X size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery</span><span>{delivery === 0 ? "Free 🎉" : `₦${delivery.toLocaleString()}`}</span>
          </div>
          {delivery > 0 && (
            <p className="text-xs text-gray-400">Add ₦{(20000 - subtotal).toLocaleString()} more for free delivery</p>
          )}
          <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
            <span>Total</span><span>₦{total.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/checkout")}
          className="w-full bg-primary-400 text-gray-900 font-bold py-3 rounded-full hover:bg-primary-500 transition active:scale-95"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}