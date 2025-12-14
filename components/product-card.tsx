import Link from "next/link"
import { Heart } from "lucide-react"

interface ProductCardProps {
  id: string
  name: string
  category: string
  price: number
  image: string
  rating: number
}

export function ProductCard({ id, name, category, price, image, rating }: ProductCardProps) {
  return (
    <Link href={`/product/${id}`}>
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4 h-64">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <button className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-accent hover:text-accent-foreground transition">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{category}</p>
          <h3 className="font-semibold text-foreground group-hover:text-accent transition">{name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-accent">${price}</span>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">⭐ {rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
