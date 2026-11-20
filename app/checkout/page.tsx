"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, MessageCircle, Plus } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getAddressesByUser } from "@/lib/firebase/firestore";
import { NIGERIAN_STATES } from "@/types";
import type { Address } from "@/types";
import { formatDeliveryAddress, isNigerianPhone } from "@/lib/address";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, delivery, total, clearCart, ready: cartReady } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [requestId] = useState(() => crypto.randomUUID());
  type FormState = { label: string; name: string; phone: string; address: string; city: string; lga: string; state: string };
  const [form, setForm] = useState<FormState>({ label: "Home", name: "", phone: "", address: "", city: "", lga: "", state: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    getAddressesByUser(user.uid).then((addrs) => {
      setAddresses(addrs);
      const def = addrs.find((a) => a.isDefault) || addrs[0];
      if (def) setSelectedAddrId(def.id);
      else setAddingNew(true);
    });
  }, [user, authLoading, router]);

  useEffect(() => {
    if (cartReady && items.length === 0) router.push("/cart");
  }, [items, cartReady, router]);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Enter the recipient's full name.";
    if (!isNigerianPhone(form.phone)) errs.phone = "Enter a valid Nigerian phone number.";
    if (!form.state) errs.state = "Select a state.";
    if (!form.lga.trim()) errs.lga = "Enter the local government area.";
    if (!form.city.trim()) errs.city = "Enter the city or town.";
    if (!form.address.trim()) errs.address = "Enter the street address.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function placeOrder() {
    if (!user) return;
    setSubmitError("");
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
      const idToken = await user.getIdToken();
      const response = await fetch("/api/availability-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({
          requestId,
          items: items.map(({ productId, qty, size, color }) => ({ productId, qty, size, color })),
          address: deliveryAddress,
        }),
      });
      const responseBody = await response.text();
      let result: { whatsappUrl?: string; error?: string } = {};
      if (responseBody) {
        try {
          result = JSON.parse(responseBody) as { whatsappUrl?: string; error?: string };
        } catch {
          throw new Error(`The server returned an invalid response (HTTP ${response.status}). Please try again.`);
        }
      }
      if (!response.ok || !result.whatsappUrl) {
        throw new Error(result.error || `Could not create your availability request (HTTP ${response.status})`);
      }
      clearCart();
      window.location.assign(result.whatsappUrl);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We could not create your request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const field = (key: keyof FormState, label: string, placeholder: string, type = "text", autoComplete?: string) => (
    <div>
      <label htmlFor={"delivery-" + key} className="mb-1.5 block text-xs font-semibold text-gray-700">{label} <span className="text-red-500">*</span></label>
      <input
        id={"delivery-" + key}
        type={type}
        autoComplete={autoComplete}
        value={form[key]}
        onChange={(e) => { setForm({ ...form, [key]: e.target.value } as FormState); setErrors((current) => ({ ...current, [key]: "" })); }}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition ${errors[key] ? "border-red-400" : "border-gray-200"}`}
        aria-invalid={Boolean(errors[key])}
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
                  <p className="text-gray-500 text-xs">{formatDeliveryAddress(addr)}</p>
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
          <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700"><MapPin size={18} /></span>
              <div>
                <p className="text-sm font-bold text-gray-900">Delivery Details</p>
                <p className="mt-0.5 text-xs text-gray-500">Enter the exact Nigerian address where the order should be delivered.</p>
              </div>
            </div>
            <div className="space-y-4">
              {field("name", "Recipient's full name", "e.g. Ada Okafor", "text", "name")}
              {field("phone", "Phone number", "e.g. 0801 234 5678", "tel", "tel")}
              <div>
                <label htmlFor="delivery-state" className="mb-1.5 block text-xs font-semibold text-gray-700">State <span className="text-red-500">*</span></label>
                <select
                  id="delivery-state"
                  value={form.state}
                  onChange={(e) => { setForm({ ...form, state: e.target.value }); setErrors((current) => ({ ...current, state: "" })); }}
                  autoComplete="address-level1"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-400 bg-white transition ${errors.state ? "border-red-400" : "border-gray-200"}`}
                  aria-invalid={Boolean(errors.state)}
                >
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("lga", "Local government area", "e.g. Ikeja")}
                {field("city", "City or town", "e.g. Ikeja", "text", "address-level2")}
              </div>
              {field("address", "House number and street address", "e.g. 12 Allen Avenue", "text", "street-address")}
            </div>
          </div>
        )}

        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-4">
          <MessageCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-900">Confirm availability on WhatsApp</p>
            <p className="text-xs text-green-800 mt-1 leading-relaxed">
              We source products after you order. You will not be asked to pay until our team confirms that every item is available.
            </p>
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
            <span>Estimated Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>

        {submitError && <p className="text-sm text-red-600 mb-4 text-center">{submitError}</p>}

        <button
          onClick={placeOrder}
          disabled={loading}
          className="w-full bg-primary-400 text-gray-900 font-bold py-3 rounded-full hover:bg-primary-500 transition active:scale-95 disabled:opacity-60"
        >
          {loading ? "Preparing WhatsApp Request..." : "Confirm Availability on WhatsApp"}
        </button>
      </div>
    </div>
  );
}
