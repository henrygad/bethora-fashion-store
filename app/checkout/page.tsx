"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Banknote, CreditCard, Plus } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder, getProductById } from "@/lib/firebase/firestore";
import { getAddressesByUser } from "@/lib/firebase/firestore";
import { logActivity } from "@/lib/cookies";
import { NIGERIAN_STATES } from "@/types";
import type { Address } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, delivery, total, clearCart } = useCart();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [payment, setPayment] = useState<"pod" | "transfer">("pod");
  const [loading, setLoading] = useState(false);
  type FormState = { label: string; name: string; phone: string; address: string; state: string };
  const [form, setForm] = useState<FormState>({ label: "Home", name: "", phone: "", address: "", state: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    getAddressesByUser(user.uid).then((addrs) => {
      setAddresses(addrs);
      const def = addrs.find((a) => a.isDefault) || addrs[0];
      if (def) setSelectedAddrId(def.id);
      else setAddingNew(true);
    });
  }, [user]);

  useEffect(() => {
    if (items.length === 0) router.push("/cart");
  }, [items]);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!form.address.trim()) errs.address = "Required";
    if (!form.state) errs.state = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function placeOrder() {
    if (!user) return;
    let deliveryAddress: Address;

    if (addingNew) {
      if (!validate()) return;
      deliveryAddress = { id: "", userId: user.uid, ...form, isDefault: addresses.length === 0 };
    } else {
      const found = addresses.find((a) => a.id === selectedAddrId);
      if (!found) return;
      deliveryAddress = found;
    }

    setLoading(true);
    try {
      const products = await Promise.all(items.map((item) => getProductById(item.productId)));
      const unavailable = products.some((p, i) => !p || p.status !== "Active" || p.stock < items[i].qty);
      if (unavailable) {
        router.push(`/order-confirmation/failed?reason=${encodeURIComponent("One or more items in your cart are no longer available in the quantity you selected.")}`);
        return;
      }

      const orderId = await createOrder({
        userId: user.uid,
        items,
        subtotal,
        delivery,
        total,
        address: deliveryAddress,
        paymentMethod: payment,
        status: "Processing",
        createdAt: Date.now(),
      });
      logActivity("checkout", { orderId, total });
      clearCart();
      router.push(`/order-confirmation/${orderId}`);
    } catch (e) {
      console.error(e);
      router.push(`/order-confirmation/failed?reason=${encodeURIComponent("We couldn't reach our servers to place your order. Please check your connection and try again.")}`);
    } finally {
      setLoading(false);
    }
  }

  const field = (key: keyof FormState, placeholder: string, type = "text") => (
    <div>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value } as FormState)}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition ${errors[key] ? "border-red-400" : "border-gray-200"}`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
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
          <h1 className="text-lg font-bold">Checkout</h1>
        </div>

        {/* Saved addresses */}
        {addresses.length > 0 && (
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 mb-2">Delivery Address</p>
            <div className="space-y-2">
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => { setSelectedAddrId(addr.id); setAddingNew(false); }}
                  className={`w-full text-left border rounded-xl px-4 py-3 text-sm transition ${selectedAddrId === addr.id && !addingNew ? "border-primary-400 bg-primary-50" : "border-gray-200 bg-white"}`}
                >
                  <p className="font-semibold">{addr.label} {addr.isDefault && <span className="text-xs text-green-600">(Default)</span>}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{addr.name} · {addr.phone}</p>
                  <p className="text-gray-500 text-xs">{addr.address}, {addr.state}</p>
                </button>
              ))}
              <button
                onClick={() => { setAddingNew(true); setSelectedAddrId(null); }}
                className={`w-full text-left border rounded-xl px-4 py-3 text-sm flex items-center gap-2 transition ${addingNew ? "border-primary-400 bg-primary-50" : "border-gray-200 bg-white"}`}
              >
                <Plus size={15} className="text-gray-500" />
                <span className="text-gray-600 font-medium">Use a different address</span>
              </button>
            </div>
          </div>
        )}

        {/* New address form */}
        {addingNew && (
          <div className="mb-5 space-y-3">
            {addresses.length === 0 && <p className="text-sm font-semibold text-gray-700">Delivery Details</p>}
            {field("name", "Full Name")}
            {field("phone", "Phone Number", "tel")}
            {field("address", "Street Address")}
            <select
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 bg-white transition ${errors.state ? "border-red-400" : "border-gray-200"}`}
            >
              <option value="">Select State</option>
              {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
          </div>
        )}

        {/* Payment method */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gray-700 mb-2">Payment Method</p>
          <div className="space-y-2">
            <button
              onClick={() => setPayment("pod")}
              className={`w-full flex items-center gap-3 border rounded-xl px-4 py-3 text-sm transition ${payment === "pod" ? "border-primary-400 bg-primary-50" : "border-gray-200 bg-white"}`}
            >
              <Banknote size={18} className="text-gray-600" />
              <span className="font-medium">Pay on Delivery</span>
            </button>
            <button
              onClick={() => setPayment("transfer")}
              className={`w-full flex items-center gap-3 border rounded-xl px-4 py-3 text-sm transition ${payment === "transfer" ? "border-primary-400 bg-primary-50" : "border-gray-200 bg-white"}`}
            >
              <CreditCard size={18} className="text-gray-600" />
              <span className="font-medium">Bank Transfer</span>
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm text-gray-600">
              <span className="truncate mr-4">{item.name} × {item.qty}</span>
              <span className="shrink-0">₦{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm text-gray-600 pt-1">
            <span>Delivery</span>
            <span>{delivery === 0 ? "Free" : `₦${delivery.toLocaleString()}`}</span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={placeOrder}
          disabled={loading}
          className="w-full bg-primary-400 text-gray-900 font-bold py-3 rounded-full hover:bg-primary-500 transition active:scale-95 disabled:opacity-60"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}