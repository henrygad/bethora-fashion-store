import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { Search, Package, RotateCcw, HelpCircle, MessageSquare, Shield, FileText } from "lucide-react";

const CARDS = [
    { icon: Package, title: "Track My Order", desc: "Check the status of a recent order", href: "/account/orders" },
    { icon: RotateCcw, title: "Returns & Refunds", desc: "Start a return or check our policy", href: "/legal/return-policy" },
    { icon: HelpCircle, title: "FAQs", desc: "Answers to common questions", href: "/faq" },
    { icon: MessageSquare, title: "Contact Us", desc: "Reach our support team directly", href: "/contact" },
    { icon: Shield, title: "Privacy Policy", desc: "How we handle your information", href: "/legal/privacy-policy" },
    { icon: FileText, title: "Terms of Service", desc: "Rules for using Bethora", href: "/legal/terms-of-service" },
];

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-8 fade-in">
                <h1 className="text-2xl font-bold mb-1 text-center">How can we help?</h1>
                <p className="text-sm text-gray-500 mb-6 text-center">Search our help resources or browse a topic below.</p>

                {/* Search bar (UI only) */}
                <div className="relative max-w-lg mx-auto mb-10">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        placeholder="Search for help..."
                        className="w-full bg-white border border-gray-200 rounded-full pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                    />
                </div>

                {/* Support category cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    {CARDS.map(({ icon: Icon, title, desc, href }) => (
                        <Link
                            key={title}
                            href={href}
                            className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-primary-400 hover:shadow-sm transition"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
                                <Icon size={18} />
                            </div>
                            <p className="text-sm font-bold mb-1">{title}</p>
                            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                        </Link>
                    ))}
                </div>

                {/* Need more help banner */}
                <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-1">Need more help?</h3>
                        <p className="text-gray-400 text-sm">Our support team is available Mon–Sat, 8am–6pm WAT.</p>
                    </div>
                    <Link
                        href="/contact"
                        className="shrink-0 bg-primary-400 text-gray-900 font-bold px-6 py-2.5 rounded-full hover:bg-primary-500 transition active:scale-95"
                    >
                        Chat With Us
                    </Link>
                </div>
            </div>
        </div>
    );
}
