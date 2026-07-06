"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { hasCookieConsent, setCookieConsent } from "@/lib/cookies";

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!hasCookieConsent()) setVisible(true);
    }, []);

    function accept() {
        setCookieConsent();
        setVisible(false);
    }

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-gray-900 text-white px-4 py-4 fade-in">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
                <p className="text-xs sm:text-sm text-gray-300 flex-1 text-center sm:text-left leading-relaxed">
                    We use cookies to keep you signed in, remember your cart, and improve your shopping experience. By
                    continuing to use Bethora, you agree to our{" "}
                    <Link href="/legal/cookie-policy" className="text-primary-400 font-medium hover:underline">
                        Cookie Policy
                    </Link>.
                </p>
                <button
                    onClick={accept}
                    className="shrink-0 bg-primary-400 text-gray-900 text-sm font-bold px-6 py-2.5 rounded-full hover:bg-primary-500 transition active:scale-95"
                >
                    Accept
                </button>
            </div>
        </div>
    );
}
