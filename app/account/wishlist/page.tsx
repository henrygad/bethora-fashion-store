"use client";

import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import AccountSidebar from "@/components/shared/AccountSidebar";
import { Heart, Plus, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface WishlistItem {
    id: string;
    name: string;
    image: string;
    price: number;
    rating: number;
}

// In production this would be fetched from Firestore wishlist collection
export default function WishlistPage() {
    const { addItem } = useCart();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
                <AccountSidebar />
                <main className="flex-1 min-w-0 fade-in">
                    <h2 className="text-lg font-bold mb-4">My Wishlist</h2>
                    {wishlist.length === 0 ? (
                        <div className="text-center py-20">
                            <Heart size={40} className="text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">Your wishlist is empty</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {wishlist.map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group">
                                    <div className="relative h-36 overflow-hidden">
                                        <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />
                                        <button
                                            onClick={() => setWishlist((prev) => prev.filter((w) => w.id !== item.id))}
                                            className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 active:scale-90 transition"
                                        >
                                            <Heart size={14} className="fill-red-500 text-red-500" />
                                        </button>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs font-semibold line-clamp-2 mb-1">{item.name}</p>
                                        <div className="flex items-center gap-0.5 mb-1.5">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star key={i} size={11} className={i <= Math.round(item.rating) ? "text-primary-500 fill-primary-500" : "text-gray-300 fill-gray-300"} />
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold">₦{item.price.toLocaleString()}</span>
                                            <button
                                                onClick={() => addItem({ productId: item.id, name: item.name, price: item.price, image: item.image, qty: 1 })}
                                                className="bg-primary-400 hover:bg-primary-500 rounded-full p-1.5 transition active:scale-90"
                                            >
                                                <Plus size={13} />
                                            </button>
                                        </div>
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