"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Heart, Minus, Plus, Star } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import { getProductById } from "@/lib/firebase/firestore";
import { trackProductView } from "@/lib/cookies";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectionError, setSelectionError] = useState("");

  useEffect(() => {
    getProductById(id as string).then((p) => {
      setProduct(p);
      if (p) trackProductView(p.id);
    }).finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    if (product.sizes.length > 0 && !selectedSize) {
      setSelectionError("Please choose a size.");
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      setSelectionError("Please choose a colour.");
      return;
    }
    setSelectionError("");
    addItem({ productId: product.id, name: product.name, price: product.price, image: product.images[0], qty, size: selectedSize, color: selectedColor });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (loading) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6 animate-pulse space-y-4">
        <div className="bg-gray-100 rounded-2xl h-64" />
        <div className="bg-gray-100 h-5 rounded w-2/3" />
        <div className="bg-gray-100 h-4 rounded w-1/3" />
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="text-center py-20 text-gray-400">Product not found.</div>
    </div>
  );

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-5">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-gray-800 transition">
          <ChevronLeft size={18} /> Back
        </button>

        {/* Main image */}
        <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl h-64 sm:h-80 overflow-hidden mb-3">
          <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
          {discount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          <button
            onClick={() => setWishlisted((v) => !v)}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow transition active:scale-90"
          >
            <Heart size={18} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
          </button>
        </div>

        {/* Thumbnail strip */}
        {product.images.length > 1 && (
          <div className="flex gap-2 mb-4">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${activeImg === i ? "border-primary-400" : "border-transparent"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <h1 className="text-xl font-bold mb-1">{product.name}</h1>

        {product.rating && (
          <div className="flex items-center gap-1.5 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={14} className={i <= Math.round(product.rating!) ? "text-primary-500 fill-primary-500" : "text-gray-300 fill-gray-300"} />
            ))}
            {product.reviewCount && <span className="text-xs text-gray-500">({product.reviewCount} reviews)</span>}
          </div>
        )}

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-extrabold">₦{product.price.toLocaleString()}</span>
          {product.oldPrice && <span className="text-sm text-gray-400 line-through">₦{product.oldPrice.toLocaleString()}</span>}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-5">{product.description}</p>

        {/* Sizes */}
        {product.sizes.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${selectedSize === s ? "bg-primary-400 border-primary-400 text-gray-900" : "border-gray-200 text-gray-600"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="mb-5">
            <p className="text-sm font-semibold mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${selectedColor === c ? "bg-primary-400 border-primary-400 text-gray-900" : "border-gray-200 text-gray-600"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Qty + Add to cart */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1.5">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="active:scale-90 transition"><Minus size={15} /></button>
            <span className="w-6 text-center font-semibold text-sm">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="active:scale-90 transition"><Plus size={15} /></button>
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex-1 font-bold py-3 rounded-full transition active:scale-95 ${added ? "bg-green-500 text-white" : "bg-primary-400 text-gray-900 hover:bg-primary-500"}`}
          >
            {added ? "Added to Cart ✓" : `Add to Cart — ₦${(product.price * qty).toLocaleString()}`}
          </button>
        </div>
        {selectionError && <p className="text-sm text-red-600 -mt-3 mb-5">{selectionError}</p>}

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((t) => (
              <span key={t} className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full font-medium">{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
