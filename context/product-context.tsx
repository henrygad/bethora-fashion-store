"use client";

import Controller from "@/lib/firebase/controler";
import { ProductType } from "@/type/product";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


const ALL_PRODUCTS: ProductType[] = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    category: "Men",
    gender: "men",
    price: 49,
    primaryImage: "/white-tshirt.png",
    rating: 4.8,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: 2,
    status: "Active",
    discountPrice: null,
    createdAt: new Date(),
    otherImages: ["/white-tshirt-front.jpg", "/white-tshirt-back.jpg", "/white-tshirt-detail.jpg"],
    description: "A timeless classic. This premium cotton t-shirt is perfect for any occasion. Made with 100% organic cotton, it's soft, breathable, and designed to last.",
    colors: ["White", "Black", "Navy", "Gray"],
    reviews: 128,
    details: ["Material: 100% Organic Cotton", "Weight: 180gsm", "Fit: Regular", "Care: Machine wash cold"],
  },
  {
    id: "2",
    name: "Black Slim Jeans",
    category: "Men",
    gender: "men",
    price: 89,
    primaryImage: "/black-jeans.jpg",
    rating: 4.5,
    stock: 2,
    status: "Active",
    discountPrice: null,
    createdAt: new Date(),
    reviews: 84,
    otherImages: ["/black-jeans-front.jpg", "/black-jeans-back.jpg", "/black-jeans-detail.jpg"],
    description:
      "Experience comfort meets style with these premium slim-fit jeans. Perfect for casual outings or dressing up.",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Black", "Blue", "Gray"],
    details: ["Material: 98% Cotton, 2% Elastane", "Fit: Slim", "Care: Machine wash cold, turn inside out"],
  },
  {
    id: "3",
    name: "Navy Blazer",
    category: "Men",
    gender: "men",
    price: 149,
    primaryImage: "/navy-blazer.jpg",
    rating: 4.9,
    sizes: ["S", "M", "L", "XL"],
    stock: 2,
    status: "Active",
    discountPrice: null,
    createdAt: new Date()
  },
  {
    id: "4",
    name: "Summer Dress",
    category: "Women",
    gender: "women",
    price: 79,
    primaryImage: "/summer-dress.jpg",
    rating: 4.9,
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 2,
    status: "Active",
    discountPrice: null,
    createdAt: new Date()
  },
  {
    id: "5",
    name: "White Sneakers",
    category: "Women",
    gender: "women",
    price: 95,
    primaryImage: "/white-sneakers.jpg",
    rating: 4.6,
    sizes: ["5", "6", "7", "8", "9", "10"],
    stock: 2,
    status: "Active",
    discountPrice: null,
    createdAt: new Date()
  },
  {
    id: "6",
    name: "Yoga Pants",
    category: "Women",
    gender: "women",
    price: 65,
    primaryImage: "/yoga-pants.jpg",
    rating: 4.7,
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 2,
    status: "Active",
    discountPrice: null,
    createdAt: new Date()
  },
  {
    id: "7",
    name: "Leather Handbag",
    category: "Accessories",
    gender: "women",
    price: 129,
    primaryImage: "/leather-handbag.jpg",
    rating: 4.7,
    sizes: ["One Size"],
    stock: 2,
    status: "Active",
    discountPrice: null,
    createdAt: new Date()
  },
  {
    id: "8",
    name: "Sunglasses",
    category: "Accessories",
    gender: "unisex",
    price: 99,
    primaryImage: "/stylish-sunglasses.png",
    rating: 4.4,
    sizes: ["One Size"],
    stock: 2,
    status: "Active",
    discountPrice: null,
    createdAt: new Date()
  },
  {
    id: "9",
    name: "Wool Scarf",
    category: "Accessories",
    gender: "unisex",
    price: 45,
    primaryImage: "/wool-scarf.jpg",
    rating: 4.8,
    sizes: ["One Size"],
    stock: 2,
    status: "Active",
    discountPrice: null,
    createdAt: new Date()
  },
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
        setProducts(ALL_PRODUCTS);

        (async () => {
            setLoading(true);
            try {
                const products = await Controller.getAllData<ProductType>("products");
                // if (products.length) setProducts(products);
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


