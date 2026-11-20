export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://bethora.com.ng").replace(/\/$/, "");

export function productUrl(productId: string): string {
  return `${SITE_URL}/products/${encodeURIComponent(productId)}`;
}
