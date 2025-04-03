import fs from 'fs'
import path from 'path'
import { vectorService } from '../services/vector/service'
import { Product } from '../types/garden'

interface BauhausProduct {
  id: string
  name: string
  description: string
  category: {
    id: string
    name: string
    parent?: {
      id: string
      name: string
    }
  }
  specifications: Record<string, string>
  price: number
  stock: number
  images: string[]
}

interface BauhausCatalog {
  products: BauhausProduct[]
  categories: {
    id: string
    name: string
    parentId?: string
    level: number
  }[]
}

function mapBauhausToProduct(bauhausProduct: BauhausProduct): Product {
  return {
    id: bauhausProduct.id,
    name: bauhausProduct.name,
    description: bauhausProduct.description,
    categoryId: bauhausProduct.category.id,
    specifications: bauhausProduct.specifications
  }
}

async function main() {
  try {
    console.log('Starting catalog import...')

    // Read the catalog file
    const catalogPath = path.join(__dirname, '../data/Bauhaus.catalog_maquinaria.json')
    const catalogData: BauhausCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'))

    // Process products by category
    const productsByCategory = new Map<string, Product[]>()

    for (const product of catalogData.products) {
      const mappedProduct = mapBauhausToProduct(product)
      const categoryProducts = productsByCategory.get(product.category.id) || []
      categoryProducts.push(mappedProduct)
      productsByCategory.set(product.category.id, categoryProducts)
    }

    // Index products by category
    for (const [categoryId, products] of productsByCategory) {
      console.log(`Processing category ${categoryId} with ${products.length} products`)
      await vectorService.indexAllProducts(products)
      console.log(`Indexed ${products.length} products for category ${categoryId}`)
    }

    // Save category hierarchy for reference
    const categoryHierarchy = catalogData.categories.map(category => ({
      id: category.id,
      name: category.name,
      parentId: category.parentId,
      level: category.level,
      productCount: productsByCategory.get(category.id)?.length || 0
    }))

    // Save category hierarchy to a file
    const hierarchyPath = path.join(__dirname, '../data/category-hierarchy.json')
    fs.writeFileSync(hierarchyPath, JSON.stringify(categoryHierarchy, null, 2))

    console.log('Catalog import completed successfully')
    console.log('Category hierarchy saved to:', hierarchyPath)
  } catch (error) {
    console.error('Error during catalog import:', error)
    process.exit(1)
  }
}

main() 