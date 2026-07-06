import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  deleteDoc, query, where, orderBy, limit,
} from "firebase/firestore";
import { db } from "./config";
import type { Product, Order, Address, UserProfile } from "@/types";

// ── Products ──────────────────────────────────────────
export async function getActiveProducts(): Promise<Product[]> {
  const q = query(collection(db, "products"), where("status", "==", "Active"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const q = query(collection(db, "products"), where("status", "==", "Active"), where("category", "==", category), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, "products", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null;
}

export async function getAllProducts(): Promise<Product[]> {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function createProduct(data: Omit<Product, "id">) {
  return addDoc(collection(db, "products"), data);
}

export async function updateProduct(id: string, data: Partial<Product>) {
  return updateDoc(doc(db, "products", id), { ...data, updatedAt: Date.now() });
}

export async function deleteProduct(id: string) {
  return deleteDoc(doc(db, "products", id));
}

// ── Orders ────────────────────────────────────────────
export async function createOrder(order: Omit<Order, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "orders"), order);
  return ref.id;
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const q = query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function getOrderById(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, "orders", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Order) : null;
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(200));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  return updateDoc(doc(db, "orders", id), { status });
}

// ── Addresses ─────────────────────────────────────────
export async function getAddressesByUser(userId: string): Promise<Address[]> {
  const q = query(collection(db, "addresses"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Address));
}

export async function addAddress(address: Omit<Address, "id">) {
  return addDoc(collection(db, "addresses"), address);
}

export async function updateAddress(id: string, data: Partial<Address>) {
  return updateDoc(doc(db, "addresses", id), data);
}

export async function deleteAddress(id: string) {
  return deleteDoc(doc(db, "addresses", id));
}

// ── Users ─────────────────────────────────────────────
export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => d.data() as UserProfile);
}