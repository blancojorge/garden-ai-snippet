import { vectorService } from '../services/vector/service'
import { gardenService } from '../services/garden/service'
import { Product } from '../types/garden'

async function main() {
  try {
    console.log('Starting vector search initialization...')

    // Get all product categories
    const categories = gardenService.getProductCategories()
    
    // Get products for each category
    for (const category of categories) {
      console.log(`Processing category: ${category.name}`)
      
      // Get products for this category
      const products = gardenService.getProductsByCategory(category.id)
      
      // Index all products
      await vectorService.indexAllProducts(products)
      console.log(`Indexed ${products.length} products for category ${category.name}`)
    }

    console.log('Vector search initialization completed successfully')
  } catch (error) {
    console.error('Error during vector search initialization:', error)
    process.exit(1)
  }
}

main() 