"use client";

import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { Mail, Phone, MessageCircle, MapPin, Clock, CheckCircle2 } from "lucide-react";

const SUBJECTS = ["Order Issue", "Return Request", "Product Inquiry", "Delivery Issue", "Other"];

const ICON_CARDS = [
    { icon: Mail, label: "Email Us", value: "support@bethora.com.ng", href: "mailto:support@bethora.com.ng" },
    { icon: Phone, label: "Call Us", value: "+234 800 000 0000", href: "tel:+2348000000000" },
    { icon: MessageCircle, label: "WhatsApp Us", value: "+234 800 000 0000", href: "https://wa.me/2348000000000" },
];

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.email || !form.subject || !form.message) return;
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSent(true);
        }, 900);
    }

    function sendAnother() {
        setForm({ ...EMPTY_FORM });
        setSent(false);
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
                                    <span className="text-gray-600">+234 800 000 0000</span>
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
                        {sent ? (
                            <div className="flex flex-col items-center justify-center text-center py-10">
                                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                                    <CheckCircle2 size={32} className="text-green-500" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">Message Sent!</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    We&apos;ll get back to you within 24 hours.
                                </p>
                                <button
                                    onClick={sendAnother}
                                    className="bg-primary-400 text-gray-900 font-bold px-6 py-2.5 rounded-full hover:bg-primary-500 transition active:scale-95"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
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
                                    disabled={submitting}
                                    className="w-full bg-primary-400 text-gray-900 font-bold py-3 rounded-full hover:bg-primary-500 transition active:scale-95 disabled:opacity-60"
                                >
                                    {submitting ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
