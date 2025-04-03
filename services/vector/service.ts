import { Product } from '../../types/garden'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables if not already loaded
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const envPath = path.resolve(process.cwd(), '.env.local')
  dotenv.config({ path: envPath })
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Configuration
const EMBEDDING_MODEL = 'togethercomputer/m2-bert-80M-2k-retrieval' // Free retrieval-optimized model
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
        const errorText = await response.text()
        throw new Error(`Together API error: ${response.statusText}. ${errorText}`)
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

  private async createProductText(product: Product, categoryName?: string): Promise<string> {
    // Format specifications in a more natural way
    const specDescriptions = Object.entries(product.specifications).map(([key, value]) => {
      switch(key) {
        case 'power-type':
          return `funciona con energía ${value}`
        case 'cutting-width':
          return `tiene un ancho de corte de ${value}cm`
        case 'self-propelled':
          return value === 'sí' ? 'es autopropulsado' : 'requiere empuje manual'
        case 'grass-collection':
          return `sistema de recolección: ${value}`
        case 'capacity':
          return `capacidad de ${value} litros`
        case 'spray-type':
          return `tipo de pulverización: ${value}`
        case 'pressure-type':
          return `sistema de ${value}`
        case 'shoulder-strap':
          return value === 'sí' ? 'incluye correa para hombro' : 'sin correa para hombro'
        case 'power':
          return `${value} caballos de potencia`
        case 'fuel-type':
          return `motor de ${value}`
        case 'reversible':
          return value === 'sí' ? 'con marcha atrás' : 'sin marcha atrás'
        case 'working-width':
          return `ancho de trabajo de ${value}cm`
        default:
          return `${key}: ${value}`
      }
    }).join('. ')
    
    // If category name is not provided, try to get it from Supabase
    if (!categoryName) {
      const { data } = await supabase
        .from('categories')
        .select('name')
        .eq('id', product.categoryId)
        .single()
      
      if (data) {
        categoryName = data.name
      }
    }

    // Create a more natural description combining all information
    return `Este producto es un ${product.name} de la categoría ${categoryName || 'Desconocida'}. 
${product.description} 
Características técnicas: ${specDescriptions}.
Usos recomendados: ${this.getRecommendedUses(product, categoryName)}`
  }

  private getRecommendedUses(product: Product, categoryName?: string): string {
    const uses: string[] = []
    
    if (categoryName?.toLowerCase().includes('cortacésped')) {
      uses.push('mantenimiento de césped')
      uses.push('jardinería')
      if (product.specifications['cutting-width'] && parseInt(product.specifications['cutting-width']) > 35) {
        uses.push('jardines medianos y grandes')
      } else {
        uses.push('jardines pequeños')
      }
    }
    
    if (categoryName?.toLowerCase().includes('pulverizador')) {
      uses.push('aplicación de fertilizantes')
      uses.push('tratamientos fitosanitarios')
      uses.push('riego foliar')
      if (product.specifications['capacity'] && parseInt(product.specifications['capacity']) > 5) {
        uses.push('grandes superficies')
      }
    }
    
    if (categoryName?.toLowerCase().includes('motocultor')) {
      uses.push('preparación de tierra')
      uses.push('cultivo de huerto')
      if (product.specifications['power'] && parseInt(product.specifications['power']) > 4) {
        uses.push('trabajos intensivos')
      }
    }
    
    return uses.join(', ')
  }

  public async indexProduct(product: Product): Promise<void> {
    try {
      const productText = await this.createProductText(product)
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
  ): Promise<Array<Product & { similarity: number }>> {
    try {
      // Enhance the query with context
      const enhancedQuery = await this.enhanceQuery(query, categoryId)
      
      // Generate embedding for the enhanced query (not cached)
      const queryEmbedding = await this.generateEmbedding(enhancedQuery, true)

      // Perform vector similarity search in Supabase
      const { data, error } = await supabase.rpc('match_products', {
        query_embedding: queryEmbedding,
        search_category_id: categoryId,
        match_threshold: 0.65,
        match_count: limit
      })

      if (error) {
        console.error('Supabase RPC error:', error)
        throw error
      }

      if (!data || data.length === 0) {
        console.log('No matches found for query:', query)
        return []
      }

      return data.map((item: any) => ({
        id: item.product_id,
        name: item.metadata.name,
        description: item.metadata.description,
        categoryId: item.category_id,
        specifications: item.metadata.specifications,
        similarity: parseFloat((item.similarity * 100).toFixed(1))
      }))
    } catch (error) {
      console.error('Error searching similar products:', error)
      throw error
    }
  }

  private async enhanceQuery(query: string, categoryId: string): Promise<string> {
    // Get category name
    const { data: category } = await supabase
      .from('categories')
      .select('name')
      .eq('id', categoryId)
      .single()
    
    // Add category context to the query
    if (category?.name) {
      return `Busco ${category.name.toLowerCase()} para: ${query}`
    }
    
    return query
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