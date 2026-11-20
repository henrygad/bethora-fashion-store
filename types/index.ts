export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  sku: string;
  images: string[];
  tags: string[];
  sizes: string[];
  colors: string[];
  status: "Active" | "Draft" | "Out of Stock";
  rating?: number;
  reviewCount?: number;
  createdAt: number;
  updatedAt: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
  color?: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  lga: string;
  state: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  delivery: number;
  total: number;
  address: Address;
  paymentMethod: "whatsapp" | "pod" | "transfer";
  status:
    | "Pending Availability"
    | "Availability Confirmed"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Unavailable"
    | "Cancelled";
  createdAt: number;
  updatedAt?: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  createdAt: number;
  photoURL?: string;
}

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Abuja (FCT)",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export const CATEGORIES = [
  { id: "women", label: "Women's Fashion" },
  { id: "men", label: "Men's Fashion" },
  { id: "children", label: "Children's Wear" },
  { id: "shoes", label: "Shoes" },
  { id: "jewelry", label: "Jewelry" },
];

export const SUBCATEGORIES: Record<string, string[]> = {
  "Women's Fashion": ["Dresses", "Tops & Blouses", "Trousers & Skirts", "Suits", "Lingerie", "Outerwear"],
  "Men's Fashion": ["Senator Wear", "Kaftans", "Shirts", "Trousers", "Suits", "Outerwear"],
  "Children's Wear": ["Baby (0-2yrs)", "Girls", "Boys", "School Wear", "Sleepwear"],
  "Shoes": ["Heels", "Flats & Sandals", "Sneakers", "Formal Shoes", "Kids Shoes"],
  "Jewelry": ["Necklaces", "Earrings", "Bracelets", "Rings", "Sets"],
};

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
export const SHOE_SIZE_OPTIONS = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
export const COLOR_OPTIONS = [
  "Black", "White", "Red", "Yellow", "Blue",
  "Green", "Gold", "Silver", "Brown", "Multicolor",
];
