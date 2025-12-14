"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, ShoppingCart, Users, BarChart3, LogOut } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <>
      <div className="w-64 p-6 min-h-screen"></div>
      <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 fixed inset-0">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-accent-foreground">B</span>
          </div>
          <span className="font-bold">Bethora Admin</span>
        </div>

        <nav className="space-y-2">
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive("/admin/dashboard") && pathname === "/admin/dashboard"
                ? "bg-accent text-accent-foreground"
                : "text-gray-300 hover:bg-slate-800"
              }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </Link>

          <Link
            href="/admin/products"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive("/admin/products") ? "bg-accent text-accent-foreground" : "text-gray-300 hover:bg-slate-800"
              }`}
          >
            <Package className="w-5 h-5" />
            <span>Products</span>
          </Link>

          <Link
            href="/admin/orders"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive("/admin/orders") ? "bg-accent text-accent-foreground" : "text-gray-300 hover:bg-slate-800"
              }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Orders</span>
          </Link>

          <Link
            href="/admin/users"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive("/admin/users") ? "bg-accent text-accent-foreground" : "text-gray-300 hover:bg-slate-800"
              }`}
          >
            <Users className="w-5 h-5" />
            <span>Users</span>
          </Link>
        </nav>

        <div className="border-t border-slate-700 mt-8 pt-8">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 transition w-full">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
