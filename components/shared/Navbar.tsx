"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Menu, X, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { logOut } from "@/lib/firebase/auth";
import Avatar from "@/components/shared/Avatar";

export default function Navbar() {
    const { count } = useCart();
    const { user, profile } = useAuth();
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/products?search=${encodeURIComponent(search.trim())}`);
            setSearch("");
            setMobileOpen(false);
        }
    }

    async function handleLogout() {
        await logOut();
        router.push("/");
    }

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
                {/* Logo */}
                <Link href="/" className="shrink-0">
                    <Image
                        src="/android-chrome-192x192.png"
                        alt="Bethora"
                        height={36}
                        width={0}
                        className="w-auto h-9"
                        priority
                    />
                </Link>

                {/* Search — desktop */}
                <form onSubmit={handleSearch} className="hidden sm:flex flex-1 relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                    />
                </form>

                {/* Right icons */}
                <div className="flex items-center gap-1 ml-auto sm:ml-0">
                    {/* Support */}
                    <Link href="/support" title="Support" className="p-2 rounded-full hover:bg-gray-100 transition active:scale-90">
                        <Phone size={22} />
                    </Link>

                    {/* Cart */}
                    <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition active:scale-90">
                        <ShoppingCart size={22} />
                        {count > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {count}
                            </span>
                        )}
                    </Link>

                    {/* Account */}
                    {user ? (
                        <div className="relative group">
                            <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition">
                                <Avatar src={profile?.photoURL} className="w-6 h-6" iconSize={14} />
                                <span className="hidden sm:inline text-sm font-medium">
                                    {profile?.name?.split(" ")[0] || "Account"}
                                </span>
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 hidden group-hover:block z-50">
                                <Link href="/account" className="block px-4 py-2 text-sm hover:bg-gray-50 transition">
                                    My Account
                                </Link>
                                <Link href="/account/orders" className="block px-4 py-2 text-sm hover:bg-gray-50 transition">
                                    My Orders
                                </Link>
                                {profile?.role === "admin" && (
                                    <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-gray-50 transition">
                                        Admin Dashboard
                                    </Link>
                                )}
                                <div className="border-t border-gray-100 my-1" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="hidden sm:inline-flex items-center gap-1.5 bg-primary-400 text-gray-900 font-semibold text-sm px-4 py-2 rounded-full hover:bg-primary-500 transition"
                        >
                            Sign In
                        </Link>
                    )}

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileOpen((v) => !v)}
                        className="sm:hidden p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile search + nav */}
            {mobileOpen && (
                <div className="sm:hidden border-t border-gray-100 px-4 py-3 space-y-3 bg-white">
                    <form onSubmit={handleSearch} className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </form>
                    <nav className="flex flex-col gap-1">
                        {user ? (
                            <>
                                <Link href="/account" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>My Account</Link>
                                <Link href="/account/orders" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>My Orders</Link>
                                {profile?.role === "admin" && (
                                    <Link href="/admin" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>
                                )}
                                <Link href="/support" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Help &amp; Support</Link>
                                <button onClick={handleLogout} className="py-2 text-sm font-medium text-red-500 text-left">Sign Out</button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="py-2 text-sm font-semibold text-primary-600" onClick={() => setMobileOpen(false)}>
                                    Sign In / Create Account
                                </Link>
                                <Link href="/support" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Help &amp; Support</Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}