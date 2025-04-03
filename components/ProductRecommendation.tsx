import React from 'react'
import Image from 'next/image'
import type { ProductRecommendation } from '@/types'

interface ProductRecommendationProps {
  products: ProductRecommendation[]
}

export default function ProductRecommendation({ products }: ProductRecommendationProps) {
  if (!products || products.length === 0) {
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
    <div className="mt-4 space-y-4">
      <h3 className="text-lg font-semibold text-green-800">Productos recomendados:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-90 transition-opacity"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={handleImageError}
                />
              </div>
              <div className="p-4">
                <h4 className="text-green-800 font-medium">{product.name}</h4>
                <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                <p className="text-green-600 font-semibold mt-2">{product.price}€</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
} 