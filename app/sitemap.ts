import type { MetadataRoute } from "next";
import { getPublicProducts } from "@/lib/server/products";
import { productUrl, SITE_URL } from "@/lib/site";

// Product URLs come from Firestore at request time. This keeps deployment builds
// independent of Firebase credentials while still serving a current sitemap.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/products",
    "/contact",
    "/faq",
    "/support",
    "/legal/privacy-policy",
    "/legal/return-policy",
    "/legal/terms-of-service",
    "/legal/cookie-policy",
  ];
  const products = await getPublicProducts();

  return [
    ...staticRoutes.map((route, index) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: index < 2 ? "daily" as const : "monthly" as const,
      priority: index === 0 ? 1 : index === 1 ? 0.9 : 0.5,
    })),
    ...products.map((product) => ({
      url: productUrl(product.id),
      lastModified: new Date(product.updatedAt || product.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: product.images.filter(Boolean),
    })),
  ];
}
