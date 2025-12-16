"use client";

import Controller from "@/lib/firebase/controler";
import { ProductType } from "@/type/product";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


const PRODUCTS = [
    { id: 1, name: "Classic White T-Shirt", category: "Men", price: 49, stock: 150, status: "Active" },
    { id: 2, name: "Black Slim Jeans", category: "Men", price: 89, stock: 45, status: "Active" },
    { id: 3, name: "Summer Dress", category: "Women", price: 79, stock: 0, status: "Out of Stock" },
    { id: 4, name: "Leather Handbag", category: "Accessories", price: 129, stock: 23, status: "Active" },
]

interface PropductTypeContext {
    products: ProductType[]
    getProduct: (id: string) => ProductType | undefined
    addProduct: (p: ProductType) => void
    deleteProduct: (id: string) => void
    updateProduct: (p: ProductType) => void
    loading: boolean,
    error: string
}

const ProductContext = createContext<PropductTypeContext | null>(null);

export default function ProductProvider({ children }: { children: ReactNode }) {

    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")


    useEffect(() => {
        (async () => {
            setLoading(true);

            try {
                setProducts(PRODUCTS);
                const products = await Controller.getAllData<ProductType>("products");
                if (products.length) setProducts(products);
            } catch (error) {
                setError("An error occured whiling fetching products");
            } finally {
                setLoading(false);
            }
        })()
    }, []);


    const addProduct = (p: ProductType) => {
        setProducts(pre => ([p, ...pre]));
    };
    const getProduct = (id: string) => {
        return products.find(p => p.id === id);
    };
    const updateProduct = (uP: ProductType) => {
        setProducts(pre => pre.map(p => p.id === uP.id ? { ...p, ...uP } : p));
    };
    const deleteProduct = (id: string) => {
        setProducts(pre => pre.filter(p => p.id !== id));
    };

    return (
        <ProductContext.Provider value={{ products, loading, error, addProduct, getProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};


export function useProduct() {
    const context = useContext(ProductContext);

    if (!context) {
        throw new Error("useProduct must be used inside ProductProvider");
    }

    return context;
}


