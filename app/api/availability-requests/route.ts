import { createHash } from "node:crypto";
import type { DocumentSnapshot } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { errorResponse, HttpError, requireUser } from "@/lib/server/auth";
import { WHATSAPP_NUMBER } from "@/lib/contact";
import { calculateOrderTotals } from "@/lib/commerce";
import { formatDeliveryAddress, isNigerianPhone } from "@/lib/address";
import { NIGERIAN_STATES } from "@/types";
import type { Address, CartItem, Order, Product } from "@/types";
import { productUrl } from "@/lib/site";

const MAX_LINES = 25;
const MAX_QTY_PER_LINE = 20;

interface RequestItem {
  productId: string;
  qty: number;
  size?: string;
  color?: string;
}

interface RequestBody {
  requestId?: string;
  items?: RequestItem[];
  address?: Partial<Address>;
}

function text(value: unknown, field: string, maxLength: number) {
  if (typeof value !== "string") throw new HttpError(400, `${field} is required`);
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > maxLength) throw new HttpError(400, `${field} is invalid`);
  return cleaned;
}

function validateAddress(input: Partial<Address> | undefined, userId: string): Address {
  if (!input) throw new HttpError(400, "Delivery address is required");
  const phone = text(input.phone, "Phone number", 20).replace(/[\s()-]/g, "");
  if (!isNigerianPhone(phone)) {
    throw new HttpError(400, "Enter a valid Nigerian phone number");
  }
  const state = text(input.state, "State", 60);
  if (!NIGERIAN_STATES.includes(state)) throw new HttpError(400, "Choose a valid Nigerian state");

  return {
    id: typeof input.id === "string" ? input.id.slice(0, 128) : "",
    userId,
    label: typeof input.label === "string" && input.label.trim() ? input.label.trim().slice(0, 40) : "Delivery",
    name: text(input.name, "Full name", 100),
    phone,
    address: text(input.address, "Street address", 300),
    city: text(input.city, "City or town", 100),
    lga: text(input.lga, "Local government area", 100),
    state,
    isDefault: Boolean(input.isDefault),
  };
}

function validateItems(items: RequestItem[] | undefined) {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) {
    throw new HttpError(400, "Your cart must contain between 1 and 25 items");
  }

  const seen = new Set<string>();
  return items.map((item) => {
    const productId = text(item.productId, "Product", 128);
    if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > MAX_QTY_PER_LINE) {
      throw new HttpError(400, "Item quantity is invalid");
    }
    const size = typeof item.size === "string" ? item.size.trim().slice(0, 30) : "";
    const color = typeof item.color === "string" ? item.color.trim().slice(0, 30) : "";
    const key = `${productId}|${size}|${color}`;
    if (seen.has(key)) throw new HttpError(400, "Duplicate cart item");
    seen.add(key);
    return { productId, qty: item.qty, size, color };
  });
}

function productFromSnapshot(snapshot: DocumentSnapshot): Product {
  return { id: snapshot.id, ...snapshot.data() } as Product;
}

function buildWhatsappUrl(order: Order) {
  const itemLines = order.items.map((item, index) => {
    const variant = [item.size, item.color].filter(Boolean).join(", ");
    return [
      `${index + 1}. ${item.name}${variant ? ` (${variant})` : ""} × ${item.qty} — ₦${(item.price * item.qty).toLocaleString("en-NG")}`,
      `   ${productUrl(item.productId)}`,
    ].join("\n");
  });
  const message = [
    "*Bethora availability request*",
    `Request ID: ${order.id}`,
    "",
    ...itemLines,
    "",
    `Estimated subtotal: ₦${order.subtotal.toLocaleString("en-NG")}`,
    `Estimated delivery: ${order.delivery === 0 ? "Free" : `₦${order.delivery.toLocaleString("en-NG")}`}`,
    `Estimated total: ₦${order.total.toLocaleString("en-NG")}`,
    "",
    `Delivery to: ${order.address.name}, ${formatDeliveryAddress(order.address)}`,
    `Phone: ${order.address.phone}`,
    "",
    "Please confirm whether these products are available before I make payment.",
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const body = await request.json() as RequestBody;
    const requestId = text(body.requestId, "Request ID", 100);
    if (!/^[a-zA-Z0-9-]+$/.test(requestId)) throw new HttpError(400, "Request ID is invalid");

    const requestedItems = validateItems(body.items);
    const address = validateAddress(body.address, user.uid);
    const db = getAdminDb();
    const orderId = createHash("sha256").update(`${user.uid}:${requestId}`).digest("hex").slice(0, 24);
    const orderRef = db.collection("orders").doc(orderId);
    const productRefs = requestedItems.map((item) => db.collection("products").doc(item.productId));

    const order = await db.runTransaction(async (transaction) => {
      const existingOrder = await transaction.get(orderRef);
      if (existingOrder.exists) {
        const existing = { id: existingOrder.id, ...existingOrder.data() } as Order;
        if (existing.userId !== user.uid) throw new HttpError(409, "Request ID conflict");
        return existing;
      }

      const productSnapshots = await transaction.getAll(...productRefs);
      const items: CartItem[] = productSnapshots.map((snapshot, index) => {
        if (!snapshot.exists) throw new HttpError(409, "A product in your cart no longer exists");
        const product = productFromSnapshot(snapshot);
        const requested = requestedItems[index];
        if (
          product.status !== "Active"
          || !Number.isInteger(product.stock)
          || product.stock < requested.qty
          || !Number.isFinite(product.price)
          || product.price < 0
        ) {
          throw new HttpError(409, `${product.name} is not currently available in that quantity`);
        }
        const sizes = Array.isArray(product.sizes) ? product.sizes : [];
        const colors = Array.isArray(product.colors) ? product.colors : [];
        if (sizes.length > 0 && (!requested.size || !sizes.includes(requested.size))) {
          throw new HttpError(400, `Choose an available size for ${product.name}`);
        }
        if (colors.length > 0 && (!requested.color || !colors.includes(requested.color))) {
          throw new HttpError(400, `Choose an available colour for ${product.name}`);
        }
        return {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || "",
          qty: requested.qty,
          size: requested.size || undefined,
          color: requested.color || undefined,
        };
      });

      const { subtotal, delivery, total } = calculateOrderTotals(items);
      const now = Date.now();
      const storedOrder: Omit<Order, "id"> = {
        userId: user.uid,
        items,
        subtotal,
        delivery,
        total,
        address,
        paymentMethod: "whatsapp",
        status: "Pending Availability",
        createdAt: now,
        updatedAt: now,
      };
      transaction.create(orderRef, storedOrder);
      return { id: orderId, ...storedOrder };
    });

    return Response.json({ orderId: order.id, whatsappUrl: buildWhatsappUrl(order) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
