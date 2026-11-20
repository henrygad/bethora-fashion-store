import "server-only";

import { cache } from "react";
import { getApps, initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore/lite";
import type { Product } from "@/types";

function getPublicDb() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!apiKey || !projectId) return null;

  const appName = "bethora-public-server";
  const existingApp = getApps().find((app) => app.name === appName);
  const app = existingApp ?? initializeApp({ apiKey, projectId }, appName);
  return getFirestore(app);
}

export const getPublicProduct = cache(async (id: string): Promise<Product | null> => {
  if (!id || id.length > 128) return null;
  const db = getPublicDb();
  if (!db) return null;

  try {
    const snapshot = await getDoc(doc(db, "products", id));
    if (!snapshot.exists()) return null;
    const product = { id: snapshot.id, ...snapshot.data() } as Product;
    return product.status === "Active" ? product : null;
  } catch (error) {
    console.error("Public product lookup failed:", error);
    return null;
  }
});

export async function getPublicProducts(): Promise<Product[]> {
  const db = getPublicDb();
  if (!db) return [];

  try {
    const snapshot = await getDocs(query(collection(db, "products"), where("status", "==", "Active")));
    return snapshot.docs.map((document) => ({ id: document.id, ...document.data() } as Product));
  } catch (error) {
    console.error("Public product list lookup failed:", error);
    return [];
  }
}
