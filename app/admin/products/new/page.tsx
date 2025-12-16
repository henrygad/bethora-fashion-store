import ProductEditor from "@/components/product-editor"

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
          <p className="text-muted-foreground">Create new product to your collection</p>
        </div>
      </div>

      {/* Add Product Form */}

      <div className="bg-white rounded-lg border border-border p-6 space-y-4">
        <ProductEditor data_to_edit={null} />
      </div>

    </div>
  )
}
