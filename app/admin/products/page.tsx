"use client"

import AdminProductCard from "@/components/admin-product-card"
import { Button } from "@/components/ui/button"
import { useProduct } from "@/context/product-context"
import { Plus} from "lucide-react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter();

  const { products, loading } = useProduct();

  if (loading) {
    return <div>loading...</div>
  }

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
            {products.map((product) => (
              <AdminProductCard product={product} />              
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
