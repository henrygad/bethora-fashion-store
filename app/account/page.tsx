"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import AccountSidebar from "@/components/shared/AccountSidebar";
import Avatar from "@/components/shared/Avatar";
import { useAuth } from "@/context/AuthContext";
import { getOrdersByUser } from "@/lib/firebase/firestore";
import type { Order } from "@/types";
import { ShoppingBag, Heart, MapPin, ChevronRight, Eye } from "lucide-react";

function statusStyle(status: string) {
    if (status === "Delivered") return "bg-green-50 text-green-700";
    if (status === "Availability Confirmed") return "bg-emerald-50 text-emerald-700";
    if (status === "Shipped") return "bg-blue-50 text-blue-700";
    if (status === "Unavailable" || status === "Cancelled") return "bg-red-50 text-red-700";
    return "bg-primary-50 text-primary-700";
}

export default function AccountOverviewPage() {
    const { user, profile } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);

    const memberSince = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString("en-NG", { month: "long", year: "numeric" })
        : "";

    useEffect(() => {
        if (user) getOrdersByUser(user.uid).then(setOrders);
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
                <AccountSidebar />
                <main className="flex-1 min-w-0 space-y-5 fade-in">
                    {/* Profile header */}
                    <div className="bg-gradient-to-br from-primary-400 to-primary-300 rounded-2xl p-5 flex items-center gap-4">
                        <Link href="/account/profile" title="View profile">
                            <Avatar src={profile?.photoURL} alt={profile?.name} className="w-14 h-14" iconSize={28} />
                        </Link>
                        <div>
                            <p className="font-bold text-lg text-gray-900">{profile?.name}</p>
                            <p className="text-sm text-gray-800">{profile?.email}</p>
                            <p className="text-xs text-gray-700 mt-0.5">
                                {memberSince && `Member since ${memberSince}`}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { icon: ShoppingBag, label: "Orders", value: orders.length },
                            { icon: Heart, label: "Wishlist", value: 0 },
                            { icon: MapPin, label: "Addresses", value: 0 },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                                <Icon size={20} className="text-primary-500 mx-auto mb-1" />
                                <p className="text-xl font-bold">{value}</p>
                                <p className="text-xs text-gray-500">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Recent orders */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-sm">Recent Orders</h3>
                            <Link href="/account/orders" className="text-xs text-primary-600 font-medium flex items-center gap-0.5 hover:underline">
                                View all <ChevronRight size={13} />
                            </Link>
                        </div>
                        {orders.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-6">No orders yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {orders.slice(0, 3).map((order) => (
                                    <div key={order.id} className="flex items-center gap-3">
                                        <img src={order.items[0].image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {order.items[0].name}{order.items.length > 1 ? ` +${order.items.length - 1} more` : ""}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString("en-NG")} · ₦{order.total.toLocaleString()}
                                            </p>
                                        </div>
                                        <span className={`text-[11px] font-semibold px-2 py-1 rounded-full shrink-0 ${statusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Account details */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h3 className="font-bold text-sm mb-3">Account Details</h3>
                        <div className="space-y-2 text-sm">
                            {[
                                { label: "Full Name", value: profile?.name },
                                { label: "Email", value: profile?.email },
                                { label: "Phone", value: profile?.phone },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between">
                                    <span className="text-gray-500">{label}</span>
                                    <span className="font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                        <Link href="/account/profile" className="mt-4 text-sm font-medium text-primary-600 hover:underline flex items-center gap-1 w-fit">
                            <Eye size={13} /> View Profile
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
}
