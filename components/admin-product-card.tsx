import { useProduct } from "@/context/product-context";
import Controller from "@/lib/firebase/controler";
import { ProductType } from "@/type/product";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";


export default function AdminProductCard({ product }: { product: ProductType }) {
    const router = useRouter();

    const { deleteProduct } = useProduct();

    const handleEdit = () => {
        router.push(`/admin/products/edit/${product.id}`);
    };
    const handleDelete = async (id: string) => {
        await Controller.deleteData("products", id);
        deleteProduct(id);
    };

    return (<tr key={product.id} className="border-b border-border hover:bg-gray-50 transition">
        <td className="p-4 font-medium">{product.name}</td>
        <td className="p-4 text-muted-foreground">{product.category}</td>
        <td className="p-4 font-semibold text-accent">${product.price}</td>
        <td className="p-4">{product.stock}</td>
        <td className="p-4">
            <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${product.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
            >
                {product.status}
            </span>
        </td>
        <td className="p-4 flex gap-2">
            <button
                onClick={handleEdit}
                className="p-2 hover:bg-gray-100 rounded"
            >
                <Edit2 className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleDelete(product.id)}
                className="p-2 hover:bg-red-50 rounded"
            >
                <Trash2 className="w-4 h-4 text-destructive" />
            </button>
        </td>
    </tr>
    )
}
