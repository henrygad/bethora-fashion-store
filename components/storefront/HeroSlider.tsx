"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
    {
        id: 1,
        title: "New Arrivals",
        subtitle: "Elegant styles for every occasion",
        category: "Women's Fashion",
        image: "https://images.unsplash.com/photo-1696962678565-bee84e6b9cb6?w=1600&q=80&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Shoe Sale",
        subtitle: "Up to 30% off selected shoes",
        category: "Shoes",
        image: "https://images.unsplash.com/photo-1534653299134-96a171b61581?w=1600&q=80&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Kids Collection",
        subtitle: "Comfy, stylish wears for your little ones",
        category: "Children's Wear",
        image: "https://images.unsplash.com/photo-1578897367107-2828e351c8a8?w=1600&q=80&auto=format&fit=crop",
    },
    {
        id: 4,
        title: "Shine Bright",
        subtitle: "Beautiful jewelry for every look",
        category: "Jewelry",
        image: "https://images.unsplash.com/photo-1758995115682-1452a1a9e35b?w=1600&q=80&auto=format&fit=crop",
    },
];

export default function HeroSlider() {
    const [slide, setSlide] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4500);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="relative h-64 sm:h-80 overflow-hidden">
            {SLIDES.map((s, i) => (
                <div
                    key={s.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.55)), url(${s.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="h-full flex flex-col items-center justify-center text-center px-6">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">
                            {s.title}
                        </h1>
                        <p className="text-white/90 mt-1 text-sm sm:text-base drop-shadow">
                            {s.subtitle}
                        </p>
                        <button
                            onClick={() => router.push(`/products?category=${encodeURIComponent(s.category)}`)}
                            className="mt-4 bg-primary-400 text-gray-900 px-5 py-2 rounded-full font-semibold text-sm hover:bg-primary-300 transition active:scale-95"
                        >
                            Shop Now
                        </button>
                        {/* <button className="bg-primary-700 p-10 border border-primary-500 text-primary-600">
                            Try out
                        </button> */}
                    </div>
                </div>
            ))}

            {/* Prev / Next arrows */}
            <button
                onClick={() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1.5 transition active:scale-90"
            >
                <ChevronLeft size={18} />
            </button>
            <button
                onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1.5 transition active:scale-90"
            >
                <ChevronRight size={18} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setSlide(i)}
                        className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-gray-900" : "w-1.5 bg-gray-900/30"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}