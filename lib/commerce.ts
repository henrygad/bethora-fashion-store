import type { CartItem } from "@/types";

export const FREE_DELIVERY_THRESHOLD = 20_000;
export const DELIVERY_FEE = 1_500;

export function calculateOrderTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = items.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  return { subtotal, delivery, total: subtotal + delivery };
}

export function cartLineKey(item: Pick<CartItem, "productId" | "size" | "color">) {
  return `${item.productId}|${item.size || ""}|${item.color || ""}`;
}

