"use client"

import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

const ORDERS = [
  { id: "ORD-001", customer: "John Doe", amount: "$138.00", date: "Dec 1, 2024", status: "Delivered" },
  { id: "ORD-002", customer: "Jane Smith", amount: "$89.00", date: "Nov 28, 2024", status: "In Transit" },
  { id: "ORD-003", customer: "Mike Johnson", amount: "$245.50", date: "Nov 20, 2024", status: "Delivered" },
  { id: "ORD-004", customer: "Sarah Williams", amount: "$156.25", date: "Nov 15, 2024", status: "Processing" },
]

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left p-4 font-semibold">Order ID</th>
              <th className="text-left p-4 font-semibold">Customer</th>
              <th className="text-left p-4 font-semibold">Amount</th>
              <th className="text-left p-4 font-semibold">Date</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((order) => (
              <tr key={order.id} className="border-b border-border hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-accent">{order.id}</td>
                <td className="p-4 font-medium">{order.customer}</td>
                <td className="p-4 font-semibold text-accent">{order.amount}</td>
                <td className="p-4 text-muted-foreground">{order.date}</td>
                <td className="p-4">
                  <select className="px-2 py-1 rounded border border-border text-sm cursor-pointer">
                    <option selected>{order.status}</option>
                    <option>Processing</option>
                    <option>In Transit</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>
                <td className="p-4">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
