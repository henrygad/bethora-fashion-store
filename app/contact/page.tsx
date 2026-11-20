"use client";

import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { Mail, Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { WHATSAPP_DISPLAY, WHATSAPP_TEL, WHATSAPP_URL } from "@/lib/contact";

const SUBJECTS = ["Order Issue", "Return Request", "Product Inquiry", "Delivery Issue", "Other"];

const ICON_CARDS = [
    { icon: Mail, label: "Email Us", value: "support@bethora.com.ng", href: "mailto:support@bethora.com.ng" },
    { icon: Phone, label: "Call Us", value: WHATSAPP_DISPLAY, href: `tel:${WHATSAPP_TEL}` },
    { icon: MessageCircle, label: "WhatsApp Us", value: WHATSAPP_DISPLAY, href: WHATSAPP_URL },
];

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
    const [form, setForm] = useState({ ...EMPTY_FORM });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.email || !form.subject || !form.message) return;
        const message = [
            "*Bethora support request*",
            `Name: ${form.name}`,
            `Email: ${form.email}`,
            `Subject: ${form.subject}`,
            "",
            form.message,
        ].join("\n");
        window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-8 fade-in">
                <h1 className="text-2xl font-bold mb-1">Contact Us</h1>
                <p className="text-sm text-gray-500 mb-6">We&apos;d love to hear from you. Reach out any time.</p>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left — contact info */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="font-bold text-base mb-4">Bethora</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <Mail size={16} className="text-primary-500 mt-0.5 shrink-0" />
                                    <span className="text-gray-600">support@bethora.com.ng</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone size={16} className="text-primary-500 mt-0.5 shrink-0" />
                                    <span className="text-gray-600">{WHATSAPP_DISPLAY}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-primary-500 mt-0.5 shrink-0" />
                                    <span className="text-gray-600">Lagos, Nigeria</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock size={16} className="text-primary-500 mt-0.5 shrink-0" />
                                    <span className="text-gray-600">Mon–Sat, 8am–6pm WAT</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {ICON_CARDS.map(({ icon: Icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target={href.startsWith("http") ? "_blank" : undefined}
                                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:border-primary-400 hover:shadow-sm transition"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-2">
                                        <Icon size={18} />
                                    </div>
                                    <p className="text-xs font-semibold">{label}</p>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right — form */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <form onSubmit={handleSubmit} className="space-y-3">
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Full Name"
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                                />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="Email Address"
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                                />
                                <select
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 bg-white transition"
                                >
                                    <option value="">Select a Subject</option>
                                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <textarea
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    placeholder="How can we help?"
                                    rows={5}
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition resize-none"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-primary-400 text-gray-900 font-bold py-3 rounded-full hover:bg-primary-500 transition active:scale-95"
                                >
                                    Continue on WhatsApp
                                </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
