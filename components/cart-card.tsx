import { useCart } from "@/context/cart-context";
import CartType from "@/type/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";


export default function CartCard({ cart }: { cart: CartType }) {
    const { addToCart, removeFromCart, deleteCart} = useCart()
    return (
        <div className="border rounded-lg p-4 flex gap-4">
            <Image
                src={cart.primaryImage || "/placeholder.svg"}
                alt={cart.name}
                className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                width={200}
                height={200}
            />
            <div className="flex-1">
                <h3 className="font-semibold text-foreground">{cart.name}</h3>
                <p className="text-accent font-semibold">${cart.price}</p>
            </div>
            <div className="flex flex-col items-end carts-end gap-2">
                <div className="flex carts-center gap-2">
                    <button
                        onClick={() => removeFromCart(cart.id)}
                        className="px-2 py-1 border border-border rounded hover:bg-gray-50"

                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center">{cart.quantity}</span>
                    <button
                        onClick={() => addToCart(cart)}
                        className="px-2 py-1 border border-border rounded hover:bg-gray-50"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
                <button
                    onClick={() => deleteCart(cart.id)}
                    className="text-destructive hover:text-destructive/80"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
