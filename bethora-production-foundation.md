# Bethora — Production Build (Part 1: Foundation + Storefront)

## Project Structure

```
bethora/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Homepage
│   │   ├── globals.css
│   │   ├── products/
│   │   │   ├── page.tsx                # Listing
│   │   │   └── [id]/page.tsx           # Product detail
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── order-confirmation/[id]/page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── account/                    # Customer dashboard (Part 2)
│   │   └── admin/                      # Admin dashboard (Part 3)
│   ├── components/
│   │   ├── ui/                         # Buttons, inputs, etc.
│   │   ├── storefront/
│   │   └── shared/
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── auth.ts
│   │   │   ├── firestore.ts
│   │   │   └── storage.ts
│   │   ├── cookies.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useProducts.ts
│   └── context/
│       ├── AuthContext.tsx
│       └── CartContext.tsx
├── .env.local
├── next.config.js
├── tailwind.config.ts
└── package.json
```

## 1. Install dependencies

```bash
npx create-next-app@latest bethora --typescript --tailwind --app
cd bethora
npm install firebase lucide-react js-cookie
npm install -D @types/js-cookie
```

## 2. Environment variables — `.env.local`

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bethora.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bethora
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bethora.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Get these from Firebase Console → Project Settings → General → Your apps → Web app config. Never commit `.env.local` — confirm it's in `.gitignore`.

## 3. `src/lib/firebase/config.ts`

```typescript
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
```

## 4. `src/types/index.ts`

```typescript
export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  sku: string;
  images: string[];
  tags: string[];
  sizes: string[];
  colors: string[];
  status: "Active" | "Draft" | "Out of Stock";
  rating?: number;
  reviewCount?: number;
  createdAt: number;
  updatedAt: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
  color?: string;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  state: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  delivery: number;
  total: number;
  address: Address;
  paymentMethod: "pod" | "transfer";
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  createdAt: number;
}

export const NIGERIAN_STATES = [
  "Lagos", "Abuja (FCT)", "Oyo", "Rivers", "Kano", "Ogun", "Kaduna",
  "Enugu", "Delta", "Edo", "Anambra", "Plateau", "Other",
];
```

## 5. `src/lib/cookies.ts` — activity tracking

```typescript
import Cookies from "js-cookie";

const VIEWED_PRODUCTS_KEY = "bethora_viewed_products";
const SESSION_KEY = "bethora_session_id";

export function trackProductView(productId: string) {
  const viewed = getViewedProducts();
  const updated = [productId, ...viewed.filter((id) => id !== productId)].slice(0, 20);
  Cookies.set(VIEWED_PRODUCTS_KEY, JSON.stringify(updated), { expires: 30 });
}

export function getViewedProducts(): string[] {
  const raw = Cookies.get(VIEWED_PRODUCTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getOrCreateSessionId(): string {
  let sessionId = Cookies.get(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    Cookies.set(SESSION_KEY, sessionId, { expires: 365 });
  }
  return sessionId;
}

// Generic event logger — call this on add-to-cart, checkout-start, etc.
export function logActivityEvent(event: string, meta?: Record<string, unknown>) {
  const sessionId = getOrCreateSessionId();
  // In production, send this to Firestore "activityLogs" collection
  // or to an analytics endpoint. Kept as a stub here.
  if (typeof window !== "undefined") {
    console.log("[activity]", { sessionId, event, meta, ts: Date.now() });
  }
}
```

## 6. `src/lib/firebase/firestore.ts` — products data layer

```typescript
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit as fsLimit, Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { Product, Order, Address } from "@/types";

const PRODUCTS = "products";
const ORDERS = "orders";
const ADDRESSES = "addresses";

export async function getActiveProducts(): Promise<Product[]> {
  const q = query(collection(db, PRODUCTS), where("status", "==", "Active"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS),
    where("status", "==", "Active"),
    where("category", "==", category),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getProductById(id: string): Promise<Product | null> {
  const ref = doc(db, PRODUCTS, id);
  const snap = await getDoc(ref);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null;
}

export async function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, PRODUCTS), {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function updateProduct(id: string, data: Partial<Product>) {
  return updateDoc(doc(db, PRODUCTS, id), { ...data, updatedAt: Date.now() });
}

export async function deleteProduct(id: string) {
  return deleteDoc(doc(db, PRODUCTS, id));
}

export async function createOrder(order: Omit<Order, "id" | "createdAt">) {
  return addDoc(collection(db, ORDERS), { ...order, createdAt: Date.now() });
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const q = query(collection(db, ORDERS), where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, ORDERS), orderBy("createdAt", "desc"), fsLimit(100));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  return updateDoc(doc(db, ORDERS, id), { status });
}

export async function getAddressesByUser(userId: string): Promise<Address[]> {
  const q = query(collection(db, ADDRESSES), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Address));
}

export async function addAddress(userId: string, address: Omit<Address, "id">) {
  return addDoc(collection(db, ADDRESSES), { ...address, userId });
}

export async function deleteAddress(id: string) {
  return deleteDoc(doc(db, ADDRESSES, id));
}
```

## 7. `src/lib/firebase/auth.ts`

```typescript
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, sendPasswordResetEmail, onAuthStateChanged, User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";
import type { UserProfile } from "@/types";

export async function signUp(name: string, email: string, phone: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const profile: UserProfile = {
    uid: cred.user.uid,
    name,
    email,
    phone,
    role: "customer",
    createdAt: Date.now(),
  };
  await setDoc(doc(db, "users", cred.user.uid), profile);
  return cred.user;
}

export async function logIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logOut() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
```

## 8. `src/context/CartContext.tsx`

```tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { CartItem } from "@/types";
import { logActivityEvent } from "@/lib/cookies";

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

  // Persist to sessionStorage-equivalent via a simple in-memory + localStorage fallback
  useEffect(() => {
    const saved = localStorage.getItem("bethora_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bethora_cart", JSON.stringify(items));
  }, [items]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId && i.size === item.size && i.color === item.color);
      if (existing) {
        return prev.map((i) => (i === existing ? { ...i, qty: i.qty + item.qty } : i));
      }
      return [...prev, item];
    });
    logActivityEvent("add_to_cart", { productId: item.productId, qty: item.qty });
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function changeQty(productId: string, delta: number) {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, i.qty + delta) } : i)).filter((i) => i.qty > 0)
    );
  }

  function clearCart() {
    setItems([]);
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
```

> **Note on browser storage:** this uses `localStorage` for cart persistence, which works fine in your real Next.js app (deployed to bethora.com.ng). This is different from the Claude.ai prototype artifacts shown earlier, which can't use localStorage — that restriction is specific to the Claude.ai preview environment, not your production site.

## 9. `src/context/AuthContext.tsx`

```tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import { onAuthChange, getUserProfile } from "@/lib/firebase/auth";
import type { UserProfile } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const p = await getUserProfile(u.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return <AuthContext.Provider value={{ user, profile, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
```

## 10. `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bethora — Fashion for the Whole Family",
  description: "Shoes, jewelry, and clothing for women, men, and children — delivered across Nigeria.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

## 11. `src/app/page.tsx` — Homepage with hero slider

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HERO_SLIDES = [
  { id: 1, title: "New Arrivals", subtitle: "Elegant styles for every occasion", category: "women", image: "https://images.unsplash.com/photo-1696962678565-bee84e6b9cb6?w=1600&q=80&auto=format&fit=crop" },
  { id: 2, title: "Shoe Sale", subtitle: "Up to 30% off selected shoes", category: "shoes", image: "https://images.unsplash.com/photo-1534653299134-96a171b61581?w=1600&q=80&auto=format&fit=crop" },
  { id: 3, title: "Kids Collection", subtitle: "Comfy, stylish wears for your little ones", category: "children", image: "https://images.unsplash.com/photo-1578897367107-2828e351c8a8?w=1600&q=80&auto=format&fit=crop" },
  { id: 4, title: "Shine Bright", subtitle: "Beautiful jewelry pieces for every look", category: "jewelry", image: "https://images.unsplash.com/photo-1758995115682-1452a1a9e35b?w=1600&q=80&auto=format&fit=crop" },
];

const CATEGORIES = [
  { id: "women", label: "Women's Fashion" },
  { id: "men", label: "Men's Fashion" },
  { id: "children", label: "Children's Wear" },
  { id: "shoes", label: "Shoes" },
  { id: "jewelry", label: "Jewelry" },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* Hero slider */}
      <div className="relative h-64 sm:h-80 overflow-hidden bg-yellow-50">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.55)), url(${s.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">{s.title}</h1>
              <p className="text-white/90 mt-1 text-sm sm:text-base drop-shadow">{s.subtitle}</p>
              <button
                onClick={() => router.push(`/products?category=${s.category}`)}
                className="mt-4 bg-yellow-400 text-gray-900 px-5 py-2 rounded-full font-semibold text-sm hover:bg-yellow-300 transition active:scale-95"
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-gray-900" : "w-1.5 bg-gray-900/30"}`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.id}`}
              className="shrink-0 px-4 py-2 rounded-full bg-yellow-50 text-sm font-medium hover:bg-yellow-100 transition"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Trending products would render here via getActiveProducts() in a server component or with useEffect */}
    </div>
  );
}
```

## 12. `src/app/products/[id]/page.tsx` — Product detail with view tracking

```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "@/lib/firebase/firestore";
import { trackProductView } from "@/lib/cookies";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    getProductById(id).then((p) => {
      setProduct(p);
      if (p) trackProductView(p.id);
    });
  }, [id]);

  if (!product) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <img src={product.images[0]} alt={product.name} className="w-full h-72 object-cover rounded-2xl mb-5" />
      <h1 className="text-xl font-bold mb-1">{product.name}</h1>
      <p className="text-2xl font-extrabold mb-4">₦{product.price.toLocaleString()}</p>
      <p className="text-sm text-gray-600 mb-6">{product.description}</p>
      <button
        onClick={() =>
          addItem({ productId: product.id, name: product.name, price: product.price, image: product.images[0], qty })
        }
        className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-full hover:bg-yellow-500 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
```

---

## Firestore Security Rules (`firestore.rules`)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    function isAdmin() {
      return isSignedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /orders/{orderId} {
      allow read: if isAdmin() || isOwner(resource.data.userId);
      allow create: if isSignedIn();
      allow update: if isAdmin();
    }

    match /addresses/{addressId} {
      allow read, write: if isOwner(resource.data.userId);
      allow create: if isSignedIn();
    }

    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow write: if isOwner(userId);
    }
  }
}
```

---

**This covers:** Firebase setup, types, the cart/auth context layer, cookie-based activity tracking, the homepage hero slider, product detail page with view tracking, and Firestore security rules.

**Still to wire up in the storefront folder:** the listing page, cart page, checkout page, and order confirmation page — these follow the same pattern as the product detail page above (pull data via the `firestore.ts` functions, use `useCart()` for cart state). I can write those out fully too if you want them before moving to Part 2 (customer dashboard) — just say the word.

Next message: **Part 2 — Customer Dashboard** (account pages, order tracking, addresses, wishlist) unless you'd rather I finish the remaining storefront pages first.
