"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Plus, Star } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    if (product.sizes.length > 0 || product.colors.length > 0) return;
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      qty: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  return (
    <Link href={`/products/${product.id}`} className="group block border border-gray-100 rounded-2xl p-3 hover:shadow-md hover:-translate-y-0.5 transition relative bg-white">
      {discount && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
          -{discount}%
        </span>
      )}

      <button
        onClick={(e) => { e.preventDefault(); setWishlisted((v) => !v); }}
        className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 z-10 transition active:scale-90"
      >
        <Heart size={14} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
      </button>

      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl h-36 overflow-hidden mb-3 group-hover:scale-[1.02] transition">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <p className="text-sm font-semibold leading-tight mb-1 line-clamp-2">{product.name}</p>

      {product.rating && (
        <div className="flex items-center gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={11} className={i <= Math.round(product.rating!) ? "text-primary-500 fill-primary-500" : "text-gray-300 fill-gray-300"} />
          ))}
          {product.reviewCount && <span className="text-[10px] text-gray-400">({product.reviewCount})</span>}
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <div>
          <p className="text-sm font-bold">₦{product.price.toLocaleString()}</p>
          {product.oldPrice && (
            <p className="text-[11px] text-gray-400 line-through">₦{product.oldPrice.toLocaleString()}</p>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className={`rounded-full p-1.5 transition active:scale-90 ${added ? "bg-green-500 text-white" : "bg-primary-400 hover:bg-primary-500 text-gray-900"}`}
        >
          <Plus size={14} aria-label={product.sizes.length > 0 || product.colors.length > 0 ? "Choose options" : "Add to cart"} />
        </button>
      </div>
    </Link>
  );
}
