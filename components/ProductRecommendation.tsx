import React from 'react'
import Image from 'next/image'
import type { ProductRecommendation as ProductRecommendationType } from '@/types'

interface ProductRecommendationProps {
  products: ProductRecommendationType[]
}

export default function ProductRecommendation({ products }: ProductRecommendationProps) {
  if (products.length === 0) {
    return null
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    // Only set the placeholder if the current src is not already the placeholder
    if (target.src !== '/images/placeholder.jpg') {
      target.src = '/images/placeholder.jpg'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos recomendados</h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <a href={product.url} target="_blank" rel="noopener noreferrer" className="block">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                    onError={handleImageError}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-green-800 font-medium">{product.name}</h4>
                  <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                  <p className="text-green-600 font-semibold mt-2">{product.price}</p>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
} 