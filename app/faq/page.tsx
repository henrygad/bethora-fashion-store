"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { ChevronDown } from "lucide-react";

const SECTIONS = [
    {
        title: "Orders & Delivery",
        questions: [
            { q: "How long does delivery take?", a: "Standard delivery takes 3–5 business days for Lagos and nationwide addresses across Nigeria. You'll receive updates as your order moves through processing, shipping, and delivery." },
            { q: "Can I track my order?", a: "Yes. Go to My Orders in your account and tap any order to see its live tracking timeline, from order placed through to delivery." },
            { q: "How much is delivery?", a: "Delivery is free on orders above ₦20,000. For orders below that, a flat delivery fee of ₦1,500 applies, calculated automatically at checkout." },
            { q: "Can I change or cancel my order after placing it?", a: "You can cancel or amend an order before it has shipped by contacting our support team. Once an order is out for delivery, it can no longer be cancelled." },
            { q: "Do you deliver outside Lagos?", a: "Yes, we deliver nationwide across Nigeria. Delivery times may vary slightly depending on your location." },
        ],
    },
    {
        title: "Returns & Refunds",
        questions: [
            { q: "What is your return policy?", a: "You can return unworn, unwashed items with tags attached within 7 days of delivery. See our full Return Policy page for details." },
            { q: "How do I start a return?", a: "Email support@bethora.com.ng with your order number and reason for the return, and our team will send you instructions." },
            { q: "How long do refunds take?", a: "Once we receive and inspect your returned item, refunds are processed within 5–7 business days back to your original payment method." },
            { q: "Are all items eligible for return?", a: "Most items are, but jewelry, underwear, and items marked as final sale cannot be returned for hygiene and quality reasons." },
            { q: "Can I exchange an item instead of returning it?", a: "Yes. Let our support team know when you reach out, and we'll arrange a replacement in your preferred size or colour if it's in stock." },
        ],
    },
    {
        title: "Products & Sizing",
        questions: [
            { q: "How do I know what size to order?", a: "Each product page lists available sizes. If you're between sizes or unsure, contact our support team for guidance before ordering." },
            { q: "Are the product photos accurate?", a: "Yes, we photograph our actual products, though slight colour variations may occur depending on your screen display." },
            { q: "Do you restock sold-out items?", a: "Popular items are often restocked. Check back on the product page, or contact us to ask about restock timing." },
            { q: "Are your products authentic?", a: "Yes, all products sold on Bethora are sourced directly and are 100% authentic." },
            { q: "Can I see more details about fabric or care instructions?", a: "Product descriptions include fabric and care details where available. Feel free to contact us if you need more information before purchasing." },
        ],
    },
    {
        title: "Payments",
        questions: [
            { q: "What payment methods do you accept?", a: "We currently accept Pay on Delivery and bank transfer at checkout." },
            { q: "Is it safe to pay on delivery?", a: "Yes, Pay on Delivery lets you inspect your order before paying, making it a safe and popular option across Nigeria." },
            { q: "Do prices include delivery fees?", a: "Product prices do not include delivery. Delivery fees, where applicable, are calculated and shown separately at checkout." },
            { q: "Can I get a receipt for my order?", a: "Yes, an order confirmation with full pricing details is available in your account under My Orders." },
            { q: "Are prices in Naira?", a: "Yes, all prices on Bethora are listed in Nigerian Naira (₦)." },
        ],
    },
    {
        title: "Account",
        questions: [
            { q: "Do I need an account to shop?", a: "Yes, creating a free account lets you check out, track orders, and save addresses for faster shopping." },
            { q: "How do I reset my password?", a: "Use the \"Forgot password\" link on the login page to receive a password reset email." },
            { q: "How do I update my account details?", a: "Go to My Account, where you can update your name, phone number, and saved delivery addresses." },
            { q: "Can I save multiple delivery addresses?", a: "Yes, you can save multiple addresses under My Account → Addresses and choose one at checkout." },
            { q: "How do I delete my account?", a: "Contact support@bethora.com.ng to request account deletion, and we'll process it for you." },
        ],
    },
];

export default function FaqPage() {
    const [open, setOpen] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8 fade-in">
                <h1 className="text-2xl font-bold mb-1">Frequently Asked Questions</h1>
                <p className="text-sm text-gray-500 mb-6">Answers to common questions about shopping with Bethora.</p>

                <div className="space-y-8">
                    {SECTIONS.map((section) => (
                        <div key={section.title}>
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">{section.title}</h2>
                            <div className="space-y-2">
                                {section.questions.map((item, i) => {
                                    const id = `${section.title}-${i}`;
                                    const isOpen = open === id;
                                    return (
                                        <div
                                            key={id}
                                            className={`bg-white rounded-2xl border overflow-hidden transition ${isOpen ? "border-l-4 border-primary-400" : "border-gray-100"
                                                }`}
                                        >
                                            <button
                                                onClick={() => setOpen(isOpen ? null : id)}
                                                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                                            >
                                                <span className="text-sm font-semibold">{item.q}</span>
                                                <ChevronDown
                                                    size={18}
                                                    className={`text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                                />
                                            </button>
                                            {isOpen && (
                                                <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still have questions CTA */}
                <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 text-center mt-10">
                    <h3 className="text-white font-bold text-lg mb-1">Still have questions?</h3>
                    <p className="text-gray-400 text-sm mb-4">Our support team is happy to help with anything else.</p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-1.5 bg-primary-400 text-gray-900 font-bold px-6 py-2.5 rounded-full hover:bg-primary-500 transition active:scale-95"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}
