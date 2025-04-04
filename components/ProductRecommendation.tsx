import React from 'react'

interface ChatProduct {
  name: string
  description: string
  price: number
  image: string
  url: string
  category: string
  brand: string
}

interface ProductRecommendationProps {
  products: ChatProduct[]
}

export default function ProductRecommendation({ products }: ProductRecommendationProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {products.map((product, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          <a
                href={product.url}
                target="_blank"><img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          </a>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2"><a
                href={product.url}
                target="_blank">{product.name}</a></h3>
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-bold">{product.price}€</span>
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Ver en Bauhaus
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 