"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import CategoryCreator from "./category-editor";
import Controller from "@/lib/firebase/controler";
import useUploadPreview from "@/hooks/use-upload";
import Image from "next/image";
import { Plus, Trash } from "lucide-react";
import { ProductType } from "@/type/product";
import { uploadImageToCloud } from "@/lib/cloudinary/services";
import { useProduct } from "@/context/product-context";

const productSchema = z.object({
    name: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Select a category"),
    subcategory: z.string().optional(),
    description: z.string().optional(),
    price: z.preprocess((v) => (v === "" ? 0 : Number(v)), z.number().nonnegative("Price must be >= 0")),
    discountPrice: z.preprocess((v) => (v === "" ? null : Number(v)), z.union([z.number().nonnegative("Discount must be >= 0"), z.null()])),
    stock: z.preprocess((v) => (v === "" ? 0 : Number(v)), z.number().int().nonnegative("Stock must be a non-negative integer")),
    sku: z.string().optional(),
    primaryImage: z.union([z.string(), z.null()]),
    otherImages: z.array(z.string()).default([]),
    colors: z.array(z.string()).default([]),
});

type ProductFormValues = z.infer<typeof productSchema>;


export default function ProductEditor({ data_to_edit }: { data_to_edit: ProductType | null }) {
    const router = useRouter();


    const { addProduct, updateProduct } = useProduct();


    const primaryImageRef = useRef<FileList | null>(null);
    const otherImagesRef = useRef<FileList | null>(null);
    const [primaryPreview, setPrimaryPreview] = useState<string | null>(null);
    const [otherPreviews, setOtherPreviews] = useState<string[]>([]);

    const [loadingCategories, setLoadingCategories] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    const [loading, setLoading] = useState(false);


    const uploadPreview = useUploadPreview();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: data_to_edit?.name ?? "",
            category: data_to_edit?.category ?? "",
            subcategory: data_to_edit?.subcategory ?? "",
            description: data_to_edit?.description ?? "",
            price: data_to_edit?.price ?? 0,
            discountPrice: data_to_edit?.discountPrice ?? null,
            stock: data_to_edit?.stock ?? 0,
            sku: data_to_edit?.sku ?? "",
            colors: data_to_edit?.colors ?? [],
            primaryImage: data_to_edit?.primaryImage ?? "",
            otherImages: data_to_edit?.otherImages ?? [],            
        },
    });


    // load categories
    useEffect(() => {
        (async () => {
            setLoadingCategories(true);
            try {
                const cats = await Controller.getAllData<{ id: string, name: string }>("categories");
                setCategories(cats);
            } catch (err) {
                console.error("Error loading categories:", err);
                toast.error("Failed to load categories");
            } finally {
                setLoadingCategories(false)
            }
        })();
    }, []);


    // auto-generate SKU
    const generateSKU = (productName: string) => {
        const prefix = productName.slice(0, 3).toUpperCase();
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${random}`;
    };

    // Create new product
    const createNewProduct = async (values: ProductFormValues) => {
        setLoading(true);
        try {

            // prepare product object
            const product: ProductType = {
                id: "",
                name: values.name,
                category: values.category,
                subcategory: values.subcategory || "",
                description: values.description || "",
                price: Number(values.price),
                discountPrice: values.discountPrice === null ? null : Number(values.discountPrice),
                stock: Number(values.stock),
                sku: values.sku || generateSKU(values.name),
                primaryImage: null,
                otherImages: [],
                colors: values.colors || [],
                createdAt: null,
                updatedAt: null,
                status: "Active"
            };

            // upload primary image           
            if (primaryImageRef.current &&
                primaryImageRef.current.length &&
                primaryImageRef.current[0] instanceof File) {
                const file: File = primaryImageRef.current[0];
                const uploaded = await uploadImageToCloud(file);
                product.primaryImage = uploaded.url;
                primaryImageRef.current = null;
            }

            // upload other images if present (FileList)
            if (otherImagesRef.current && otherImagesRef.current.length) {
                const files: File[] = Array.from(otherImagesRef.current as FileList);
                const uploadedList = [];
                for (const f of files) {
                    const uploaded = await uploadImageToCloud(f);
                    uploadedList.push(uploaded.url);
                }
                product.otherImages = uploadedList;
                otherImagesRef.current = null;
            }

            // create new product doc
            const id = await Controller.createData("products", product);

            // get created product doc
            const newProduct = await Controller.getData<ProductType>("products", id);
            addProduct(newProduct);

            toast.success("Product created");
            form.reset();
            router.push("/admin/products");

        } catch (err) {
            console.error("Create product error:", err);
            toast.error("Error creating product");
        } finally {
            setLoading(false);
        }
    };

    // Update product
    const editProduct = async (edit: ProductType, values: ProductFormValues) => {
        setLoading(true);
        try {

            // prepare product object
            const product: ProductType = { ...edit, ...values };

            // upload primary image           
            if (primaryImageRef.current &&
                primaryImageRef.current.length &&
                primaryImageRef.current[0] instanceof File) {
                const file: File = primaryImageRef.current[0];
                const uploaded = await uploadImageToCloud(file);
                product.primaryImage = uploaded.url;
                primaryImageRef.current = null;
            }

            // upload other images if present (FileList)
            if (otherImagesRef.current && otherImagesRef.current.length) {
                const files: File[] = Array.from(otherImagesRef.current as FileList);
                const uploadedList = [];
                for (const f of files) {
                    const uploaded = await uploadImageToCloud(f);
                    uploadedList.push(uploaded.url);
                }
                product.otherImages = uploadedList;
                otherImagesRef.current = null;
            }

            // create new product doc
            await Controller.updateData("products", product.id, product);
            updateProduct(product);

            toast.success("Product Upadte!");
            form.reset();
            router.back();

        } catch (err) {
            console.error("Update product error:", err);
            toast.error("Error updating product");
        } finally {
            setLoading(false);
        }
    };

    // Submit product
    async function onSubmit(values: ProductFormValues) {        
        if (data_to_edit) {
            await editProduct(data_to_edit, values);
        } else {
            await createNewProduct(values);

        }
    };



    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E.g. Linen Summer Shirt" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Category / Subcategory */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((c) => (
                                                    <SelectItem key={c.id} value={c.name}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="subcategory"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subcategory</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select subcategory" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((c) => (
                                                    <SelectItem key={c.id} value={c.name}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Colors */}
                        <FormField
                            control={form.control}
                            name="colors"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Available Colors</FormLabel>

                                    <div className="space-y-3">
                                        {/* Existing Colors */}
                                        {field.value?.length > 0 && (
                                            <div className="space-y-2">
                                                {field.value.map((color: string, index: number) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <div
                                                            className="w-6 h-6 rounded border"
                                                            style={{ backgroundColor: color || "#f0f0f0" }}
                                                        ></div>

                                                        <Input
                                                            value={color}
                                                            onChange={(e) => {
                                                                const newColors = [...field.value]
                                                                newColors[index] = e.target.value
                                                                field.onChange(newColors)
                                                            }}
                                                            placeholder="Enter color (e.g., red, #ff9900)"
                                                        />

                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            onClick={() => {
                                                                const newColors = field.value.filter((_, i) => i !== index)
                                                                field.onChange(newColors)
                                                            }}
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Add New Color Button */}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => field.onChange([...(field.value || []), ""])}
                                            className="w-full"
                                        >
                                            <Plus className="w-4 h-4 mr-2" /> Add Color
                                        </Button>
                                    </div>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Write a short product description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Price / Discount / Stock */}
                        <div className="grid sm:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} value={field.value > 0 ? field.value : ""} placeholder="N60,000" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="discountPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount Price (optional)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} value={field.value ?? ""} placeholder="N6,000" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} value={field.value > 0 ? field.value : ""} placeholder="10" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* SKU */}
                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SKU</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Optional SKU" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Images with previews */}
                        <div className="space-y-6">

                            {/* Primary image */}
                            <div>
                                <FormLabel>Primary Image (thumbnail)</FormLabel>

                                {!primaryPreview ? (
                                    <div className="mt-2">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const files = e.target.files;                                                
                                                primaryImageRef.current = files;
                                                uploadPreview(files, (urls) => setPrimaryPreview(urls[0]));
                                            }}
                                            className="border-dotted border-2 border-gray-700"
                                        />
                                    </div>
                                ) : (
                                    <div className="mt-3">
                                        <Image
                                            src={primaryPreview}
                                            className="w-40 h-40 object-cover rounded-md border"
                                            alt="Primary Preview"
                                            height={160}
                                            width={160}
                                        />

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            className="mt-2"
                                            onClick={() => {
                                                setPrimaryPreview(null);                                                
                                                primaryImageRef.current = null
                                            }}
                                        >
                                            Remove Image
                                        </Button>
                                    </div>
                                )}

                                <FormMessage />
                            </div>

                            {/* Other Images */}
                            <div>
                                <FormLabel>Other Images (multiple)</FormLabel>

                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="mt-2 border-dotted border-2 border-gray-700"
                                    onChange={(e) => {
                                        const files = e.target.files;                                        
                                        otherImagesRef.current = files;
                                        uploadPreview(files, (urls) => setOtherPreviews(urls));
                                    }}
                                />

                                {/* Preview Grid */}
                                {otherPreviews.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-3">
                                        {otherPreviews.map((img, idx) => (
                                            <div key={idx} className="relative group">
                                                <Image
                                                    src={img}
                                                    className="w-full h-full max-h-40 object-contain rounded-md border"
                                                    alt={`Preview ${idx}`}
                                                    height={128}
                                                    width={128}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newPrev = otherPreviews.filter((_, i) => i !== idx);
                                                        setOtherPreviews(newPrev);

                                                        // sync form FileList removal logic
                                                        const fileList = Array.from((otherImagesRef.current || []) as File[]);
                                                        const newList = fileList.filter((_, i) => i !== idx);

                                                        // rebuild FileList manually
                                                        const dt = new DataTransfer();
                                                        newList.forEach((f) => dt.items.add(f));
                                                        otherImagesRef.current = dt.files;                                                        
                                                    }}
                                                    className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <FormMessage />
                            </div>
                        </div>


                        <div className="flex gap-3 items-center">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Create Product"}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    form.reset();
                                    setPrimaryPreview("");
                                    setOtherPreviews([]);
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>

            {/* Right column: Category manager + preview */}
            <div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold mb-3">Category Manager</h3>
                    <CategoryCreator onCreated={(cat) => {
                        setCategories(pre => ([cat, ...pre]));
                    }}
                    />
                </div>

                <div className="mt-6 bg-white p-4 rounded-lg shadow">
                    <h4 className="font-medium mb-2">Category Preview</h4>
                    {
                        loadingCategories ? <div>loading...</div> :
                            <>
                                {categories.length === 0 &&
                                    <div className="text-sm text-muted-foreground">No categories yet.</div>
                                }
                                <ul className="space-y-2 text-sm">
                                    {categories.map((c) => (
                                        <li key={c.id}>
                                            <div className="font-semibold">{c.name}</div>
                                        </li>
                                    ))}
                                </ul>
                            </>
                    }

                </div>
            </div>
        </div>
    );
};
