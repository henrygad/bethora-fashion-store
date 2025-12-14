import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-accent-foreground">B</span>
              </div>
              <span className="font-bold text-xl">Bethora</span>
            </div>
            <p className="text-gray-300 text-sm">Premium fashion for every style.</p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-3">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/products" className="hover:text-accent transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=men" className="hover:text-accent transition">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/products?category=women" className="hover:text-accent transition">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="hover:text-accent transition">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="#" className="hover:text-accent transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@bethora.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1-800-BETHORA</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>New York, USA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2025 Bethora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
