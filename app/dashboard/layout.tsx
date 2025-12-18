"use client"

import type React from "react"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, error } = useAuth();

   useEffect(() => { 
      if (user && user.role !== "Customer") {
        return router.push("/auth/login");
      }
    }, [user]);

  if (loading) {
    return <div>loading...</div>
  }

  if (error.trim()) {
    return <div>{error}</div>
  }


  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
