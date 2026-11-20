"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    ArrowLeft, ArrowRight, Check, Eye, Image as ImageIcon, Loader2,
    Package, Star, Tag, Upload, X,
} from "lucide-react";
import type { Product } from "@/types";
import { CATEGORIES, SUBCATEGORIES, SIZE_OPTIONS, SHOE_SIZE_OPTIONS, COLOR_OPTIONS } from "@/types";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { formatNairaForDisplay, formatNairaForEditing, parseNairaInput } from "@/lib/currency";

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

type FormState = typeof EMPTY;
type FieldError = "name" | "category" | "price" | "stock" | "images";
type FieldErrors = Partial<Record<FieldError, string>>;

const STEPS = [
    { title: "Product details", description: "Name, category and pricing", icon: Package },
    { title: "Photos & options", description: "Images, sizes and colours", icon: ImageIcon },
    { title: "Review & publish", description: "Check everything before saving", icon: Eye },
];

function initialForm(product: Product | null): FormState {
    if (!product) return { ...EMPTY, images: [], tags: [], sizes: [], colors: [] };
    return {
        name: product.name, category: product.category, subcategory: product.subcategory,
        description: product.description, price: String(product.price), stock: String(product.stock),
        sku: product.sku, images: [...product.images], tags: [...product.tags],
        sizes: [...product.sizes], colors: [...product.colors],
        status: (product.status === "Out of Stock" ? "Active" : product.status) as "Active" | "Draft",
    };
}

function validateDetails(form: FormState): FieldErrors {
    const errors: FieldErrors = {};
    if (!form.name.trim()) errors.name = "Enter a product name.";
    if (!form.category) errors.category = "Choose a category.";
    if (!form.price || Number(form.price) <= 0) errors.price = "Enter a price greater than zero.";
    if (form.stock === "" || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) {
        errors.stock = "Stock must be a whole number of zero or more.";
    }
    return errors;
}

function FieldMessage({ message }: { message?: string }) {
    return message ? <p className="mt-1 text-xs font-medium text-red-600" role="alert">{message}</p> : null;
}

export default function GuidedProductEditor({ product, onSave, onClose }: Props) {
    const [form, setForm] = useState<FormState>(() => initialForm(product));
    const [priceDisplay, setPriceDisplay] = useState(() => formatNairaForDisplay(initialForm(product).price));
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [tagInput, setTagInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [message, setMessage] = useState("");
    const [dirty, setDirty] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const requestClose = useCallback(() => {
        if (dirty && !window.confirm("Discard your unsaved product changes?")) return;
        onClose();
    }, [dirty, onClose]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !saving && !uploading) requestClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [requestClose, saving, uploading]);

    function updateForm(update: Partial<FormState>) {
        setForm((current) => ({ ...current, ...update }));
        setDirty(true);
    }

    function toggleSize(size: string) {
        updateForm({ sizes: form.sizes.includes(size) ? form.sizes.filter((value) => value !== size) : [...form.sizes, size] });
    }

    function toggleColor(color: string) {
        updateForm({ colors: form.colors.includes(color) ? form.colors.filter((value) => value !== color) : [...form.colors, color] });
    }

    function addTag() {
        const tag = tagInput.trim();
        if (tag && !form.tags.includes(tag)) updateForm({ tags: [...form.tags, tag] });
        setTagInput("");
    }

    async function handleFileUpload(files: FileList | File[]) {
        const selected = Array.from(files);
        if (selected.length === 0) return;
        if (form.images.length >= 8) {
            setMessage("You can add up to 8 product images.");
            return;
        }
        const remaining = 8 - form.images.length;
        const filesToUpload = selected.slice(0, remaining);
        setUploading(true);
        setMessage(selected.length > remaining ? `Only the first ${remaining} image${remaining === 1 ? "" : "s"} will be uploaded.` : "");
        try {
            const results = await Promise.all(filesToUpload.map((file) => uploadToCloudinary(file, "products")));
            updateForm({ images: [...form.images, ...results.map((result) => result.url)] });
            setErrors((current) => ({ ...current, images: undefined }));
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Images could not be uploaded. Please try again.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    function goNext() {
        setMessage("");
        if (step === 0) {
            const nextErrors = validateDetails(form);
            setErrors(nextErrors);
            if (Object.keys(nextErrors).length > 0) return;
        }
        if (step === 1 && form.images.length === 0) {
            setErrors((current) => ({ ...current, images: "Add at least one product image." }));
            return;
        }
        setStep((current) => Math.min(current + 1, STEPS.length - 1));
    }

    async function handleSave() {
        const nextErrors = validateDetails(form);
        if (form.images.length === 0) nextErrors.images = "Add at least one product image.";
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            setStep(nextErrors.images && Object.keys(nextErrors).length === 1 ? 1 : 0);
            setMessage("Please complete the highlighted fields.");
            return;
        }
        setSaving(true);
        setMessage("");
        try {
            const stock = Number(form.stock);
            await onSave({
                name: form.name.trim(), category: form.category, subcategory: form.subcategory,
                description: form.description.trim(), price: Number(form.price), stock,
                sku: form.sku.trim(), images: form.images, tags: form.tags, sizes: form.sizes,
                colors: form.colors, status: stock === 0 ? "Out of Stock" : form.status,
                updatedAt: Date.now(), ...(product ? {} : { createdAt: Date.now() }),
            });
            setDirty(false);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "The product could not be saved. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    const sizeOptions = form.category === "Shoes" ? SHOE_SIZE_OPTIONS : SIZE_OPTIONS;
    const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-100";
    const errorInputClass = "border-red-300 focus:border-red-400 focus:ring-red-50";

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-gray-950/45 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="product-editor-title">
            <div className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:max-w-4xl sm:rounded-l-3xl">
                <header className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-7">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">Product manager</p>
                        <h2 id="product-editor-title" className="truncate text-lg font-bold sm:text-xl">{product ? `Edit ${product.name}` : "Add a new product"}</h2>
                    </div>
                    <button type="button" onClick={requestClose} disabled={saving || uploading} aria-label="Close product editor" className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-800 disabled:opacity-40"><X size={21} /></button>
                </header>

                <div className="border-b border-gray-100 px-4 py-3 sm:hidden">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold"><span>{STEPS[step].title}</span><span className="text-gray-400">Step {step + 1} of {STEPS.length}</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-primary-400 transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
                </div>

                <div className="flex min-h-0 flex-1">
                    <aside className="hidden w-60 shrink-0 border-r border-gray-100 bg-gray-50/70 p-5 sm:block">
                        <nav aria-label="Product form steps" className="space-y-2">
                            {STEPS.map(({ title, description, icon: Icon }, index) => {
                                const complete = index < step;
                                return (
                                    <button key={title} type="button" onClick={() => index < step && setStep(index)} disabled={index > step} className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${index === step ? "bg-white shadow-sm ring-1 ring-gray-100" : index < step ? "hover:bg-white" : "opacity-50"}`}>
                                        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${index === step || complete ? "bg-primary-400 text-gray-950" : "bg-gray-200 text-gray-500"}`}>{complete ? <Check size={16} /> : <Icon size={16} />}</span>
                                        <span><span className="block text-sm font-semibold">{title}</span><span className="mt-0.5 block text-xs leading-4 text-gray-500">{description}</span></span>
                                    </button>
                                );
                            })}
                        </nav>
                        <div className="mt-6 rounded-2xl bg-primary-50 p-4 text-xs leading-5 text-primary-900"><strong className="block text-sm">Quick tip</strong>Clear photos and exact details reduce customer questions on WhatsApp.</div>
                    </aside>

                    <main className="min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-7">
                        {message && <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">{message}</div>}

                        {step === 0 && (
                            <section className="fade-in" aria-labelledby="details-heading">
                                <div className="mb-6"><h3 id="details-heading" className="text-xl font-bold">Product details</h3><p className="mt-1 text-sm text-gray-500">Start with the information customers need to identify the item.</p></div>
                                <div className="space-y-5">
                                    <div>
                                        <label htmlFor="product-name" className="mb-1.5 block text-sm font-semibold">Product name <span className="text-red-500">*</span></label>
                                        <input id="product-name" autoFocus value={form.name} onChange={(event) => { updateForm({ name: event.target.value }); setErrors((current) => ({ ...current, name: undefined })); }} placeholder="e.g. Satin evening dress" className={`${inputClass} ${errors.name ? errorInputClass : ""}`} aria-invalid={Boolean(errors.name)} />
                                        <FieldMessage message={errors.name} />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="product-category" className="mb-1.5 block text-sm font-semibold">Category <span className="text-red-500">*</span></label>
                                            <select id="product-category" value={form.category} onChange={(event) => { updateForm({ category: event.target.value, subcategory: "", sizes: [] }); setErrors((current) => ({ ...current, category: undefined })); }} className={`${inputClass} ${errors.category ? errorInputClass : ""}`} aria-invalid={Boolean(errors.category)}><option value="">Choose a category</option>{CATEGORIES.map((category) => <option key={category.label} value={category.label}>{category.label}</option>)}</select>
                                            <FieldMessage message={errors.category} />
                                        </div>
                                        <div>
                                            <label htmlFor="product-subcategory" className="mb-1.5 block text-sm font-semibold">Subcategory <span className="font-normal text-gray-400">(optional)</span></label>
                                            <select id="product-subcategory" value={form.subcategory} onChange={(event) => updateForm({ subcategory: event.target.value })} disabled={!form.category} className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}><option value="">{form.category ? "Choose a subcategory" : "Choose a category first"}</option>{(SUBCATEGORIES[form.category] || []).map((subcategory) => <option key={subcategory} value={subcategory}>{subcategory}</option>)}</select>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="product-description" className="mb-1.5 block text-sm font-semibold">Description <span className="font-normal text-gray-400">(optional)</span></label>
                                        <textarea id="product-description" value={form.description} onChange={(event) => updateForm({ description: event.target.value })} placeholder="Describe the fabric, fit, important features and care instructions..." rows={5} maxLength={1200} className={`${inputClass} resize-y`} />
                                        <p className="mt-1 text-right text-xs text-gray-400">{form.description.length}/1200</p>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div><label htmlFor="product-price" className="mb-1.5 block text-sm font-semibold">Price (₦) <span className="text-red-500">*</span></label><input id="product-price" type="text" inputMode="decimal" value={priceDisplay} onFocus={() => setPriceDisplay(formatNairaForEditing(form.price))} onBlur={() => setPriceDisplay(formatNairaForDisplay(form.price))} onChange={(event) => { const price = parseNairaInput(event.target.value); setPriceDisplay(price.formatted); updateForm({ price: price.raw }); setErrors((current) => ({ ...current, price: undefined })); }} placeholder="0.00" className={`${inputClass} ${errors.price ? errorInputClass : ""}`} aria-invalid={Boolean(errors.price)} /><p className="mt-1 text-xs text-gray-400">Thousands are separated automatically.</p><FieldMessage message={errors.price} /></div>
                                        <div><label htmlFor="product-stock" className="mb-1.5 block text-sm font-semibold">Available quantity <span className="text-red-500">*</span></label><input id="product-stock" type="number" inputMode="numeric" min="0" step="1" value={form.stock} onChange={(event) => { updateForm({ stock: event.target.value }); setErrors((current) => ({ ...current, stock: undefined })); }} placeholder="10" className={`${inputClass} ${errors.stock ? errorInputClass : ""}`} aria-invalid={Boolean(errors.stock)} /><FieldMessage message={errors.stock} /></div>
                                        <div><label htmlFor="product-sku" className="mb-1.5 block text-sm font-semibold">SKU <span className="font-normal text-gray-400">(optional)</span></label><input id="product-sku" value={form.sku} onChange={(event) => updateForm({ sku: event.target.value.toUpperCase() })} placeholder="DRESS-001" className={inputClass} /></div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {step === 1 && (
                            <section className="fade-in" aria-labelledby="media-heading">
                                <div className="mb-6"><h3 id="media-heading" className="text-xl font-bold">Photos & options</h3><p className="mt-1 text-sm text-gray-500">Add up to eight photos, then select the choices customers can request.</p></div>
                                <div>
                                    <p className="mb-2 text-sm font-semibold">Product photos <span className="text-red-500">*</span></p>
                                    {form.images.length > 0 && <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{form.images.map((image, index) => <div key={image} className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"><img src={image} alt={`${form.name || "Product"} preview ${index + 1}`} className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 pt-8">{index === 0 ? <span className="rounded-full bg-primary-400 px-2 py-1 text-[10px] font-bold text-gray-950">COVER</span> : <button type="button" onClick={() => updateForm({ images: [image, ...form.images.filter((_, imageIndex) => imageIndex !== index)] })} className="rounded-full bg-white/90 p-1.5 text-gray-700" aria-label={`Make image ${index + 1} the cover`} title="Make cover"><Star size={13} /></button>}<button type="button" onClick={() => updateForm({ images: form.images.filter((_, imageIndex) => imageIndex !== index) })} className="rounded-full bg-white/90 p-1.5 text-red-600" aria-label={`Remove image ${index + 1}`}><X size={13} /></button></div></div>)}</div>}
                                    <label onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); void handleFileUpload(event.dataTransfer.files); }} className={`flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-6 text-center transition ${dragging ? "border-primary-500 bg-primary-50" : errors.images ? "border-red-300 bg-red-50/30" : "border-gray-200 hover:border-primary-400 hover:bg-primary-50/40"}`}>
                                        {uploading ? <Loader2 size={24} className="mb-2 animate-spin text-primary-600" /> : <Upload size={24} className="mb-2 text-gray-400" />}<span className="text-sm font-semibold">{uploading ? "Uploading your photos..." : "Drop photos here or click to browse"}</span><span className="mt-1 text-xs text-gray-500">JPG, PNG or WebP · maximum 5MB each</span><input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading || form.images.length >= 8} onChange={(event) => event.target.files && void handleFileUpload(event.target.files)} className="sr-only" />
                                    </label>
                                    <FieldMessage message={errors.images} />
                                </div>
                                <div className="mt-7 border-t border-gray-100 pt-6"><h4 className="text-sm font-semibold">Available sizes</h4><p className="mb-3 mt-1 text-xs text-gray-500">Leave blank if the item does not have sizes.</p><div className="flex flex-wrap gap-2">{sizeOptions.map((size) => <button key={size} type="button" aria-pressed={form.sizes.includes(size)} onClick={() => toggleSize(size)} className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${form.sizes.includes(size) ? "border-primary-400 bg-primary-400 text-gray-950" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>{size}</button>)}</div></div>
                                <div className="mt-6"><h4 className="text-sm font-semibold">Available colours</h4><p className="mb-3 mt-1 text-xs text-gray-500">Select every colour customers can request.</p><div className="flex flex-wrap gap-2">{COLOR_OPTIONS.map((color) => <button key={color} type="button" aria-pressed={form.colors.includes(color)} onClick={() => toggleColor(color)} className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${form.colors.includes(color) ? "border-primary-400 bg-primary-400 text-gray-950" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>{color}</button>)}</div></div>
                                <div className="mt-7 border-t border-gray-100 pt-6"><div className="mb-2 flex items-center gap-2"><Tag size={16} /><h4 className="text-sm font-semibold">Search tags</h4></div>{form.tags.length > 0 && <div className="mb-3 flex flex-wrap gap-2">{form.tags.map((tag) => <span key={tag} className="flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-800">{tag}<button type="button" onClick={() => updateForm({ tags: form.tags.filter((value) => value !== tag) })} aria-label={`Remove ${tag} tag`}><X size={12} /></button></span>)}</div>}<div className="flex gap-2"><input value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTag(); } }} placeholder="e.g. New arrival" className={inputClass} /><button type="button" onClick={addTag} className="rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800">Add</button></div></div>
                            </section>
                        )}

                        {step === 2 && (
                            <section className="fade-in" aria-labelledby="review-heading">
                                <div className="mb-6"><h3 id="review-heading" className="text-xl font-bold">Review & publish</h3><p className="mt-1 text-sm text-gray-500">Confirm the product is ready, then choose whether customers can see it.</p></div>
                                <div className="overflow-hidden rounded-2xl border border-gray-200">
                                    <div className="flex gap-4 bg-gray-50 p-4 sm:p-5"><img src={form.images[0]} alt="Product cover preview" className="h-24 w-20 shrink-0 rounded-xl object-cover sm:h-32 sm:w-28" /><div className="min-w-0 flex-1"><span className="text-xs font-semibold uppercase tracking-wide text-primary-700">{form.category}{form.subcategory ? ` · ${form.subcategory}` : ""}</span><h4 className="mt-1 text-lg font-bold sm:text-xl">{form.name}</h4><p className="mt-2 text-xl font-extrabold">₦{Number(form.price).toLocaleString()}</p><p className="mt-1 text-xs text-gray-500">{form.stock} available{form.sku ? ` · SKU ${form.sku}` : ""}</p></div></div>
                                    <dl className="grid gap-px bg-gray-100 sm:grid-cols-3"><div className="bg-white p-4"><dt className="text-xs text-gray-500">Photos</dt><dd className="mt-1 text-sm font-semibold">{form.images.length}</dd></div><div className="bg-white p-4"><dt className="text-xs text-gray-500">Sizes</dt><dd className="mt-1 text-sm font-semibold">{form.sizes.length ? form.sizes.join(", ") : "Not applicable"}</dd></div><div className="bg-white p-4"><dt className="text-xs text-gray-500">Colours</dt><dd className="mt-1 text-sm font-semibold">{form.colors.length ? `${form.colors.length} selected` : "Not applicable"}</dd></div></dl>
                                </div>
                                <fieldset className="mt-7"><legend className="text-sm font-semibold">Store visibility</legend><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className={`cursor-pointer rounded-2xl border p-4 transition ${form.status === "Active" ? "border-primary-400 bg-primary-50 ring-2 ring-primary-100" : "border-gray-200"}`}><input type="radio" name="status" value="Active" checked={form.status === "Active"} onChange={() => updateForm({ status: "Active" })} className="sr-only" /><span className="flex items-center justify-between"><strong className="text-sm">Active</strong>{form.status === "Active" && <Check size={17} className="text-primary-700" />}</span><span className="mt-1 block text-xs leading-5 text-gray-500">Show this product in the store immediately.</span></label><label className={`cursor-pointer rounded-2xl border p-4 transition ${form.status === "Draft" ? "border-primary-400 bg-primary-50 ring-2 ring-primary-100" : "border-gray-200"}`}><input type="radio" name="status" value="Draft" checked={form.status === "Draft"} onChange={() => updateForm({ status: "Draft" })} className="sr-only" /><span className="flex items-center justify-between"><strong className="text-sm">Save as draft</strong>{form.status === "Draft" && <Check size={17} className="text-primary-700" />}</span><span className="mt-1 block text-xs leading-5 text-gray-500">Keep it hidden until you are ready to publish.</span></label></div>{Number(form.stock) === 0 && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-700">This product will be marked out of stock because its available quantity is zero.</p>}</fieldset>
                            </section>
                        )}
                    </main>
                </div>

                <footer className="flex items-center justify-between gap-3 border-t border-gray-100 bg-white px-4 py-4 sm:px-7">
                    <button type="button" onClick={() => step === 0 ? requestClose() : setStep((current) => current - 1)} disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50">{step === 0 ? "Cancel" : <><ArrowLeft size={16} /> Back</>}</button>
                    {step < STEPS.length - 1 ? <button type="button" onClick={goNext} disabled={uploading} className="inline-flex items-center gap-2 rounded-full bg-primary-400 px-5 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-primary-500 active:scale-[0.98] disabled:opacity-50">Continue <ArrowRight size={16} /></button> : <button type="button" onClick={() => void handleSave()} disabled={saving || uploading} className="inline-flex min-w-36 items-center justify-center gap-2 rounded-full bg-primary-400 px-5 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-primary-500 active:scale-[0.98] disabled:opacity-50">{saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Check size={16} /> {product ? "Save changes" : form.status === "Draft" ? "Save draft" : "Publish product"}</>}</button>}
                </footer>
            </div>
        </div>
    );
}
