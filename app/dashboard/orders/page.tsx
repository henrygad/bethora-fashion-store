"use client"

import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

const ORDERS = [
  {
    id: "ORD-001",
    date: "Dec 1, 2024",
    total: "$138.00",
    status: "Delivered",
    items: 3,
    image: "/white-tshirt.png",
  },
  {
    id: "ORD-002",
    date: "Nov 28, 2024",
    total: "$89.00",
    status: "In Transit",
    items: 1,
    image: "/black-jeans.jpg",
  },
  {
    id: "ORD-003",
    date: "Nov 20, 2024",
    total: "$245.50",
    status: "Delivered",
    items: 4,
    image: "/summer-dress.jpg",
  },
]

export default function OrdersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
        <p className="text-muted-foreground">View and track your orders</p>
      </div>

      <div className="space-y-4">
        {ORDERS.map((order) => (
          <div key={order.id} className="border border-border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
              <img src={order.image || "/placeholder.svg"} alt={order.id} className="w-16 h-16 object-cover rounded" />
              <div>
                <p className="font-semibold text-foreground">{order.id}</p>
                <p className="text-sm text-muted-foreground">{order.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Items</p>
                <p className="font-semibold">{order.items}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-semibold text-accent">{order.total}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={`font-semibold ${order.status === "Delivered" ? "text-green-600" : "text-blue-600"}`}>
                  {order.status}
                </p>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
