import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Fashion Online in Nigeria",
  description: "Browse women's, men's and children's clothing, shoes and jewellery from Bethora. Request product availability on WhatsApp before payment.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Shop Fashion Online in Nigeria | Bethora",
    description: "Browse clothing, shoes and jewellery for the whole family from Bethora.",
    url: "/products",
    type: "website",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
