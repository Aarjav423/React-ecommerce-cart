"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"

export interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
}

export interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "INCREASE_QUANTITY"; payload: number }
  | { type: "DECREASE_QUANTITY"; payload: number }
  | { type: "REMOVE_FROM_CART"; payload: number }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (product: Product) => void
  increaseQuantity: (id: number) => boolean
  decreaseQuantity: (id: number) => boolean
  removeFromCart: (id: number) => void
} | null>(null)

const MAX_QUANTITY = 10
const MIN_QUANTITY = 1

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        if (existingItem.quantity >= MAX_QUANTITY) {
          return state // Don't add if already at max
        }
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) } : item,
        )
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        }
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }]
        return {
          items: newItems,
          total: calculateTotal(newItems),
        }
      }
    }

    case "INCREASE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload && item.quantity < MAX_QUANTITY ? { ...item, quantity: item.quantity + 1 } : item,
      )
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      }
    }

    case "DECREASE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload && item.quantity > MIN_QUANTITY ? { ...item, quantity: item.quantity - 1 } : item,
      )
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      }
    }

    case "REMOVE_FROM_CART": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      }
    }

    default:
      return state
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  const addToCart = (product: Product) => {
    dispatch({ type: "ADD_TO_CART", payload: product })
  }

  const increaseQuantity = (id: number): boolean => {
    const item = state.items.find((item) => item.id === id)
    if (item && item.quantity >= MAX_QUANTITY) {
      return false // Indicates max quantity reached
    }
    dispatch({ type: "INCREASE_QUANTITY", payload: id })
    return true
  }

  const decreaseQuantity = (id: number): boolean => {
    const item = state.items.find((item) => item.id === id)
    if (item && item.quantity <= MIN_QUANTITY) {
      return false // Indicates min quantity reached
    }
    dispatch({ type: "DECREASE_QUANTITY", payload: id })
    return true
  }

  const removeFromCart = (id: number) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id })
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
