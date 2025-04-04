import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Product, ProductCategory } from '../../types/garden'
import { gardenService } from '../garden/service'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local')
dotenv.config({ path: envPath })

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'TOGETHER_API_KEY'
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

export class VectorService {
  private supabase: SupabaseClient
  private embeddingCache: Map<string, number[]>

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    this.embeddingCache = new Map()
  }

  private async getRelevantCategories(query: string, categories: ProductCategory[]): Promise<string[]> {
    const prompt = `Given the following user query and list of product categories, analyze which categories are most relevant to the query. Return ONLY a JSON array containing the IDs of the relevant categories, with no additional text or explanation.

User Query: "${query}"

Available Categories:
${categories.map(cat => `- ${cat.name} (${cat.id}): ${cat.description}`).join('\n')}

IMPORTANT: Return ONLY a JSON array of category IDs, with no additional text. For example: ["cortacespedes-electricos", "desbrozadoras"]`

    try {
      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that analyzes queries and returns relevant category IDs. You must ONLY return a valid JSON array of strings, with no additional text or explanation.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 100,
          response_format: { type: "json_object" }
        })
      })

      if (!response.ok) {
        throw new Error(`Together API error: ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content.trim()
      
      try {
        const result = JSON.parse(content)
        const categoryIds = result.categories || result
        if (!Array.isArray(categoryIds)) {
          throw new Error('Invalid response format')
        }
        return categoryIds
      } catch (error) {
        console.error('Error parsing AI response:', error)
        return []
      }
    } catch (error) {
      console.error('Error getting relevant categories:', error)
      return []
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // Check cache first
    const cached = this.embeddingCache.get(text)
    if (cached) {
      return cached
    }

    try {
      const response = await fetch('https://api.together.xyz/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'togethercomputer/m2-bert-80M-8k-base',
          input: text,
          encoding_format: 'float'
        })
      })

      if (!response.ok) {
        throw new Error(`Together API error: ${response.statusText}`)
      }

      const data = await response.json()
      const embedding = data.data[0].embedding

      // Cache the embedding
      this.embeddingCache.set(text, embedding)

      return embedding
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw error
    }
  }

  private createProductText(product: Product): string {
    const specs = Object.entries(product.specifications)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')
    
    return `${product.name}. ${product.description}. ${specs}`
  }

  async indexProduct(product: Product): Promise<void> {
    try {
      const productText = this.createProductText(product)
      const embedding = await this.generateEmbedding(productText)

      const { error } = await this.supabase
        .from('product_embeddings')
        .upsert({
          product_id: product.id,
          category_id: product.categoryId,
          embedding,
          name: product.name,
          description: product.description,
          specifications: product.specifications
        })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error indexing product:', error)
      throw error
    }
  }

  async searchSimilarProducts(query: string, categoryId?: string, limit: number = 5): Promise<Product[]> {
    try {
      // If no specific category is provided, use AI to find relevant categories
      let searchCategoryId = categoryId
      if (!searchCategoryId) {
        const categories = await gardenService.getProductCategories()
        const relevantCategories = await this.getRelevantCategories(query, categories)
        
        if (relevantCategories.length === 0) {
          console.log('No relevant categories found for query:', query)
          // Fall back to searching across all categories with a higher threshold
          const { data, error } = await this.supabase.rpc('match_products', {
            query_embedding: await this.generateEmbedding(query),
            match_threshold: 0.75, // Higher threshold for cross-category search
            match_count: limit,
            search_category_id: null // Search across all categories
          })

          if (error) throw error
          return data || []
        }
        
        // Use the most relevant category
        searchCategoryId = relevantCategories[0]
        console.log(`Selected category for query "${query}": ${searchCategoryId}`)
      }

      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(query)
      
      // Search within the selected category with a lower threshold
      const { data, error } = await this.supabase.rpc('match_products', {
        query_embedding: queryEmbedding,
        match_threshold: 0.65, // Lower threshold for category-specific search
        match_count: limit,
        search_category_id: searchCategoryId
      })

      if (error) {
        throw error
      }

      // If no results found in the specific category, try other relevant categories
      if (!data || data.length === 0) {
        console.log(`No results found in category ${searchCategoryId}, trying other categories...`)
        const { data: fallbackData, error: fallbackError } = await this.supabase.rpc('match_products', {
          query_embedding: queryEmbedding,
          match_threshold: 0.70, // Medium threshold for fallback search
          match_count: limit,
          search_category_id: null // Search across all categories
        })

        if (fallbackError) throw fallbackError
        return fallbackData || []
      }

      return data
    } catch (error) {
      console.error('Error searching similar products:', error)
      return []
    }
  }
}

export const vectorService = new VectorService() 