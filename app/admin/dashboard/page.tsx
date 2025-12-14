"use client"

import { ShoppingCart, Users, DollarSign, TrendingUp } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const STATS = [
  { label: "Revenue", value: "$24,580", change: "+12.5%", icon: DollarSign, color: "text-green-600" },
  { label: "Orders", value: "1,248", change: "+8.2%", icon: ShoppingCart, color: "text-blue-600" },
  { label: "Customers", value: "5,630", change: "+3.1%", icon: Users, color: "text-purple-600" },
  { label: "Growth", value: "15.8%", change: "+2.4%", icon: TrendingUp, color: "text-orange-600" },
]

const REVENUE_DATA = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 2000 },
  { month: "Apr", revenue: 2780 },
  { month: "May", revenue: 1890 },
  { month: "Jun", revenue: 2390 },
]

const TOP_CATEGORIES = [
  { category: "Men", sales: 4200 },
  { category: "Women", sales: 3800 },
  { category: "Accessories", sales: 2100 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your store performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <p className={`text-sm font-semibold ${stat.color}`}>{stat.change} from last month</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#f8a94e" strokeWidth={2} dot={{ fill: "#f8a94e" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Top Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={TOP_CATEGORIES} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" />
              <Tooltip />
              <Bar dataKey="sales" fill="#f8a94e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
