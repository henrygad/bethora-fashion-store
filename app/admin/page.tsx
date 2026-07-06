"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SalesChart from "@/components/admin/SalesChart";
import { getAllOrders, getAllProducts } from "@/lib/firebase/firestore";
import type { Order, Product } from "@/types";
import { DollarSign, ShoppingBag, TrendingUp, AlertCircle, ChevronRight, TrendingDown } from "lucide-react";

const SALES_DATA = [
    { day: "Mon", value: 145000 },
    { day: "Tue", value: 98000 },
    { day: "Wed", value: 187000 },
    { day: "Thu", value: 132000 },
    { day: "Fri", value: 221000 },
    { day: "Sat", value: 268000 },
    { day: "Sun", value: 159000 },
];

function statusStyle(status: string) {
    if (status === "Delivered") return "bg-green-50 text-green-700";
    if (status === "Shipped") return "bg-blue-50 text-blue-700";
    return "bg-primary-50 text-primary-700";
}

export default function AdminOverviewPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getAllOrders(), getAllProducts()])
            .then(([o, p]) => { setOrders(o); setProducts(p); })
            .finally(() => setLoading(false));
    }, []);

    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const avgOrder = orders.length ? Math.round(totalRevenue / orders.length) : 0;
    const lowStock = products.filter((p) => p.stock <= 5).length;

    const stats = [
        { icon: DollarSign, label: "Total Revenue", value: `₦${totalRevenue.toLocaleString()}`, trend: "+12%", up: true },
        { icon: ShoppingBag, label: "Total Orders", value: orders.length, trend: "+8%", up: true },
        { icon: TrendingUp, label: "Avg Order Value", value: `₦${avgOrder.toLocaleString()}`, trend: "-3%", up: false },
        { icon: AlertCircle, label: "Stock Alerts", value: lowStock, trend: null, up: false },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
                <AdminSidebar />
                <main className="flex-1 min-w-0 space-y-5 fade-in">
                    <div>
                        <h2 className="text-lg font-bold">Sales Overview</h2>
                        <p className="text-sm text-gray-500">Last 7 days performance</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {stats.map(({ icon: Icon, label, value, trend, up }) => (
                            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Icon size={18} className="text-primary-500" />
                                    {trend && (
                                        <span className={`flex items-center gap-0.5 text-[11px] font-semibold ${up ? "text-green-600" : "text-red-500"}`}>
                                            {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {trend}
                                        </span>
                                    )}
                                </div>
                                <p className="text-lg font-bold">{loading ? "—" : value}</p>
                                <p className="text-xs text-gray-500">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Chart */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h3 className="font-bold text-sm mb-5">Revenue This Week</h3>
                        <SalesChart data={SALES_DATA} />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-5">
                        {/* Recent Orders */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-sm">Recent Orders</h3>
                                <Link href="/admin/orders" className="text-xs text-primary-600 font-medium flex items-center gap-0.5 hover:underline">
                                    View all <ChevronRight size={13} />
                                </Link>
                            </div>
                            {loading ? (
                                <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />)}</div>
                            ) : orders.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">No orders yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {orders.slice(0, 5).map((o) => (
                                        <div key={o.id} className="flex items-center justify-between">
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">{o.address.name}</p>
                                                <p className="text-xs text-gray-500">{o.id}</p>
                                            </div>
                                            <div className="text-right shrink-0 ml-3">
                                                <p className="text-sm font-semibold">₦{o.total.toLocaleString()}</p>
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle(o.status)}`}>{o.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Stock Alerts */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-sm">Stock Alerts</h3>
                                <Link href="/admin/products" className="text-xs text-primary-600 font-medium flex items-center gap-0.5 hover:underline">
                                    Manage <ChevronRight size={13} />
                                </Link>
                            </div>
                            {loading ? (
                                <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}</div>
                            ) : products.filter((p) => p.stock <= 5).length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">All products well stocked.</p>
                            ) : (
                                <div className="space-y-3">
                                    {products.filter((p) => p.stock <= 5).slice(0, 5).map((p) => (
                                        <div key={p.id} className="flex items-center gap-3">
                                            <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{p.name}</p>
                                                <p className="text-xs text-gray-500">{p.category}</p>
                                            </div>
                                            <span className={`text-[11px] font-semibold px-2 py-1 rounded-full shrink-0 ${p.stock === 0 ? "bg-red-50 text-red-600" : "bg-primary-50 text-primary-700"}`}>
                                                {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}