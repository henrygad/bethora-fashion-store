import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "sonner";
import AuthProvider from "@/context/auth-context";
import ProductProvider from "@/context/product-context";


const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bethora | Premium Fashion Store",
  description: "Shop the latest in fashion with Bethora - premium clothing and accessories for every style",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <ProductProvider>
            <>
              {children}
              <Analytics />
              <Toaster richColors closeButton position="top-right" duration={5000} />
            </>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
