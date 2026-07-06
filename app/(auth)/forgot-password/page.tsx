"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft } from "lucide-react";
import { resetPassword } from "@/lib/firebase/auth";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleReset() {
        if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address"); return; }
        setLoading(true); setError("");
        try {
            await resetPassword(email);
            setSent(true);
        } catch {
            setError("No account found with this email address.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-white">
            <div className="w-full max-w-sm">
                <Link href="/" className="block mb-8 text-center">
                    <Image src="/android-chrome-192x192.png" alt="Bethora" height={40} width={0} className="w-auto h-10 mx-auto" />
                </Link>

                {!sent ? (
                    <>
                        <Link href="/login" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition mb-5">
                            <ArrowLeft size={15} /> Back to login
                        </Link>
                        <h1 className="text-2xl font-bold mb-1">Reset your password</h1>
                        <p className="text-sm text-gray-500 mb-6">Enter your email and we&apos;ll send you a reset link</p>

                        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

                        <div className="space-y-4">
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleReset()}
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                                />
                            </div>
                            <button
                                onClick={handleReset}
                                disabled={loading}
                                className="w-full bg-primary-400 text-gray-900 font-bold py-3 rounded-full hover:bg-primary-500 transition active:scale-95 disabled:opacity-60"
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-400 mb-4">
                            <Mail size={28} className="text-gray-900" />
                        </div>
                        <h1 className="text-xl font-bold mb-1">Check your email</h1>
                        <p className="text-sm text-gray-500 mb-6">
                            We sent a reset link to <span className="font-medium text-gray-800">{email}</span>
                        </p>
                        <Link
                            href="/login"
                            className="block w-full bg-primary-400 text-gray-900 font-bold py-3 rounded-full hover:bg-primary-500 transition text-center"
                        >
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}