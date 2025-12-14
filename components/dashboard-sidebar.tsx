"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, User, MapPin, LogOut } from "lucide-react"

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <aside className="w-64 bg-white border-r border-border min-h-screen p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
          <span className="text-sm font-bold text-accent-foreground">B</span>
        </div>
        <span className="font-bold">Bethora</span>
      </div>

      <nav className="space-y-2">
        <Link
          href="/dashboard/orders"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive("/dashboard/orders") ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-gray-50"
          }`}
        >
          <Package className="w-5 h-5" />
          <span>Orders</span>
        </Link>

        <Link
          href="/dashboard/profile"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive("/dashboard/profile") ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-gray-50"
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>

        <Link
          href="/dashboard/addresses"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive("/dashboard/addresses") ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-gray-50"
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span>Addresses</span>
        </Link>
      </nav>

      <div className="border-t border-border mt-8 pt-8">
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-red-50 transition w-full">
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
