import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProduct } from "@/lib/server/products";
import { productUrl } from "@/lib/site";

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

function productDescription(name: string, description: string, category: string): string {
  const cleaned = description.replace(/\s+/g, " ").trim();
  const fallback = `Shop ${name} in ${category} from Bethora Nigeria. Confirm availability on WhatsApp before payment.`;
  const value = cleaned || fallback;
  return value.length > 157 ? `${value.slice(0, 154).trimEnd()}...` : value;
}

export async function generateMetadata({ params }: ProductLayoutProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getPublicProduct(id);
  if (!product) {
    return {
      title: "Product Not Found",
      robots: { index: false, follow: false },
    };
  }

  const description = productDescription(product.name, product.description, product.category);
  const url = productUrl(product.id);
  const images = product.images.filter(Boolean).map((image) => ({ url: image, alt: product.name }));

  return {
    title: product.name,
    description,
    keywords: [...new Set([product.name, product.category, product.subcategory, ...product.tags, "fashion Nigeria", "Bethora"].filter(Boolean))],
    alternates: { canonical: url },
    openGraph: {
      title: `${product.name} | Bethora`,
      description,
      url,
      siteName: "Bethora",
      locale: "en_NG",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Bethora`,
      description,
      images: product.images.filter(Boolean),
    },
  };
}

export default async function ProductLayout({ children, params }: ProductLayoutProps) {
  const { id } = await params;
  const product = await getPublicProduct(id);
  if (!product) notFound();

  const url = productUrl(product.id);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: productDescription(product.name, product.description, product.category),
    image: product.images,
    sku: product.sku || product.id,
    category: [product.category, product.subcategory].filter(Boolean).join(" > "),
    brand: {
      "@type": "Brand",
      name: "Bethora",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "NGN",
      price: product.price.toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Bethora",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      {children}
    </>
  );
}
