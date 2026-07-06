"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || profile?.role !== "admin")) router.push("/");
    }, [user, profile, loading]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!user || profile?.role !== "admin") return null;

    return <>{children}</>;
}