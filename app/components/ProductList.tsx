"use client"

import ProductCard from "./ProductCard"
import type { Product } from "../context/CartContext"

const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    image: "/images/headphones.jpg",
    description: "Studio-quality wireless headphones with active noise cancellation and 30-hour battery life.",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 399.99,
    image: "/images/smartwatch.jpg",
    description: "Advanced fitness tracking with heart rate monitoring, GPS, and comprehensive health insights.",
  },
  {
    id: 3,
    name: "Ergonomic Laptop Stand",
    price: 89.99,
    image: "/images/laptop-stand.jpg",
    description: "Premium aluminum laptop stand with adjustable height and excellent heat dissipation.",
  },
  {
    id: 4,
    name: "Portable Bluetooth Speaker",
    price: 149.99,
    image: "/images/speaker.jpg",
    description: "High-fidelity portable speaker with 360-degree sound and waterproof design for any adventure.",
  },
  {
    id: 5,
    name: "Multi-Port USB-C Hub",
    price: 79.99,
    image: "/images/usb-hub.jpg",
    description: "Professional USB-C hub with 4K HDMI, multiple USB ports, and 100W power delivery.",
  },
  {
    id: 6,
    name: "Precision Wireless Mouse",
    price: 69.99,
    image: "/images/mouse.jpg",
    description: "Ergonomic wireless mouse with precision tracking, customizable buttons, and long battery life.",
  },
]

export default function ProductList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
