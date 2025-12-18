import { ProductType } from "./product";

interface CartType extends ProductType {
    quantity: number
    totalPrice: number
    totalDiscountPrice: number | null
}

export default CartType;