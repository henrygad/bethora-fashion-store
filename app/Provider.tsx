"use client";

import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react'

export default function Provider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            if (token.role === "Admin") {
                return router.push("/admin/dashboard");
            }

            return router.push("/dashboard");
        }

       // return router.push("/auth/login");
    }, [token]);

    return (
        <>
            {children}           
        </>
    )
}
