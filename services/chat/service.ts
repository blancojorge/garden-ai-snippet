import { categoryService } from '../category/service'
import { gardenService } from '../garden/service'
import { getProductsByCategory, Product } from '../../lib/products'
import { WeatherData } from '../../types/weather'
import { SYSTEM_PROMPT, AI_CONFIG } from '../ai/config'

// Utility function to add delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

interface ChatRequest {
  message: string
  location: string
  month: number
  weather?: WeatherData
}

interface ChatResponse {
  text: string
  products: Array<{
    id: string
    name: string
    description: string
    price: number
    image: string
    url: string
    category: string
    brand: string
  }>
  explanation: string
}

export class ChatService {
  private lastRequestTime: number = 0
  private readonly MIN_DELAY_MS = AI_CONFIG.minDelayMs

  private async ensureDelay(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    
    if (timeSinceLastRequest < this.MIN_DELAY_MS) {
      const waitTime = this.MIN_DELAY_MS - timeSinceLastRequest
      console.log(`\n[Delay] Waiting ${waitTime}ms before next request...`)
      await delay(waitTime)
    }
    
    this.lastRequestTime = Date.now()
  }

  private async getRelevantCategories(query: string): Promise<string[]> {
    console.log('\n[Categories] Finding relevant categories for query:', query)
    await this.ensureDelay()
    const categories = await categoryService.getRelevantCategories(query)
    console.log('[Categories] Found categories:', categories)
    return categories
  }

  private async getProductsFromCategories(categories: string[]): Promise<Product[]> {
    console.log('\n[Products] Getting products from categories:', categories)
    const products = new Set<Product>()
    
    for (const category of categories) {
      console.log(`[Products] Fetching products for category: ${category}`)
      const categoryProducts = getProductsByCategory(category)
      console.log(`[Products] Found ${categoryProducts.length} products in category ${category}`)
      
      // Take only the first 10 products from each category
      const limitedProducts = categoryProducts.slice(0, 10)
      console.log(`[Products] Using first ${limitedProducts.length} products from category ${category}`)
      
      limitedProducts.forEach(product => products.add(product))
    }
    
    const uniqueProducts = Array.from(products)
    console.log(`[Products] Total unique products found: ${uniqueProducts.length}`)
    return uniqueProducts
  }

  private async generateProductRecommendations(
    products: Product[],
    context: {
      location: string
      month: number
      weather?: WeatherData
    }
  ): Promise<ChatResponse> {
    console.log('[AI] Generating product recommendations')
    console.log('[AI] Context:', context)
    console.log('[AI] Using system prompt from config.ts')
    
    await this.ensureDelay()
    
    try {
      // Create a simplified version of products with only essential information
      const simplifiedProducts = products.map(product => ({
        name: product.name,
        price: product.price,
        category: product.category,
        brand: product.brand,
        description: product.description || '',
        url: product.url,
        id: product.id // Include the product ID
      }));
      
      console.log('[AI] Sending request to Together API with', simplifiedProducts.length, 'products')
      const response = await fetch(`${AI_CONFIG.baseURL}/chat/completions`, {
        method: 'POST',
        headers: AI_CONFIG.headers,
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: `Eres un experto en maquinaria de huerto y jardín de Bauhaus. Tu objetivo es ayudar a los clientes a encontrar los productos más adecuados para sus necesidades de huerto y jardinería en ${context.location} durante el mes ${context.month}${context.weather ? `, donde el clima es ${context.weather.condition}, con una temperatura de ${context.weather.temperature}°C, humedad del ${context.weather.humidity}% y viento de ${context.weather.windSpeed} km/h` : ''}.

Por favor, analiza los siguientes productos de nuestro catálogo y recomienda los 3 más adecuados, explicando por qué son ideales para este caso específico:

${JSON.stringify(simplifiedProducts, null, 2)}

Recuerda:
1. Utiliza EXCLUSIVAMENTE productos que estén en el catálogo
2. Incluir el nombre exacto del producto, precio y características
3. Explicar por qué cada producto es adecuado para este caso, sin repetir los mismos motivos para cada producto
4. Formatear los precios en euros (€)
5. Si el producto tiene una URL, inclúyela en la respuesta como un enlace markdown desde el nombre del producto. Por ejemplo: "[Cortacésped eléctrico X](https://www.bauhaus.es/cortacesped-electrico-x)"
      IMPORTANTE: El enlace markdown debe ir en el NOMBRE DEL PRODUCTO, no en ningún otro elemento del texto. Por ejemplo:
   ❌ NO: "[Cortacéspedes eléctricos](https://www.bauhaus.es/cortacesped-electrico-x) de la marca Y"
   ✅ SÍ: "[Cortacésped eléctrico X modelo xas24](https://www.bauhaus.es/cortacesped-electrico-x-modelo-xas24)"
   6. IMPORTANTE: Recomendar SOLO 3 productos como máximo
7. CRÍTICO: Asegúrate de que los 3 productos recomendados sean DIVERSOS:
   - Si la consulta es sobre una categoría específica (ej. cortacéspedes), elige productos con características diferentes (ej. diferentes tipos de motor, tamaños, precios)
   - Si la consulta es general (ej. herramientas para jardín), elige productos de DIFERENTES CATEGORÍAS (ej. un cortacésped, una podadora, una desbrozadora)
   - Evita recomendar productos muy similares entre sí
8. Incluye una reflexión final sobre la consulta del usuario, indicando que has seleccionado los 3 productos más adecuados para su caso.
            `}
          ],
          temperature: AI_CONFIG.temperature,
          max_tokens: AI_CONFIG.maxTokens
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('[AI] Together API error response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        throw new Error(`Together API error: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`)
      }

      const data = await response.json()
      console.log('[AI] Received response from Together API')
      
      // Extract product links from the response with improved regex
      const productLinks = data.choices[0].message.content.match(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/g) || []
      console.log('[AI] Found', productLinks.length, 'product links in response')
      
      if (productLinks.length === 0) {
        console.warn('[AI] No product links found in response. Full response:', data.choices[0].message.content)
      }
      
      // Match products with their links and limit to 3 products
      const recommendedProducts = productLinks
        .map((link: string) => {
          // Extract the URL from the markdown link
          const urlMatch = link.match(/\]\((https:\/\/[^)]+)\)/)
          if (!urlMatch) {
            console.warn('[AI] Could not extract URL from link:', link)
            return null
          }
          
          const url = urlMatch[1]
          console.log('[AI] Extracted URL:', url)
          
          // Try to find the product by URL
          const product = products.find(p => p.url === url)
          if (product) {
            console.log('[AI] Matched product by URL:', product.name)
            return product
          }
          
          // If not found by URL, try to extract the product ID from the URL
          const idMatch = url.match(/\/p\/(\d+)/)
          if (idMatch) {
            const id = idMatch[1]
            console.log('[AI] Extracted product ID from URL:', id)
            const productById = products.find(p => p.id === id)
            if (productById) {
              console.log('[AI] Matched product by ID:', productById.name)
              return productById
            }
          }
          
          // If still not found, try to match by name (fallback)
          const nameMatch = link.match(/\[([^\]]+)\]/)
          if (nameMatch) {
            const name = nameMatch[1]
            console.log('[AI] Trying to match by name:', name)
            const productByName = products.find(p => p.name === name)
            if (productByName) {
              console.log('[AI] Matched product by name:', productByName.name)
              return productByName
            }
          }
          
          console.warn('[AI] Could not match product for link:', link)
          return null
        })
        .filter(Boolean)
        .slice(0, 3) as Product[]
      
      console.log('[AI] Successfully matched', recommendedProducts.length, 'products')
      
      // If no products were matched but we have a response, return the text without products
      if (recommendedProducts.length === 0 && data.choices[0].message.content) {
        console.log('[AI] No products matched, returning text only')
        return {
          text: data.choices[0].message.content,
          products: [],
          explanation: 'Product recommendations generated but no products could be matched from the response.'
        }
      }
      
      return {
        text: data.choices[0].message.content,
        products: recommendedProducts,
        explanation: 'Product recommendations generated based on user query and context.'
      }
    } catch (error) {
      console.error('[AI] Error generating product recommendations:', error)
      if (error instanceof Error) {
        console.error('[AI] Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
      }
      return {
        text: 'Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, inténtalo de nuevo.',
        products: [],
        explanation: 'No se pudieron generar recomendaciones en este momento.'
      }
    }
  }

  async handleChatRequest(request: ChatRequest): Promise<ChatResponse> {
    console.log('\n=== Starting Chat Request ===')
    console.log('[Request] Message:', request.message)
    console.log('[Request] Location:', request.location)
    console.log('[Request] Month:', request.month)
    console.log('[Request] Weather:', request.weather)

    try {
      // Step 1: Identify relevant categories
      console.log('\n[Workflow] Step 1: Identifying relevant categories')
      const relevantCategories = await this.getRelevantCategories(request.message)
      
      if (relevantCategories.length === 0) {
        console.log('[Workflow] No relevant categories found')
        return {
          text: 'Lo siento, no pude identificar categorías relevantes para tu consulta. Por favor, intenta reformular tu pregunta.',
          products: [],
          explanation: 'No se encontraron categorías relevantes.'
        }
      }

      // Step 2: Get products from relevant categories
      console.log('\n[Workflow] Step 2: Getting products from categories')
      const products = await this.getProductsFromCategories(relevantCategories)
      
      if (products.length === 0) {
        console.log('[Workflow] No products found in relevant categories')
        return {
          text: 'Lo siento, no encontré productos disponibles en las categorías relevantes. Por favor, intenta con otra consulta.',
          products: [],
          explanation: 'No se encontraron productos en las categorías identificadas.'
        }
      }

      // Step 3: Generate product recommendations
      console.log('\n[Workflow] Step 3: Generating product recommendations')
      const response = await this.generateProductRecommendations(
        products,
        {
          location: request.location,
          month: request.month,
          weather: request.weather
        }
      )

      console.log('\n=== Chat Request Completed ===')
      return response
    } catch (error) {
      console.error('[Workflow] Error handling chat request:', error)
      return {
        text: 'Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, inténtalo de nuevo.',
        products: [],
        explanation: 'Error al procesar la consulta.'
      }
    }
  }
}

export const chatService = new ChatService()

// Export the method as a standalone function
export const handleChatRequest = chatService.handleChatRequest.bind(chatService) 