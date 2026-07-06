"use client";

import { useEffect, useState } from "react";
import { getActiveProducts } from "@/lib/firebase/firestore";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getActiveProducts()
            .then((data) => setProducts(data.slice(0, 8)))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="border border-gray-100 rounded-2xl p-3 animate-pulse">
                        <div className="bg-gray-100 rounded-xl h-36 mb-3" />
                        <div className="bg-gray-100 h-3 rounded mb-2" />
                        <div className="bg-gray-100 h-3 rounded w-2/3" />
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400 text-sm">
                No products yet. Add some from the admin dashboard.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    );
}