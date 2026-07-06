"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { CartItem } from "@/types";
import { logActivity } from "@/lib/cookies";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  changeQty: (productId: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  delivery: number;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

const FREE_DELIVERY_THRESHOLD = 20000;
const DELIVERY_FEE = 1500;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bethora_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch { }
  }, []);

  useEffect(() => {
    localStorage.setItem("bethora_cart", JSON.stringify(items));
  }, [items]);

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

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function changeQty(productId: string, delta: number) {
    setItems((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function clearCart() {
    setItems([]);
    localStorage.removeItem("bethora_cart");
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = items.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, changeQty, clearCart, subtotal, delivery, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}