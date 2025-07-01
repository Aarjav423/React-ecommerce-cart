"use client"

import { useState } from "react"
import { X, Plus, Minus, Trash2, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useCart } from "../context/CartContext"

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { state, increaseQuantity, decreaseQuantity, removeFromCart } = useCart()
  const [feedback, setFeedback] = useState<{ type: "max" | "min" | "removed"; message: string } | null>(null)
  const [itemToRemove, setItemToRemove] = useState<number | null>(null)

  const showFeedback = (type: "max" | "min" | "removed", message: string) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleIncreaseQuantity = (id: number) => {
    const success = increaseQuantity(id)
    if (!success) {
      showFeedback("max", "Maximum quantity (10) reached for this item")
    }
  }

  const handleDecreaseQuantity = (id: number) => {
    const success = decreaseQuantity(id)
    if (!success) {
      showFeedback("min", "Minimum quantity is 1. Use remove button to delete item.")
    }
  }

  const handleRemoveItem = (id: number) => {
    setItemToRemove(id)
  }

  const confirmRemoval = () => {
    if (itemToRemove) {
      const item = state.items.find((item) => item.id === itemToRemove)
      removeFromCart(itemToRemove)
      showFeedback("removed", `${item?.name} removed from cart`)
      setItemToRemove(null)
    }
  }

  const cancelRemoval = () => {
    setItemToRemove(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
              <p className="text-sm text-gray-600">
                {state.items.length} {state.items.length === 1 ? "item" : "items"}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Feedback Messages */}
          {feedback && (
            <div
              className={`mx-6 mt-4 p-4 rounded-xl flex items-center gap-3 ${
                feedback.type === "max"
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : feedback.type === "min"
                    ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                    : "bg-green-50 text-green-800 border border-green-200"
              }`}
            >
              <AlertCircle size={20} />
              <span className="font-medium">{feedback.message}</span>
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center text-gray-500 mt-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                <p className="text-sm">Add some amazing products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-lg font-bold text-blue-600">${item.price}</p>
                      <p className="text-sm text-gray-500">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
                        <button
                          onClick={() => handleDecreaseQuantity(item.id)}
                          className={`p-2 rounded-md transition-colors ${
                            item.quantity <= 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>

                        <button
                          onClick={() => handleIncreaseQuantity(item.id)}
                          className={`p-2 rounded-md transition-colors ${
                            item.quantity >= 10
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                          disabled={item.quantity >= 10}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t bg-gradient-to-r from-blue-50 to-purple-50 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-lg text-gray-600">Total Amount:</span>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${state.total.toFixed(2)}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{state.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                  <p>Free shipping included</p>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Removal Confirmation Modal */}
      {itemToRemove && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Remove Item</h3>
              <p className="text-gray-600">Are you sure you want to remove this item from your cart?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelRemoval}
                className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoval}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
