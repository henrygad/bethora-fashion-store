"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Avatar from "@/components/shared/Avatar";
import { getAllUsers } from "@/lib/firebase/firestore";
import type { UserProfile } from "@/types";
import { Search } from "lucide-react";

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getAllUsers().then((users) => {
            setCustomers(users.filter((u) => u.role === "customer"));
        }).finally(() => setLoading(false));
    }, []);

    const filtered = customers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
                <AdminSidebar />
                <main className="flex-1 min-w-0 fade-in">
                    <h2 className="text-lg font-bold mb-4">Customers</h2>

                    <div className="relative mb-4">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full bg-white border border-gray-200 rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                        />
                    </div>

                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-12">No customers found.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map((c) => (
                                <div key={c.uid} className="bg-white rounded-2xl border border-gray-100 p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Avatar src={c.photoURL} alt={c.name} className="w-11 h-11" iconSize={22} />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold truncate">{c.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{c.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                                        <span>{c.phone}</span>
                                        <span className="text-[11px] text-gray-400">
                                            Joined {new Date(c.createdAt).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}