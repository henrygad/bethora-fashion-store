"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { logIn, getUserProfile } from "@/lib/firebase/auth";

const SIDE_IMG = "https://images.unsplash.com/photo-1696962678565-bee84e6b9cb6?w=1200&q=80&auto=format&fit=crop";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
        setLoading(true); setError("");
        try {
            const user = await logIn(form.email, form.password);
            const profile = await getUserProfile(user.uid);
            router.push(profile?.role === "admin" ? "/admin" : "/account");
        } catch {
            setError("Incorrect email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left image panel */}
            <div
                className="hidden lg:flex w-1/2 flex-col justify-between p-10"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.55)), url(${SIDE_IMG})`,
                    backgroundSize: "cover", backgroundPosition: "center",
                }}
            >
                <Link href="/">
                    <Image src="/android-chrome-192x192.png" alt="Bethora" height={40} width={0} className="w-auto h-10" />
                </Link>
                <div>
                    <h2 className="text-3xl font-extrabold text-white leading-tight mb-2">
                        Fashion for every<br />member of the family
                    </h2>
                    <p className="text-white/80 text-sm">
                        Shoes, jewelry, and clothing for women, men, and children — delivered across Nigeria.
                    </p>
                </div>
            </div>

            {/* Right form */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-sm">
                    <Link href="/" className="lg:hidden block mb-8 text-center">
                        <Image src="/android-chrome-192x192.png" alt="Bethora" height={40} width={0} className="w-auto h-10 mx-auto" />
                    </Link>
                    <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
                    <p className="text-sm text-gray-500 mb-6">Log in to continue shopping</p>

                    {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

                    <div className="space-y-4">
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                            />
                        </div>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPw ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                className="w-full rounded-xl border border-gray-200 pl-9 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                            />
                            <button onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <Link href="/forgot-password" className="text-xs text-primary-600 font-medium hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full bg-primary-400 text-gray-900 font-bold py-3 rounded-full hover:bg-primary-500 transition active:scale-95 disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Log In"}
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-primary-600 font-semibold hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}