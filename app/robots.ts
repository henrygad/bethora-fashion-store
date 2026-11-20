import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/products/", "/contact", "/faq", "/support", "/legal/"],
      disallow: ["/admin/", "/account/", "/api/", "/cart", "/checkout", "/login", "/signup", "/forgot-password"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
