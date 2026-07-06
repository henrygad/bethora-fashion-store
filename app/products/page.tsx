"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import ProductCard from "@/components/storefront/ProductCard";
import { getActiveProducts, getProductsByCategory } from "@/lib/firebase/firestore";
import type { Product } from "@/types";
import { CATEGORIES } from "@/types";

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <Navbar />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const params = useSearchParams();
  const categoryParam = params.get("category") || "";
  const searchParam = params.get("search") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    Promise.resolve().then(() => {
      if (isCurrent) setLoading(true);
    });

    const fetchPromise = activeCategory
      ? getProductsByCategory(activeCategory)
      : getActiveProducts();

    fetchPromise
      .then((data) => {
        if (!isCurrent) return;
        const filtered = searchParam
          ? data.filter((p) => p.name.toLowerCase().includes(searchParam.toLowerCase()))
          : data;
        setProducts(filtered);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [activeCategory, searchParam]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-5">
        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
          <button
            onClick={() => setActiveCategory("")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 transition ${!activeCategory ? "bg-primary-400 text-gray-900" : "bg-gray-100 text-gray-600"
              }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.label}
              onClick={() => setActiveCategory(c.label)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 transition ${activeCategory === c.label ? "bg-primary-400 text-gray-900" : "bg-gray-100 text-gray-600"
                }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Heading */}
        <h2 className="text-lg font-bold mb-4">
          {searchParam ? `Results for "${searchParam}"` : activeCategory || "All Products"}
        </h2>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-3 animate-pulse">
                <div className="bg-gray-100 rounded-xl h-36 mb-3" />
                <div className="bg-gray-100 h-3 rounded mb-2" />
                <div className="bg-gray-100 h-3 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}