import Link from "next/link";
import Image from "next/image";
import { WHATSAPP_DISPLAY } from "@/lib/contact";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
                <div className="col-span-2 sm:col-span-1">
                    <Image
                        src="/android-chrome-192x192.png"
                        alt="Bethora"
                        height={32}
                        width={0}
                        className="w-auto h-8 mb-2"
                    />
                    <p className="text-xs text-gray-400 leading-relaxed">
                        Shoes, jewelry &amp; fashion for the whole family — delivered across Nigeria.
                    </p>
                </div>

                <div>
                    <p className="text-sm font-semibold text-white mb-3">Quick Links</p>
                    <ul className="space-y-2 text-xs">
                        <li><Link href="/" className="hover:text-primary-400 transition">Home</Link></li>
                        <li><Link href="/products" className="hover:text-primary-400 transition">Products</Link></li>
                        <li><Link href="/contact" className="hover:text-primary-400 transition">Contact</Link></li>
                        <li><Link href="/faq" className="hover:text-primary-400 transition">FAQ</Link></li>
                    </ul>
                </div>

                <div>
                    <p className="text-sm font-semibold text-white mb-3">Legal</p>
                    <ul className="space-y-2 text-xs">
                        <li><Link href="/legal/privacy-policy" className="hover:text-primary-400 transition">Privacy Policy</Link></li>
                        <li><Link href="/legal/terms-of-service" className="hover:text-primary-400 transition">Terms of Service</Link></li>
                        <li><Link href="/legal/return-policy" className="hover:text-primary-400 transition">Return Policy</Link></li>
                        <li><Link href="/legal/cookie-policy" className="hover:text-primary-400 transition">Cookie Policy</Link></li>
                    </ul>
                </div>

                <div>
                    <p className="text-sm font-semibold text-white mb-3">Contact Info</p>
                    <ul className="space-y-2 text-xs text-gray-400">
                        <li>support@bethora.com.ng</li>
                        <li>{WHATSAPP_DISPLAY}</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-800 py-4 px-4 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} Bethora. bethora.com.ng. All rights reserved.
            </div>
        </footer>
    );
}
