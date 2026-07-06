"use client";

import { useState } from "react";
import { X, Image as ImageIcon, Tag, Upload, Loader2 } from "lucide-react";
import type { Product } from "@/types";
import { CATEGORIES, SUBCATEGORIES, SIZE_OPTIONS, SHOE_SIZE_OPTIONS, COLOR_OPTIONS } from "@/types";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface Props {
    product: Product | null;
    onSave: (data: Partial<Product>) => Promise<void>;
    onClose: () => void;
}

const EMPTY = {
    name: "", category: "", subcategory: "", description: "",
    price: "", stock: "", sku: "", images: [] as string[],
    tags: [] as string[], sizes: [] as string[], colors: [] as string[],
    status: "Active" as "Active" | "Draft",
};

type TextField = "name" | "price" | "stock" | "sku";

function initialForm(product: Product | null) {
    if (!product) return { ...EMPTY };
    return {
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        description: product.description,
        price: String(product.price),
        stock: String(product.stock),
        sku: product.sku,
        images: product.images,
        tags: product.tags,
        sizes: product.sizes,
        colors: product.colors,
        status: (product.status === "Out of Stock" ? "Active" : product.status) as "Active" | "Draft",
    };
}

export default function ProductEditor({ product, onSave, onClose }: Props) {
    const [form, setForm] = useState(() => initialForm(product));
    const [tagInput, setTagInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    function toggleSize(s: string) {
        setForm((f) => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s] }));
    }

    function toggleColor(c: string) {
        setForm((f) => ({ ...f, colors: f.colors.includes(c) ? f.colors.filter((x) => x !== c) : [...f.colors, c] }));
    }

    function addTag() {
        const t = tagInput.trim();
        if (t && !form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t] }));
        setTagInput("");
    }

    async function handleFileUpload(files: FileList | null) {
        if (!files || files.length === 0) return;
        setUploading(true);
        try {
            const results = await Promise.all(
                Array.from(files).map((file) => uploadToCloudinary(file, "products"))
            );
            setForm((f) => ({ ...f, images: [...f.images, ...results.map((r) => r.url)] }));
        } finally {
            setUploading(false);
        }
    }

    async function handleSave() {
        if (!form.name || !form.category || !form.price || form.stock === "") return;
        setSaving(true);
        const stock = Number(form.stock);
        await onSave({
            name: form.name,
            category: form.category,
            subcategory: form.subcategory,
            description: form.description,
            price: Number(form.price),
            stock,
            sku: form.sku,
            images: form.images.length ? form.images : ["https://images.unsplash.com/photo-1620114884229-65d21f8c9423?w=400&q=80"],
            tags: form.tags,
            sizes: form.sizes,
            colors: form.colors,
            status: stock === 0 ? "Out of Stock" : form.status,
            updatedAt: Date.now(),
            ...(product ? {} : { createdAt: Date.now() }),
        });
        setSaving(false);
    }

    const sizeOptions = form.category === "Shoes" ? SHOE_SIZE_OPTIONS : SIZE_OPTIONS;

    const inp = (key: TextField, placeholder: string, type = "text") => (
        <input
            type={type}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            placeholder={placeholder}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
        />
    );

    return (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl p-5 max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-base">{product ? "Edit Product" : "Add New Product"}</h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700"><X size={20} /></button>
                </div>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Basic Info</p>
                        <div className="space-y-3">
                            {inp("name", "Product Name")}
                            <div className="grid sm:grid-cols-2 gap-3">
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: "", sizes: [] })}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 bg-white transition"
                                >
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map((c) => <option key={c.label} value={c.label}>{c.label}</option>)}
                                </select>
                                <select
                                    value={form.subcategory}
                                    onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                                    disabled={!form.category}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 bg-white transition disabled:bg-gray-50 disabled:text-gray-400"
                                >
                                    <option value="">Select Subcategory</option>
                                    {(SUBCATEGORIES[form.category] || []).map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Product description — fabric, fit, care instructions..."
                                rows={3}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition resize-none"
                            />
                            <div className="grid grid-cols-3 gap-3">
                                {inp("price", "Price (₦)", "number")}
                                {inp("stock", "Stock Qty", "number")}
                                {inp("sku", "SKU")}
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                            <ImageIcon size={13} /> Product Images
                        </p>
                        {form.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {form.images.map((img, i) => (
                                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))}
                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                                        >
                                            <X size={14} className="text-white" />
                                        </button>
                                        {i === 0 && (
                                            <span className="absolute bottom-0 left-0 right-0 bg-primary-400 text-[9px] font-bold text-center text-gray-900">MAIN</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-4 text-sm text-gray-500 cursor-pointer hover:border-primary-400 hover:text-gray-700 transition">
                            {uploading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={16} /> Upload images to Cloudinary
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                disabled={uploading}
                                onChange={(e) => handleFileUpload(e.target.files)}
                                className="hidden"
                            />
                        </label>
                        <p className="text-[11px] text-gray-400 mt-1">First image is the main product photo.</p>
                    </div>

                    {/* Tags */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                            <Tag size={13} /> Tags
                        </p>
                        {form.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {form.tags.map((t) => (
                                    <span key={t} className="flex items-center gap-1 bg-primary-400 text-gray-900 text-xs font-medium px-2.5 py-1 rounded-full">
                                        {t}
                                        <button onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))}><X size={11} /></button>
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addTag()}
                                placeholder="e.g. New Arrival, Sale, Trending — press Enter"
                                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                            />
                            <button onClick={addTag} className="bg-gray-900 text-white text-sm font-semibold px-4 rounded-xl hover:bg-gray-800 transition shrink-0">
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Variants */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Variants</p>
                        <p className="text-xs text-gray-500 mb-1.5">Sizes</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {sizeOptions.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => toggleSize(s)}
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${form.sizes.includes(s) ? "bg-primary-400 border-primary-400 text-gray-900" : "bg-white border-gray-200 text-gray-600"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mb-1.5">Colors</p>
                        <div className="flex flex-wrap gap-2">
                            {COLOR_OPTIONS.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => toggleColor(c)}
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${form.colors.includes(c) ? "bg-primary-400 border-primary-400 text-gray-900" : "bg-white border-gray-200 text-gray-600"
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Visibility */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Visibility</p>
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Draft" })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 bg-white transition"
                        >
                            <option value="Active">Active — visible in store</option>
                            <option value="Draft">Draft — hidden from store</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving || uploading}
                    className="w-full bg-primary-400 text-gray-900 font-bold py-3 rounded-full hover:bg-primary-500 transition active:scale-95 mt-6 disabled:opacity-60"
                >
                    {saving ? "Saving..." : product ? "Save Changes" : "Add Product"}
                </button>
            </div>
        </div>
    );
}