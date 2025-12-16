"use client";

import ProductEditor from "@/components/product-editor"
import { useProduct } from "@/context/product-context";

export default async function Page({ params }: { params: { id: string } }) {
  const id = await params.id;

  const { getProduct } = useProduct();
  const product = getProduct(id);


  if (!product) {
    return <div>This Product does not exist.</div>;
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
          <p className="text-muted-foreground">Update product in your collection</p>
        </div>
      </div>

      {/* Add Product Form */}

      <div className="bg-white rounded-lg border border-border p-6 space-y-4">
        <ProductEditor data_to_edit={product} />
      </div>

    </div>
  )
}
