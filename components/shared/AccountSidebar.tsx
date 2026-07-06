"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, UserCircle, Package, MapPin, Heart, LogOut } from "lucide-react";
import { logOut } from "@/lib/firebase/auth";

const NAV = [
    { href: "/account", label: "Overview", icon: User },
    { href: "/account/profile", label: "My Profile", icon: UserCircle },
    { href: "/account/orders", label: "My Orders", icon: Package },
    { href: "/account/addresses", label: "Addresses", icon: MapPin },
    { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

export default function AccountSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    async function handleLogout() {
        await logOut();
        router.push("/");
    }

    return (
        <aside className="hidden sm:block w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-3 sticky top-20">
                {NAV.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition mb-1 ${pathname === href ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <Icon size={17} />
                        {label}
                    </Link>
                ))}
                <div className="border-t border-gray-100 my-2" />
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
                >
                    <LogOut size={17} /> Sign Out
                </button>
            </div>
        </aside>
    );
}