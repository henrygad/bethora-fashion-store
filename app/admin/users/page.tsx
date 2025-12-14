"use client"

import { Mail, Trash2 } from "lucide-react"

const USERS = [
  { id: 1, name: "John Doe", email: "john@example.com", joinDate: "Jan 15, 2024", orders: 5, spent: "$450.00" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", joinDate: "Feb 20, 2024", orders: 3, spent: "$280.00" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", joinDate: "Mar 10, 2024", orders: 8, spent: "$720.00" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", joinDate: "Apr 5, 2024", orders: 2, spent: "$150.00" },
]

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground">Manage customer accounts</p>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left p-4 font-semibold">Name</th>
              <th className="text-left p-4 font-semibold">Email</th>
              <th className="text-left p-4 font-semibold">Join Date</th>
              <th className="text-left p-4 font-semibold">Orders</th>
              <th className="text-left p-4 font-semibold">Total Spent</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </td>
                <td className="p-4 text-muted-foreground">{user.joinDate}</td>
                <td className="p-4 font-semibold">{user.orders}</td>
                <td className="p-4 font-semibold text-accent">{user.spent}</td>
                <td className="p-4">
                  <button className="p-2 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
