"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import GuidedProductEditor from "@/components/admin/GuidedProductEditor";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "@/lib/firebase/firestore";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import type { Product } from "@/types";
import { AlertTriangle, Boxes, Edit2, FilePenLine, PackageCheck, Plus, Search, Trash2 } from "lucide-react";

function statusStyle(status: string) {
    if (status === "Active") return "bg-green-50 text-green-700";
    if (status === "Out of Stock") return "bg-red-50 text-red-700";
    return "bg-gray-100 text-gray-600";
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [editing, setEditing] = useState<Product | null | undefined>(undefined);
    const [toast, setToast] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        getAllProducts()
            .then(setProducts)
            .catch(() => showToast("Products could not be loaded"))
            .finally(() => setLoading(false));
    }, []);

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(""), 1800);
    }

    async function handleSave(data: Partial<Product>) {
        if (editing) {
            await updateProduct(editing.id, data);
            setProducts((current) => current.map((item) => item.id === editing.id ? { ...item, ...data } : item));
            showToast("Product updated");
        } else {
            const newProduct = data as Omit<Product, "id">;
            const productRef = await createProduct(newProduct);
            setProducts((current) => [{ id: productRef.id, ...newProduct }, ...current]);
            showToast("Product added");
        }
        setEditing(undefined);
    }

    async function handleDelete(product: Product) {
        if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
        setDeletingId(product.id);
        try {
            await deleteProduct(product.id);
            setProducts((prev) => prev.filter((p) => p.id !== product.id));
            await deleteFromCloudinary(product.images);
            showToast("Product deleted");
        } catch {
            showToast("Product could not be deleted");
        } finally {
            setDeletingId(null);
        }
    }

    const filtered = products.filter((p) =>
        (statusFilter === "All" || p.status === statusFilter) &&
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku?.toLowerCase().includes(search.toLowerCase()))
    );

    const activeCount = products.filter((product) => product.status === "Active").length;
    const draftCount = products.filter((product) => product.status === "Draft").length;
    const outOfStockCount = products.filter((product) => product.status === "Out of Stock").length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
                <AdminSidebar />
                <main className="flex-1 min-w-0 fade-in">
                    <div className="flex items-start justify-between mb-5 gap-3">
                        <div>
                            <h1 className="text-xl font-bold sm:text-2xl">Products</h1>
                            <p className="mt-1 text-sm text-gray-500">Add products and control what customers see in your store.</p>
                        </div>
                        <button
                            onClick={() => setEditing(null)}
                            className="flex items-center gap-1.5 bg-primary-400 text-gray-900 text-sm font-bold px-4 py-2.5 rounded-full hover:bg-primary-500 transition active:scale-[0.98] shrink-0 shadow-sm"
                        >
                            <Plus size={16} /> <span className="hidden sm:inline">Add Product</span><span className="sm:hidden">Add</span>
                        </button>
                    </div>

                    <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {[
                            { label: "All products", value: products.length, icon: Boxes, color: "text-gray-700 bg-gray-100" },
                            { label: "Active", value: activeCount, icon: PackageCheck, color: "text-green-700 bg-green-50" },
                            { label: "Drafts", value: draftCount, icon: FilePenLine, color: "text-amber-700 bg-amber-50" },
                            { label: "Out of stock", value: outOfStockCount, icon: AlertTriangle, color: "text-red-700 bg-red-50" },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="rounded-2xl border border-gray-100 bg-white p-3.5 sm:p-4">
                                <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${color}`}><Icon size={16} /></div>
                                <p className="text-xl font-bold">{loading ? "—" : value}</p>
                                <p className="text-xs text-gray-500">{label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or SKU..."
                                className="w-full bg-white border border-gray-200 rounded-full pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                            />
                        </div>
                        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter products by status" className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary-400">
                            <option value="All">All statuses</option>
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                            <option value="Out of Stock">Out of stock</option>
                        </select>
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
                            <div className="flex flex-col items-center px-4 py-14 text-center">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700"><Boxes size={22} /></div>
                                <p className="font-semibold">{products.length === 0 ? "Add your first product" : "No matching products"}</p>
                                <p className="mt-1 max-w-xs text-sm text-gray-500">{products.length === 0 ? "Create a product and choose when it should appear in the store." : "Try a different search or status filter."}</p>
                                {products.length === 0 && <button onClick={() => setEditing(null)} className="mt-4 rounded-full bg-primary-400 px-4 py-2 text-sm font-bold hover:bg-primary-500"><Plus size={15} className="mr-1 inline" /> Add product</button>}
                            </div>
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
                                        <button onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`} title="Edit product" className="p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-700 rounded-lg transition"><Edit2 size={14} /></button>
                                        <button onClick={() => void handleDelete(p)} disabled={deletingId === p.id} aria-label={`Delete ${p.name}`} title="Delete product" className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition disabled:opacity-40"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>

            {editing !== undefined && (
                <GuidedProductEditor
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
