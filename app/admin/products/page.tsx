"use client"

import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2} from "lucide-react"
import { useRouter } from "next/navigation"

const PRODUCTS = [
  { id: 1, name: "Classic White T-Shirt", category: "Men", price: 49, stock: 150, status: "Active" },
  { id: 2, name: "Black Slim Jeans", category: "Men", price: 89, stock: 45, status: "Active" },
  { id: 3, name: "Summer Dress", category: "Women", price: 79, stock: 0, status: "Out of Stock" },
  { id: 4, name: "Leather Handbag", category: "Accessories", price: 129, stock: 23, status: "Active" },
]

export default function ProductsPage() {
  const router = useRouter();
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button onClick={() => router.push("/admin/products/new")} className="bg-accent text-accent-foreground hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>     

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left p-4 font-semibold">Product Name</th>
              <th className="text-left p-4 font-semibold">Category</th>
              <th className="text-left p-4 font-semibold">Price</th>
              <th className="text-left p-4 font-semibold">Stock</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4 text-muted-foreground">{product.category}</td>
                <td className="p-4 font-semibold text-accent">${product.price}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
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
