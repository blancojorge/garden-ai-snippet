import { Product } from '@/types/garden'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Configuration
const EMBEDDING_MODEL = 'togethercomputer/m2-bert-80M-8k-base' // Free model
const BATCH_SIZE = 10 // Number of products to process in each batch
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const TOKEN_COST_PER_MILLION = 0.01 // $0.01 per 1M tokens

interface ProductEmbedding {
  id: string
  product_id: string
  category_id: string
  embedding: number[]
  metadata: {
    name: string
    description: string
    specifications: Record<string, string>
  }
}

interface CachedEmbedding {
  embedding: number[]
  timestamp: number
}

interface TokenEstimation {
  totalTokens: number
  estimatedCost: number
  productsProcessed: number
}

export class VectorService {
  private static instance: VectorService
  private embeddingsCache: Map<string, CachedEmbedding> = new Map()
  private tokenEstimations: Map<string, number> = new Map()

  private constructor() {}

  public static getInstance(): VectorService {
    if (!VectorService.instance) {
      VectorService.instance = new VectorService()
    }
    return VectorService.instance
  }

  private estimateTokens(text: string): number {
    // Rough estimation: ~1 token per 4 characters for Spanish text
    return Math.ceil(text.length / 4)
  }

  private async generateEmbedding(text: string, isQuery: boolean = false): Promise<number[]> {
    // For queries, we don't cache as they're unique
    if (!isQuery) {
      const cached = this.embeddingsCache.get(text)
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.embedding
      }
    }

    try {
      const response = await fetch('https://api.together.xyz/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: text,
          model: EMBEDDING_MODEL
        })
      })

      if (!response.ok) {
        throw new Error(`Together API error: ${response.statusText}`)
      }

      const data = await response.json()
      const embedding = data.data[0].embedding
      
      // Only cache product embeddings, not queries
      if (!isQuery) {
        this.embeddingsCache.set(text, {
          embedding,
          timestamp: Date.now()
        })
      }
      
      return embedding
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw error
    }
  }

  private createProductText(product: Product): string {
    const specifications = Object.entries(product.specifications)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')
    
    return `${product.name}. ${product.description}. ${specifications}`
  }

  public async indexProduct(product: Product): Promise<void> {
    try {
      const productText = this.createProductText(product)
      const tokens = this.estimateTokens(productText)
      this.tokenEstimations.set(product.id, tokens)
      
      const embedding = await this.generateEmbedding(productText)

      const productEmbedding: ProductEmbedding = {
        id: `product_${product.id}`,
        product_id: product.id,
        category_id: product.categoryId,
        embedding,
        metadata: {
          name: product.name,
          description: product.description,
          specifications: product.specifications
        }
      }

      // Store in Supabase
      const { error } = await supabase
        .from('product_embeddings')
        .upsert(productEmbedding)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error indexing product:', error)
      throw error
    }
  }

  public async searchSimilarProducts(
    query: string,
    categoryId: string,
    limit: number = 5
  ): Promise<Product[]> {
    try {
      // Generate embedding for the query (not cached)
      const queryEmbedding = await this.generateEmbedding(query, true)

      // Perform vector similarity search in Supabase
      const { data, error } = await supabase.rpc('match_products', {
        query_embedding: queryEmbedding,
        category_id: categoryId,
        match_threshold: 0.7,
        match_count: limit
      })

      if (error) {
        throw error
      }

      return data.map((item: any) => ({
        id: item.product_id,
        name: item.metadata.name,
        description: item.metadata.description,
        categoryId: item.category_id,
        specifications: item.metadata.specifications
      }))
    } catch (error) {
      console.error('Error searching similar products:', error)
      throw error
    }
  }

  public async indexAllProducts(products: Product[]): Promise<TokenEstimation> {
    let totalTokens = 0
    
    // Process products in batches
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE)
      console.log(`Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(products.length / BATCH_SIZE)}`)
      
      await Promise.all(batch.map(product => this.indexProduct(product)))
      
      // Update token count
      batch.forEach(product => {
        totalTokens += this.tokenEstimations.get(product.id) || 0
      })
    }

    return {
      totalTokens,
      estimatedCost: (totalTokens / 1_000_000) * TOKEN_COST_PER_MILLION,
      productsProcessed: products.length
    }
  }

  public async getEmbeddingStats(): Promise<{
    totalProducts: number
    cachedEmbeddings: number
    cacheHitRate: number
    estimatedTokens: number
    estimatedCost: number
  }> {
    const { count } = await supabase
      .from('product_embeddings')
      .select('*', { count: 'exact', head: true })

    const totalProducts = count || 0
    const cachedEmbeddings = this.embeddingsCache.size
    const cacheHitRate = totalProducts > 0 ? (cachedEmbeddings / totalProducts) * 100 : 0
    
    // Calculate total tokens from estimations
    const estimatedTokens = Array.from(this.tokenEstimations.values())
      .reduce((sum, tokens) => sum + tokens, 0)
    const estimatedCost = (estimatedTokens / 1_000_000) * TOKEN_COST_PER_MILLION

    return {
      totalProducts,
      cachedEmbeddings,
      cacheHitRate,
      estimatedTokens,
      estimatedCost
    }
  }
}

export const vectorService = VectorService.getInstance() 