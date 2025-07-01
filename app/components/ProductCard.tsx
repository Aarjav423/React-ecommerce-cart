"use client"

import { useState } from "react"
import Image from "next/image"
import { type Product, useCart } from "../context/CartContext"
import { Check } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, state } = useCart()
  const [showAddedFeedback, setShowAddedFeedback] = useState(false)

  const cartItem = state.items.find((item) => item.id === product.id)
  const isAtMaxQuantity = cartItem && cartItem.quantity >= 10

  const handleAddToCart = () => {
    if (isAtMaxQuantity) {
      return
    }

    addToCart(product)
    setShowAddedFeedback(true)
    setTimeout(() => setShowAddedFeedback(false), 2000)
  }

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {showAddedFeedback && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg animate-bounce">
            <Check size={16} />
            Added to Cart!
          </div>
        )}

        {cartItem && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            {cartItem.quantity} in cart
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ${product.price}
            </span>
            <span className="text-xs text-gray-500">Free shipping</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAtMaxQuantity}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              isAtMaxQuantity
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {isAtMaxQuantity ? "Max Reached" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  )
}
