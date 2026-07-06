"use client";

import Link from "next/link";

const CATEGORIES = [
    { label: "Women's Fashion", emoji: "👗" },
    { label: "Men's Fashion", emoji: "👔" },
    { label: "Children's Wear", emoji: "👶" },
    { label: "Shoes", emoji: "👠" },
    { label: "Jewelry", emoji: "💍" },
];

export default function CategoryRow() {
    return (
        <div className="grid grid-cols-5 gap-2">
            {CATEGORIES.map((c) => (
                <Link
                    key={c.label}
                    href={`/products?category=${encodeURIComponent(c.label)}`}
                    className="flex flex-col items-center gap-2 group"
                >
                    <div className="w-full aspect-square max-w-[64px] mx-auto rounded-2xl bg-primary-50 flex items-center justify-center text-2xl group-hover:bg-primary-100 transition">
                        {c.emoji}
                    </div>
                    <span className="text-xs text-gray-600 text-center leading-tight">{c.label}</span>
                </Link>
            ))}
        </div>
    );
}