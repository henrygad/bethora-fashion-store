import "server-only";

import { cache } from "react";
import { getAdminDb } from "@/lib/firebase/admin";
import type { Product } from "@/types";

export const getPublicProduct = cache(async (id: string): Promise<Product | null> => {
  if (!id || id.length > 128) return null;
  const snapshot = await getAdminDb().collection("products").doc(id).get();
  if (!snapshot.exists) return null;
  const product = { id: snapshot.id, ...snapshot.data() } as Product;
  return product.status === "Active" ? product : null;
});

export async function getPublicProducts(): Promise<Product[]> {
  const snapshot = await getAdminDb().collection("products").where("status", "==", "Active").get();
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() } as Product));
}
