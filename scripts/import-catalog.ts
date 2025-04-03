import { createClient } from '@supabase/supabase-js'
import { vectorService } from '../services/vector/service'
import { gardenService } from '../services/garden/service'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '..', '.env.local')
dotenv.config({ path: envPath })

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'TOGETHER_API_KEY'
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`)
    process.exit(1)
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function importCatalog() {
  try {
    console.log('Starting catalog import...')
    
    // Get all products from the garden service
    const categories = gardenService.getProductCategories()
    const products = categories.flatMap(category => 
      gardenService.getProductsByCategory(category.id)
    )

    console.log(`Found ${products.length} products to import`)

    // Index all products and get token estimation
    const stats = await vectorService.indexAllProducts(products)
    
    console.log('Import completed!')
    console.log('Statistics:')
    console.log(`- Products processed: ${stats.productsProcessed}`)
    console.log(`- Total tokens: ${stats.totalTokens}`)
    console.log(`- Estimated cost: $${stats.estimatedCost.toFixed(6)}`)

    // Get embedding stats
    const embeddingStats = await vectorService.getEmbeddingStats()
    console.log('\nEmbedding Statistics:')
    console.log(`- Total products in database: ${embeddingStats.totalProducts}`)
    console.log(`- Cached embeddings: ${embeddingStats.cachedEmbeddings}`)
    console.log(`- Cache hit rate: ${embeddingStats.cacheHitRate.toFixed(2)}%`)
    console.log(`- Estimated tokens: ${embeddingStats.estimatedTokens}`)
    console.log(`- Estimated cost: $${embeddingStats.estimatedCost.toFixed(6)}`)

  } catch (error) {
    console.error('Error importing catalog:', error)
    process.exit(1)
  }
}

importCatalog() 