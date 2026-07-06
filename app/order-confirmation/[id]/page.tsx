"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Truck, XCircle } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import { getOrderById } from "@/lib/firebase/firestore";
import type { Order } from "@/types";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id as string)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Loading...</div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
          <XCircle size={42} className="text-red-600" />
        </div>
        <h1 className="text-xl font-bold mb-1">Order Not Found</h1>
        <p className="text-gray-500 text-sm mb-6">We couldn&apos;t find an order with this ID. It may have been removed or the link is incorrect.</p>
        <button
          onClick={() => router.push("/account/orders")}
          className="w-full bg-primary-400 text-gray-900 font-bold py-3 rounded-full hover:bg-primary-500 transition active:scale-95"
        >
          View My Orders
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
          <CheckCircle2 size={42} className="text-green-600" />
        </div>
        <h1 className="text-xl font-bold mb-1">Order Placed!</h1>
        <p className="text-gray-500 text-sm mb-6">Order #{order.id}</p>

        {/* Items */}
        <div className="border border-gray-100 rounded-2xl p-4 text-left mb-4 bg-white">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-1.5">
              <span className="text-gray-600">{item.name} × {item.qty}</span>
              <span className="font-medium">₦{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between text-base font-bold pt-3 mt-1 border-t border-gray-100">
            <span>Total</span>
            <span>₦{order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Delivery address */}
        <div className="border border-gray-100 rounded-2xl p-4 text-left mb-4 bg-white">
          <p className="text-sm font-semibold mb-1">Delivering To</p>
          <p className="text-sm text-gray-600">{order.address.name} · {order.address.phone}</p>
          <p className="text-sm text-gray-600">{order.address.address}, {order.address.state}</p>
        </div>

        {/* ETA */}
        <div className="flex items-center gap-3 bg-primary-50 rounded-2xl p-4 mb-8 text-left">
          <Truck size={22} className="text-primary-600 shrink-0" />
          <p className="text-sm text-gray-700">
            Estimated delivery in <span className="font-semibold">3–5 business days</span>. We&apos;ll notify you when your order ships.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/account/orders")}
            className="w-full bg-gray-900 text-white font-bold py-3 rounded-full hover:bg-gray-800 transition"
          >
            Track Order
          </button>
          <button
            onClick={() => router.push("/products")}
            className="w-full bg-primary-400 text-gray-900 font-bold py-3 rounded-full hover:bg-primary-500 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}