"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { CartItem } from "@/types";
import { logActivity } from "@/lib/cookies";
import { calculateOrderTotals, cartLineKey } from "@/lib/commerce";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  changeQty: (productId: string, delta: number, size?: string, color?: string) => void;
  clearCart: () => void;
  subtotal: number;
  delivery: number;
  total: number;
  count: number;
  ready: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

function isSameCartLine(item: CartItem, productId: string, size?: string, color?: string) {
  return cartLineKey(item) === cartLineKey({ productId, size, color });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem("bethora_cart");
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed)) setItems(parsed as CartItem[]);
        }
      } catch { }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("bethora_cart", JSON.stringify(items));
  }, [items, ready]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && (i.size || "") === (item.size || "") && (i.color || "") === (item.color || "")
      );
      if (existing) {
        return prev.map((i) => (i === existing ? { ...i, qty: i.qty + item.qty } : i));
      }
      return [...prev, item];
    });
    logActivity("add_to_cart", { productId: item.productId, qty: item.qty });
  }

  function removeItem(productId: string, size?: string, color?: string) {
    setItems((prev) => prev.filter((i) => !isSameCartLine(i, productId, size, color)));
  }

  function changeQty(productId: string, delta: number, size?: string, color?: string) {
    setItems((prev) =>
      prev
        .map((i) => (isSameCartLine(i, productId, size, color) ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function clearCart() {
    setItems([]);
    localStorage.removeItem("bethora_cart");
  }

  const { subtotal, delivery, total } = calculateOrderTotals(items);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, changeQty, clearCart, subtotal, delivery, total, count, ready }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
