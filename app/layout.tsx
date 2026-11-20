import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Footer from "@/components/shared/Footer";
import CookieConsent from "@/components/shared/CookieConsent";
import { WHATSAPP_TEL } from "@/lib/contact";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bethora — Fashion for the Whole Family",
    template: "%s | Bethora",
  },
  description: "Shop women's, men's and children's fashion, shoes and jewellery online in Nigeria. Confirm product availability with Bethora before payment.",
  applicationName: "Bethora",
  keywords: ["online fashion store Nigeria", "Nigerian fashion", "women's clothing", "men's clothing", "children's wear", "shoes", "jewellery", "Bethora"],
  authors: [{ name: "Bethora", url: SITE_URL }],
  creator: "Bethora",
  publisher: "Bethora",
  category: "fashion",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    shortcut: '/android-chrome-192x192.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Bethora — Fashion for the Whole Family',
    description: 'Shop fashion, shoes and jewellery for the whole family across Nigeria.',
    url: SITE_URL,
    siteName: 'Bethora',
    images: [{ url: '/android-chrome-512x512.png', width: 512, height: 512, alt: "Bethora fashion store" }],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bethora — Fashion for the Whole Family',
    description: 'Shop fashion, shoes and jewellery for the whole family across Nigeria.',
    images: ['/android-chrome-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "Bethora",
    url: SITE_URL,
    logo: `${SITE_URL}/android-chrome-512x512.png`,
    image: `${SITE_URL}/android-chrome-512x512.png`,
    description: "A Nigerian online fashion store for women, men and children.",
    email: "support@bethora.com.ng",
    telephone: WHATSAPP_TEL,
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    currenciesAccepted: "NGN",
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema).replace(/</g, "\\u003c") }}
        />
        <AuthProvider>
          <CartProvider>
            {children}
            <Footer />
            <CookieConsent />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
