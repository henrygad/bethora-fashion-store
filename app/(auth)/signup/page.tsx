"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import { signUp } from "@/lib/firebase/auth";

const SIDE_IMG = "https://images.unsplash.com/photo-1696962678565-bee84e6b9cb6?w=1200&q=80&auto=format&fit=crop";

export default function SignupPage() {
    type SignupForm = {
        name: string;
        email: string;
        phone: string;
        password: string;
        confirm: string;
    };

    const router = useRouter();
    const [form, setForm] = useState<SignupForm>({ name: "", email: "", phone: "", password: "", confirm: "" });
    const [showPw, setShowPw] = useState(false);
    const [agree, setAgree] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [firebaseError, setFirebaseError] = useState("");

    function validate() {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Full name is required";
        if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
        if (!/^0\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid Nigerian phone number";
        if (form.password.length <= 6) e.password = "Password must be longer than 6 characters";
        else if (!/[A-Z]/.test(form.password)) e.password = "Password must include an uppercase letter";
        else if (!/[a-z]/.test(form.password)) e.password = "Password must include a lowercase letter";
        else if (!/[0-9]/.test(form.password)) e.password = "Password must include a number";
        else if (!/[^A-Za-z0-9]/.test(form.password)) e.password = "Password must include a symbol";
        if (form.confirm !== form.password) e.confirm = "Passwords do not match";
        if (!agree) e.agree = "You must agree to continue";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSignup() {
        if (!validate()) return;
        setLoading(true); setFirebaseError("");
        try {
            await signUp(form.name, form.email, form.phone, form.password);
            router.push("/account");
        } catch (err: unknown) {
            const firebaseCode = typeof err === "object" && err !== null && "code" in err
                ? (err as { code?: string }).code
                : undefined;
            if (firebaseCode === "auth/email-already-in-use") setFirebaseError("An account with this email already exists.");
            else setFirebaseError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const field = (key: keyof SignupForm, placeholder: string, type = "text", icon: React.ReactNode) => (
        <div>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
                <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className={`w-full rounded-xl border pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition ${errors[key] ? "border-red-400" : "border-gray-200"}`}
                />
            </div>
            {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
        </div>
    );

    return (
        <div className="min-h-screen flex">
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
                    <h2 className="text-3xl font-extrabold text-white leading-tight mb-2">Join Bethora today</h2>
                    <p className="text-white/80 text-sm">Create your account and start shopping fashion for the whole family.</p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto">
                <div className="w-full max-w-sm">
                    <Link href="/" className="lg:hidden block mb-8 text-center">
                        <Image src="/android-chrome-192x192.png" alt="Bethora" height={40} width={0} className="w-auto h-10 mx-auto" />
                    </Link>
                    <h1 className="text-2xl font-bold mb-1">Create your account</h1>
                    <p className="text-sm text-gray-500 mb-6">Join Bethora and start shopping</p>

                    {firebaseError && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{firebaseError}</div>}

                    <div className="space-y-4">
                        {field("name", "Full Name", "text", <User size={16} />)}
                        {field("email", "Email Address", "email", <Mail size={16} />)}
                        {field("phone", "Phone Number (e.g. 08031234567)", "tel", <Phone size={16} />)}
                        <div>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPw ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="Password"
                                    className={`w-full rounded-xl border pl-9 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition ${errors.password ? "border-red-400" : "border-gray-200"}`}
                                />
                                <button onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password ? (
                                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                            ) : (
                                <p className="text-[11px] text-gray-400 mt-1">
                                    7+ characters, with uppercase, lowercase, a number &amp; a symbol.
                                </p>
                            )}
                        </div>
                        <div>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    value={form.confirm}
                                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                                    placeholder="Confirm Password"
                                    className={`w-full rounded-xl border pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition ${errors.confirm ? "border-red-400" : "border-gray-200"}`}
                                />
                            </div>
                            {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
                        </div>
                        <div>
                            <label className="flex items-start gap-2 cursor-pointer">
                                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-primary-400" />
                                <span className="text-xs text-gray-600">
                                    I agree to Bethora&apos;s{" "}
                                    <Link
                                        href="/legal/terms-of-service"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-primary-600 font-medium hover:underline"
                                    >
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="/legal/privacy-policy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-primary-600 font-medium hover:underline"
                                    >
                                        Privacy Policy
                                    </Link>
                                </span>
                            </label>
                            {errors.agree && <p className="text-xs text-red-500 mt-1">{errors.agree}</p>}
                        </div>
                        <button
                            onClick={handleSignup}
                            disabled={loading}
                            className="w-full bg-primary-400 text-gray-900 font-bold py-3 rounded-full hover:bg-primary-500 transition active:scale-95 disabled:opacity-60"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary-600 font-semibold hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}