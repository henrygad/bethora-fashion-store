"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import OrderStatusModal from "@/components/admin/OrderStatusModal";
import { getAllOrders, updateOrderStatus } from "@/lib/firebase/firestore";
import type { Order } from "@/types";
import { Search, ChevronRight, CheckCircle2, Truck, Clock, X } from "lucide-react";

function statusStyle(status: string) {
    if (status === "Delivered") return { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle2 };
    if (status === "Availability Confirmed") return { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle2 };
    if (status === "Shipped") return { bg: "bg-blue-50", text: "text-blue-700", icon: Truck };
    if (status === "Cancelled" || status === "Unavailable") return { bg: "bg-red-50", text: "text-red-700", icon: X };
    return { bg: "bg-primary-50", text: "text-primary-700", icon: Clock };
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [viewing, setViewing] = useState<Order | null>(null);
    const [toast, setToast] = useState("");

    useEffect(() => {
        getAllOrders().then(setOrders).finally(() => setLoading(false));
    }, []);

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(""), 1800);
    }

    async function handleStatusUpdate(id: string, status: Order["status"]) {
        await updateOrderStatus(id, status);
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
        setViewing((v) => v ? { ...v, status } : null);
        showToast(`Order marked as ${status}`);
    }

    const filtered = orders.filter((o) =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.address.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
                <AdminSidebar />
                <main className="flex-1 min-w-0 fade-in">
                    <h2 className="text-lg font-bold mb-4">Orders</h2>

                    <div className="relative mb-4">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by order ID or customer name..."
                            className="w-full bg-white border border-gray-200 rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                        />
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="hidden sm:grid grid-cols-[140px_1fr_120px_120px_40px] gap-4 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                            <span>Order ID</span>
                            <span>Customer</span>
                            <span>Total</span>
                            <span>Status</span>
                            <span></span>
                        </div>

                        {loading ? (
                            <div className="p-4 space-y-3">
                                {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                            </div>
                        ) : filtered.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm py-12">No orders found.</p>
                        ) : (
                            filtered.map((o) => {
                                const s = statusStyle(o.status);
                                const StatusIcon = s.icon;
                                return (
                                    <button
                                        key={o.id}
                                        onClick={() => setViewing(o)}
                                        className="w-full flex sm:grid sm:grid-cols-[140px_1fr_120px_120px_40px] items-center gap-3 sm:gap-4 px-4 py-3 border-t border-gray-100 text-left hover:bg-gray-50 transition"
                                    >
                                        <span className="text-sm font-semibold shrink-0 truncate">{o.id}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm truncate">{o.address.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                                            </p>
                                        </div>
                                        <span className="hidden sm:block text-sm font-semibold">₦{o.total.toLocaleString()}</span>
                                        <span className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full w-fit ${s.bg} ${s.text}`}>
                                            <StatusIcon size={11} /> {o.status}
                                        </span>
                                        <div className="hidden sm:block text-gray-400"><ChevronRight size={16} /></div>
                                        <div className="sm:hidden text-right shrink-0">
                                            <p className="text-sm font-semibold">₦{o.total.toLocaleString()}</p>
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>{o.status}</span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </main>
            </div>

            <OrderStatusModal
                order={viewing}
                onClose={() => setViewing(null)}
                onStatusUpdate={handleStatusUpdate}
            />

            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full shadow-lg slide-up z-50 whitespace-nowrap">
                    {toast}
                </div>
            )}
        </div>
    );
}
