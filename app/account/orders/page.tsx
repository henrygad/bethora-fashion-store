"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import AccountSidebar from "@/components/shared/AccountSidebar";
import { useAuth } from "@/context/AuthContext";
import { getOrdersByUser } from "@/lib/firebase/firestore";
import type { Order } from "@/types";
import { formatDeliveryAddress } from "@/lib/address";
import { ChevronRight, CheckCircle2, Truck, Clock, X, PackageCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

const TRACKING_STEPS = ["Availability Requested", "Availability Confirmed", "Processing", "Shipped", "Delivered"];

function stepIndex(status: string) {
    if (status === "Availability Confirmed") return 1;
    if (status === "Processing") return 2;
    if (status === "Shipped") return 3;
    if (status === "Delivered") return 4;
    return 0;
}

function statusStyle(status: string) {
    if (status === "Delivered") return { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle2 };
    if (status === "Availability Confirmed") return { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle2 };
    if (status === "Shipped") return { bg: "bg-blue-50", text: "text-blue-700", icon: Truck };
    if (status === "Cancelled" || status === "Unavailable") return { bg: "bg-red-50", text: "text-red-700", icon: X };
    return { bg: "bg-primary-50", text: "text-primary-700", icon: Clock };
}

export default function OrdersPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { addItem, clearCart } = useCart();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [tracking, setTracking] = useState<Order | null>(null);

    useEffect(() => {
        if (user) getOrdersByUser(user.uid).then(setOrders).finally(() => setLoading(false));
    }, [user]);

    function handleReorder(order: Order) {
        clearCart();
        order.items.forEach((item) => addItem({ ...item }));
        router.push("/checkout");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
                <AccountSidebar />
                <main className="flex-1 min-w-0 fade-in">
                    <h2 className="text-lg font-bold mb-4">My Orders</h2>

                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse h-20" />
                            ))}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 text-sm">No orders yet.</div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map((order) => {
                                const s = statusStyle(order.status);
                                const StatusIcon = s.icon;
                                const isOpen = expanded === order.id;
                                return (
                                    <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                        {/* Order row */}
                                        <button
                                            onClick={() => setExpanded(isOpen ? null : order.id)}
                                            className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition"
                                        >
                                            <img src={order.items[0].image} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold">{order.id}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })} · {order.items.length} item{order.items.length > 1 ? "s" : ""}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-bold">₦{order.total.toLocaleString()}</p>
                                                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 ${s.bg} ${s.text}`}>
                                                    <StatusIcon size={11} /> {order.status}
                                                </span>
                                            </div>
                                            <ChevronRight size={18} className={`text-gray-400 transition-transform shrink-0 ${isOpen ? "rotate-90" : ""}`} />
                                        </button>

                                        {/* Expanded detail */}
                                        {isOpen && (
                                            <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
                                                {/* Items */}
                                                {order.items.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium truncate">{item.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                Qty {item.qty}
                                                                {item.size ? ` · Size: ${item.size}` : ""}
                                                                {item.color ? ` · ${item.color}` : ""}
                                                            </p>
                                                        </div>
                                                        <span className="text-xs font-semibold shrink-0">
                                                            ₦{(item.price * item.qty).toLocaleString()}
                                                        </span>
                                                    </div>
                                                ))}

                                                {/* Delivery address */}
                                                <div className="bg-white rounded-xl p-3 border border-gray-100">
                                                    <p className="text-xs font-semibold text-gray-500 mb-1">Delivery Address</p>
                                                    <p className="text-xs font-medium">{order.address.name} · {order.address.phone}</p>
                                                    <p className="text-xs text-gray-500">{formatDeliveryAddress(order.address)}</p>
                                                </div>

                                                {/* Order total */}
                                                <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-2">
                                                    <span>Estimated Total</span>
                                                    <span>₦{order.total.toLocaleString()}</span>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2 pt-1">
                                                    <button
                                                        onClick={() => setTracking(order)}
                                                        className="flex-1 bg-gray-900 text-white text-xs font-semibold py-2.5 rounded-full hover:bg-gray-800 transition active:scale-95"
                                                    >
                                                        Track Order
                                                    </button>
                                                    <button
                                                        onClick={() => handleReorder(order)}
                                                        className="flex-1 bg-primary-400 text-gray-900 text-xs font-semibold py-2.5 rounded-full hover:bg-primary-500 transition active:scale-95"
                                                    >
                                                        Reorder
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>

            {/* ── Track Order Modal ── */}
            {tracking && (
                <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-5 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-base">Track Order</h3>
                            <button onClick={() => setTracking(null)} className="p-1 text-gray-400 hover:text-gray-700 transition">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-5">
                            {tracking.id} · {new Date(tracking.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </p>

                        {/* Timeline */}
                        <div className="mb-5">
                            {TRACKING_STEPS.map((step, i) => {
                                const current = stepIndex(tracking.status);
                                const done = i <= current;
                                const isActive = i === current;
                                const isLast = i === TRACKING_STEPS.length - 1;
                                return (
                                    <div key={step} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition ${done
                                                    ? isActive
                                                        ? "bg-primary-400 text-gray-900 ring-4 ring-primary-100"
                                                        : "bg-primary-400 text-gray-900"
                                                    : "bg-gray-100 text-gray-400"
                                                }`}>
                                                {done ? <CheckCircle2 size={15} /> : <Clock size={13} />}
                                            </div>
                                            {!isLast && (
                                                <div className={`w-0.5 flex-1 min-h-[28px] transition-colors ${i < current ? "bg-primary-400" : "bg-gray-200"}`} />
                                            )}
                                        </div>
                                        <div className="pb-5">
                                            <p className={`text-sm font-semibold ${done ? "text-gray-900" : "text-gray-400"}`}>{step}</p>
                                            {done && (
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {i === 0
                                                        ? new Date(tracking.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
                                                        : isActive
                                                            ? "In progress"
                                                            : "Completed"}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Status message */}
                        <div className="bg-primary-50 rounded-2xl p-4 flex items-start gap-3 mb-4">
                            <PackageCheck size={18} className="text-primary-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-700">
                                {tracking.status === "Delivered"
                                    ? "Your order has been delivered. Thank you for shopping with Bethora!"
                                    : tracking.status === "Shipped"
                                        ? "Your order is on its way. Estimated arrival in 1–2 business days."
                                        : tracking.status === "Pending Availability"
                                            ? "We are checking these products with our suppliers. Do not make payment until availability is confirmed."
                                            : tracking.status === "Availability Confirmed"
                                                ? "The products are available. Our team will share the next steps with you."
                                                : tracking.status === "Unavailable"
                                                    ? "One or more products are unavailable. Please contact us to choose alternatives."
                                                    : tracking.status === "Cancelled"
                                                        ? "This request has been cancelled."
                                                        : "Your order is being prepared and will ship soon. We'll notify you once it's on the way."}
                            </p>
                        </div>

                        {/* Delivery address recap */}
                        <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Delivering To</p>
                            <p className="text-sm font-medium">{tracking.address.name} · {tracking.address.phone}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{formatDeliveryAddress(tracking.address)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
