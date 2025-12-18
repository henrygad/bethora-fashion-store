export interface ProductType {
    id: string;                     // Firestore document ID
    name: string;                   // Product title
    category: string;               // Main category
    subcategory?: string;           // Optional subcategory
    description?: string;            // Full product description

    price: number;                  // Original price
    discountPrice: number | null;         // Optional discounted price

    stock: number;                  // Inventory quantity
    sku?: string;                    // Stock Keeping Unit (unique identifier)

    primaryImage: string | null;           // URL of the main image
    otherImages?: string[];          // URLs of additional images

    colors?: string[];               // List of color names ("red", "blue", "#F4A300", etc.)

    createdAt: Date | null;         // Timestamp from Firebase
    updatedAt?: Date | null;        // Optional update timestamp

    status: "Active" | "Out of stock" | "Sold" | "Inactive"

    gender?: string; // adding this later to product editor
    sizes?: string[]; // adding this later to product editor
    details?: string[]; // adding this later to product editor
    rating?: number;
    reviews?: number
}
