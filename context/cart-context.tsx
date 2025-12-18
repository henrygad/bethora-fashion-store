"use client";

import CartType from "@/type/cart";
import { ProductType } from "@/type/product";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { toast } from "sonner";


interface CartTypeContext {
    carts: CartType[];
    totalQuantity: number;
    addToCart: (p: ProductType) => void;
    removeFromCart: (id: string) => void;
    deleteCart: (id: string) => void;
    loading: boolean;
    error: string;
}

const cartContext = createContext<CartTypeContext | null>(null);


export default function CartProvider({ children }: { children: ReactNode }) {

    const [carts, setCarts] = useState<CartType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const carts = await JSON.parse(localStorage.getItem("carts") || "[]") as CartType[];
                if (carts.length) setCarts(carts);
            } catch (error) {
                setError("An error occured whiling fetching carts");
            } finally {
                setLoading(false);
            }
        })()
    }, []);

    const addToCart = (p: ProductType) => {
        let payload: CartType[] = [];

        if (carts.find(c => c.id === p.id)) {
            payload = carts.map(c =>
                c.id === p.id ?
                    {
                        ...c,
                        quantity: c.quantity + 1,
                        totalPrice: c.totalPrice + c.price,
                        totalDiscountPrice: (c.totalDiscountPrice || 0) + (c.discountPrice || 0)
                    } :
                    c
            )
        } else {
            payload = [
                {
                    ...p,
                    quantity: 1,
                    totalPrice: p.price,
                    totalDiscountPrice: p.discountPrice,
                },
                ...carts
            ]
        }


        setCarts(payload)
        localStorage.setItem("carts", JSON.stringify(payload));
        toast.success("Product add to cart!");

    };

    const removeFromCart = (id: string) => {
        const ex = carts.find(c => c.id === id);
        let payload;

        if (ex && ex.quantity > 1) {
            payload = carts.map(c =>
                c.id === ex.id ?
                    {
                        ...c,
                        quantity: c.quantity - 1,
                        totalPrice: c.quantity - c.price,
                        totalDiscountPrice: (c.totalDiscountPrice || 0) - (c.discountPrice || 0),
                    } :
                    c
            );

        } else {
            payload = carts.filter(c => c.id !== id);
        }

        setCarts(payload);
        localStorage.setItem("carts", JSON.stringify(payload));
        toast.warning("Product remove from cart!");
    };

    const deleteCart = (id: string) => {
        const payload = carts.filter(c => c.id !== id);
        setCarts(payload);
        localStorage.setItem("carts", JSON.stringify(payload));
        toast.warning("Product remove from cart!");
    };

    const totalQuantity = carts.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (
        <cartContext.Provider value={{ carts, totalQuantity, loading, error, addToCart, removeFromCart, deleteCart }}>
            {children}
        </cartContext.Provider>
    );

};


export function useCart() {
    const context = useContext(cartContext);

    if (!context) {
        throw new Error("usecart must be used inside cartProvider");
    }

    return context;
};

