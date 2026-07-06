import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Footer from "@/components/shared/Footer";
import CookieConsent from "@/components/shared/CookieConsent";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://bethora.com.ng'),
  title: "Bethora — Fashion for the Whole Family",
  description: "Shoes, jewelry, and clothing for women, men, and children — delivered across Nigeria.",
  keywords: ["fashion", "Nigeria", "shoes", "jewelry", "clothing", "Bethora"],
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
    description: 'Shoes, jewelry, and clothing for women, men, and children — delivered across Nigeria.',
    url: 'https://bethora.com.ng',
    siteName: 'Bethora',
    images: [{ url: '/android-chrome-512x512.png', width: 512, height: 512 }],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Bethora — Fashion for the Whole Family',
    description: 'Shoes, jewelry, and clothing for women, men, and children — delivered across Nigeria.',
    images: ['/android-chrome-512x512.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
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