export interface ProductCategory {
  id: string
  name: string
  description: string
  specifications: CategorySpecification[]
}

export interface CategorySpecification {
  id: string
  name: string
  type: 'single' | 'range'
  options?: string[]
  min?: number
  max?: number
  step?: number
}

export interface Product {
  id: string
  name: string
  description: string
  categoryId: string
  specifications: Record<string, string | number>
  price?: number
  imageUrl?: string
} 