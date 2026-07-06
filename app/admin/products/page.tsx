"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductEditor from "@/components/admin/ProductEditor";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "@/lib/firebase/firestore";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import type { Product } from "@/types";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

function statusStyle(status: string) {
    if (status === "Active") return "bg-green-50 text-green-700";
    if (status === "Out of Stock") return "bg-red-50 text-red-700";
    return "bg-gray-100 text-gray-600";
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState<Product | null | undefined>(undefined);
    const [toast, setToast] = useState("");

    async function load() {
        setProducts(await getAllProducts());
        setLoading(false);
    }

    useEffect(() => {
        getAllProducts().then((data) => { setProducts(data); setLoading(false); });
    }, []);

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(""), 1800);
    }

    async function handleSave(data: Partial<Product>) {
        if (editing) {
            await updateProduct(editing.id, data);
            showToast("Product updated");
        } else {
            await createProduct(data as Omit<Product, "id">);
            showToast("Product added");
        }
        setEditing(undefined);
        await load();
    }

    async function handleDelete(product: Product) {
        await deleteFromCloudinary(product.images);
        await deleteProduct(product.id);
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        showToast("Product deleted");
    }

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
                <AdminSidebar />
                <main className="flex-1 min-w-0 fade-in">
                    <div className="flex items-center justify-between mb-4 gap-3">
                        <h2 className="text-lg font-bold">Products</h2>
                        <button
                            onClick={() => setEditing(null)}
                            className="flex items-center gap-1.5 bg-primary-400 text-gray-900 text-xs font-semibold px-4 py-2 rounded-full hover:bg-primary-500 transition shrink-0"
                        >
                            <Plus size={14} /> Add Product
                        </button>
                    </div>

                    <div className="relative mb-4">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or SKU..."
                            className="w-full bg-white border border-gray-200 rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                        />
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="hidden sm:grid grid-cols-[56px_1fr_140px_80px_60px_80px_80px] gap-3 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                            <span></span>
                            <span>Product</span>
                            <span>Category</span>
                            <span>Price</span>
                            <span>Stock</span>
                            <span>Status</span>
                            <span>Actions</span>
                        </div>

                        {loading ? (
                            <div className="p-4 space-y-3">
                                {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                            </div>
                        ) : filtered.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm py-12">No products found.</p>
                        ) : (
                            filtered.map((p) => (
                                <div key={p.id} className="flex sm:grid sm:grid-cols-[56px_1fr_140px_80px_60px_80px_80px] items-center gap-3 px-4 py-3 border-t border-gray-100">
                                    <img src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                                    <div className="min-w-0 flex-1 sm:flex-none">
                                        <p className="text-sm font-medium truncate">{p.name}</p>
                                        {p.sku && <p className="text-xs text-gray-400">{p.sku}</p>}
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-sm text-gray-600 truncate">{p.category}</p>
                                        {p.subcategory && <p className="text-xs text-gray-400 truncate">{p.subcategory}</p>}
                                    </div>
                                    <span className="hidden sm:block text-sm font-semibold">₦{p.price.toLocaleString()}</span>
                                    <span className="hidden sm:block text-sm text-gray-600">{p.stock}</span>
                                    <span className={`hidden sm:inline-block text-[11px] font-semibold px-2 py-1 rounded-full w-fit ${statusStyle(p.status)}`}>{p.status}</span>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button onClick={() => setEditing(p)} className="p-1.5 text-gray-400 hover:text-gray-700 transition"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDelete(p)} className="p-1.5 text-gray-400 hover:text-red-500 transition"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>

            {editing !== undefined && (
                <ProductEditor
                    product={editing}
                    onSave={handleSave}
                    onClose={() => setEditing(undefined)}
                />
            )}

            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full shadow-lg slide-up z-50 whitespace-nowrap">
                    {toast}
                </div>
            )}
        </div>
    );
}