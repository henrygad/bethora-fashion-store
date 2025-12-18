"use client";

import Link from "next/link";
import { ShoppingCart, Minus, Plus, Heart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { ProductType } from "@/type/product";
import Image from "next/image";

export function ProductCard({ product }: { product: ProductType }) {
  const { carts, addToCart, removeFromCart } = useCart();

  const cartItem = carts.find((c) => c.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  return (
    <div className="group relative rounded-lg border bg-background overflow-hidden">
      {/* 🔗 Product link (image + details only) */}
      <Link href={`/product/${product.id}`}>
        <div className="cursor-pointer">
          <div className="relative h-64 bg-muted overflow-hidden">
            <Image
              src={product.primaryImage || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              width={200}
              height={200}
            />

            {/* ❤️ Wishlist (optional) */}
            <button
              className="absolute top-3 left-3 rounded-full bg-white p-2 shadow hover:bg-accent hover:text-accent-foreground"
              onClick={(e) => e.preventDefault()}
            >
              <Heart className="h-4 w-4" />
            </button>

            {/* 🛒 Cart quantity badge */}
            {quantity > 0 && (
              <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                {quantity}
              </div>
            )}
          </div>

          <div className="p-4 space-y-2">
            <p className="text-xs uppercase text-muted-foreground">
              {product.category}
            </p>

            <h3 className="font-semibold group-hover:text-accent transition">
              {product.name}
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-accent">
                ${product.discountPrice ?? product.price}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* ➕➖ Cart controls */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        {quantity === 0 ? (
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </button>
        ) : (
          <div className="flex items-center rounded-md border bg-background shadow">
            <button
              onClick={() => removeFromCart(product.id)}
              className="p-2 hover:bg-muted"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="px-3 text-sm font-medium">{quantity}</span>

            <button
              onClick={() => addToCart(product)}
              className="p-2 hover:bg-muted"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
