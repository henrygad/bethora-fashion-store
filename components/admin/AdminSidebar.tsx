"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, ArrowLeft } from "lucide-react";

const NAV = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/customers", label: "Customers", icon: Users },
];

export default function AdminSidebar() {
    const pathname = usePathname();

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
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
                >
                    <ArrowLeft size={17} /> Back to Store
                </Link>
            </div>
        </aside>
    );
}