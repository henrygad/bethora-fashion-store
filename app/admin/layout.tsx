"use client"

import type React from "react"

import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const router = useRouter();
  const { user, loading, error } = useAuth();

  useEffect(() => { 
    if (user && user.role !== "Admin") {
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
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

