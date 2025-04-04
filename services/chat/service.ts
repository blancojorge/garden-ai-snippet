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

  private logCategoryProcess(query: string, categories: string[]) {
    console.log('\n=== Category Analysis Process ===')
    console.log('Query:', query)
    console.log('Timestamp:', new Date().toISOString())
    console.log('Number of categories found:', categories.length)
    console.log('Categories:', categories)
    console.log('=== End Category Analysis ===\n')
  }

  private async getRelevantCategories(query: string): Promise<string[]> {
    console.log('\n[Categories] Finding relevant categories for query:', query)
    console.log('[Categories] Starting category analysis for query:', query)
    console.log('[Categories] Query length:', query.length, 'characters')
    
    await this.ensureDelay()
    
    // Force a new request to the category service
    console.log('[Categories] Requesting categories from category service...')
    const categories = await categoryService.getRelevantCategories(query)
    console.log('[Categories] Received response from category service')
    console.log('[Categories] Found categories:', categories)
    
    // Log the query and categories for debugging
    console.log('[Categories] Query:', query)
    console.log('[Categories] Categories:', categories)
    console.log('[Categories] Number of categories found:', categories.length)
    
    if (categories.length === 0) {
      console.log('[Categories] WARNING: No categories found for query:', query)
    } else {
      console.log('[Categories] Successfully identified categories for query:', query)
    }
    
    // Log the category process
    this.logCategoryProcess(query, categories)
    
    return categories
  }

  private logProductProcess(categories: string[], products: Product[]) {
    console.log('\n=== Product Retrieval Process ===')
    console.log('Categories:', categories)
    console.log('Timestamp:', new Date().toISOString())
    console.log('Number of categories processed:', categories.length)
    console.log('Total unique products found:', products.length)
    console.log('Product IDs:', products.map(p => p.id))
    console.log('Product names:', products.map(p => p.name))
    console.log('=== End Product Retrieval ===\n')
  }

  private async getProductsFromCategories(categories: string[]): Promise<Product[]> {
    console.log('\n[Products] Getting products from categories:', categories)
    console.log('[Products] Starting product retrieval process...')
    console.log('[Products] Number of categories to process:', categories.length)
    
    const products = new Set<Product>()
    
    for (const category of categories) {
      console.log(`[Products] Fetching products for category: ${category}`)
      console.log(`[Products] Starting product retrieval for category: ${category}`)
      
      const categoryProducts = getProductsByCategory(category)
      console.log(`[Products] Found ${categoryProducts.length} products in category ${category}`)
      
      // Take only the first 5 products from each category to minimize token usage
      const limitedProducts = categoryProducts.slice(0, 5)
      console.log(`[Products] Using first ${limitedProducts.length} products from category ${category}`)
      
      // Log the limited products for debugging
      limitedProducts.forEach(product => {
        console.log(`[Products] Adding product: ${product.name} (${product.id})`)
        products.add(product)
      })
      
      console.log(`[Products] Completed product retrieval for category: ${category}`)
    }
    
    const uniqueProducts = Array.from(products)
    console.log(`[Products] Total unique products found: ${uniqueProducts.length}`)
    console.log('[Products] Product retrieval process completed')
    
    // Log the product process
    this.logProductProcess(categories, uniqueProducts)
    
    return uniqueProducts
  }

  private logRecommendationProcess(query: string, products: Product[], recommendedProducts: Product[]) {
    console.log('\n=== Recommendation Generation Process ===')
    console.log('Query:', query)
    console.log('Timestamp:', new Date().toISOString())
    console.log('Number of products considered:', products.length)
    console.log('Number of products recommended:', recommendedProducts.length)
    console.log('Recommended product IDs:', recommendedProducts.map(p => p.id))
    console.log('Recommended product names:', recommendedProducts.map(p => p.name))
    console.log('=== End Recommendation Generation ===\n')
  }

  private logChatRequestProcess(request: ChatRequest, response: ChatResponse) {
    console.log('\n=== Chat Request Process Summary ===')
    console.log('Timestamp:', new Date().toISOString())
    console.log('User Query:', request.message)
    console.log('Location:', request.location)
    console.log('Month:', request.month)
    console.log('Weather:', request.weather)
    console.log('Response Text Length:', response.text.length)
    console.log('Number of Products Recommended:', response.products.length)
    console.log('Product IDs:', response.products.map(p => p.id))
    console.log('Product Names:', response.products.map(p => p.name))
    console.log('=== End Chat Request Process ===\n')
  }

  private async generateProductRecommendations(
    products: Product[],
    context: {
      location: string
      month: number
      weather?: WeatherData
    },
    userQuery: string
  ): Promise<ChatResponse> {
    console.log('[AI] Generating product recommendations')
    console.log('[AI] Context:', context)
    console.log('[AI] User Query:', userQuery)
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
      
      // Construir el prompt completo
      const fullPrompt = `Consulta del usuario: "${userQuery}"

Eres un experto en maquinaria de huerto y jardín de Bauhaus. Tu objetivo es ayudar a los clientes a encontrar los productos más adecuados para sus necesidades de huerto y jardinería en ${context.location} durante el mes ${context.month}${context.weather ? `, donde el clima es ${context.weather.condition}, con una temperatura de ${context.weather.temperature}°C, humedad del ${context.weather.humidity}% y viento de ${context.weather.windSpeed} km/h` : ''}.

Por favor, analiza los siguientes productos de nuestro catálogo y recomienda los 3 más adecuados para responder a la consulta del usuario, explicando por qué son ideales para este caso específico:

${JSON.stringify(simplifiedProducts, null, 2)}

Recuerda:
1. Utiliza EXCLUSIVAMENTE productos que estén en el catálogo
2. Incluir el nombre exacto del producto, precio y características
3. Explicar por qué cada producto es adecuado para este caso, sin repetir los mismos motivos para cada producto
4. Formatear los precios en euros (€)
5. Si el producto tiene una URL, inclúyela en la respuesta como un enlace markdown desde el product name. Por ejemplo: "[Cortacésped eléctrico Bosch 32AS-X](https://www.bauhaus.es/cortacesped-electrico-bosch 32as-x)"
   6. IMPORTANTE: Recomendar SOLO 3 productos como máximo
7. CRÍTICO: Asegúrate de que los 3 productos recomendados sean DIVERSOS:
   - Si la consulta es sobre una categoría específica (ej. cortacéspedes), elige productos con características diferentes (ej. diferentes tipos de motor, tamaños, precios)
   - Si la consulta es general (ej. herramientas para jardín), elige productos de DIFERENTES CATEGORÍAS (ej. un cortacésped, una podadora, una desbrozadora)
   - Evita recomendar productos muy similares entre sí
8. Incluye una reflexión final sobre la consulta del usuario, indicando que has seleccionado los 3 productos más adecuados para su caso, enfatizando en cómo se relacionan con la consulta del usuario, además de los factores que has tenido en cuenta para hacer la recomendación.
            `;
      
      // Log del prompt completo
      console.log('[AI] Full prompt content:', fullPrompt);
      
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
              content: fullPrompt
            }
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
      
      // Log the full response content for debugging
      console.log('[AI] Full response content length:', data.choices[0].message.content.length)
      console.log('[AI] Response content preview:', data.choices[0].message.content.substring(0, 100) + '...')
      
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
      
      // Log the recommendation process
      this.logRecommendationProcess(userQuery, products, recommendedProducts)
      
      // If no products were matched but we have a response, return the text without products
      if (recommendedProducts.length === 0 && data.choices[0].message.content) {
        console.log('[AI] No products matched, returning text only')
        
        // Try to extract product IDs directly from the text as a fallback
        const productIdMatches = data.choices[0].message.content.match(/\/p\/(\d+)/g) || []
        console.log('[AI] Found', productIdMatches.length, 'product ID matches in text')
        
        if (productIdMatches.length > 0) {
          const fallbackProducts = productIdMatches
            .map((match: string) => {
              const matchResult = match.match(/\/p\/(\d+)/)
              if (!matchResult) return null
              const id = matchResult[1]
              console.log('[AI] Extracted product ID from text:', id)
              return products.find(p => p.id === id)
            })
            .filter(Boolean)
            .slice(0, 3) as Product[]
          
          if (fallbackProducts.length > 0) {
            console.log('[AI] Found', fallbackProducts.length, 'products using fallback method')
            
            // Log the recommendation process with fallback products
            this.logRecommendationProcess(userQuery, products, fallbackProducts)
            
            return {
              text: data.choices[0].message.content,
              products: fallbackProducts,
              explanation: 'Product recommendations generated using fallback matching method.'
            }
          }
        }
        
        // If still no products found, try to match by product names mentioned in the text
        console.log('[AI] Trying to match products by name in text')
        const productNames = products.map(p => p.name)
        const matchedProducts = productNames
          .filter(name => data.choices[0].message.content.includes(name))
          .map(name => products.find(p => p.name === name))
          .filter(Boolean)
          .slice(0, 3) as Product[]
        
        if (matchedProducts.length > 0) {
          console.log('[AI] Found', matchedProducts.length, 'products by name matching')
          
          // Log the recommendation process with name-matched products
          this.logRecommendationProcess(userQuery, products, matchedProducts)
          
          return {
            text: data.choices[0].message.content,
            products: matchedProducts,
            explanation: 'Product recommendations generated by matching product names in the response.'
          }
        }
        
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
    console.log('[Request] Timestamp:', new Date().toISOString())

    try {
      // Step 1: Identify relevant categories
      console.log('\n[Workflow] Step 1: Identifying relevant categories')
      console.log('[Workflow] Query:', request.message)
      console.log('[Workflow] Starting category identification process...')
      
      // Force a new request to the category service
      const relevantCategories = await this.getRelevantCategories(request.message)
      console.log('[Workflow] Found categories:', relevantCategories)
      console.log('[Workflow] Category identification process completed')
      
      // Si no hay categorías relevantes, pedir más contexto al usuario
      if (relevantCategories.length === 0) {
        console.log('[Workflow] No relevant categories found')
        const response = {
          text: 'Para poder ayudarte mejor, necesito más detalles sobre tu consulta. Por favor, proporciona más información sobre lo que estás buscando.',
          products: [],
          explanation: 'No se encontraron categorías relevantes.'
        }
        
        // Log the chat request process
        this.logChatRequestProcess(request, response)
        
        return response
      }

      // Step 2: Get products from relevant categories
      console.log('\n[Workflow] Step 2: Getting products from categories')
      const products = await this.getProductsFromCategories(relevantCategories)
      
      if (products.length === 0) {
        console.log('[Workflow] No products found in relevant categories')
        const response = {
          text: 'Lo siento, no encontré productos disponibles en las categorías relevantes. Por favor, intenta con otra consulta.',
          products: [],
          explanation: 'No se encontraron productos en las categorías identificadas.'
        }
        
        // Log the chat request process
        this.logChatRequestProcess(request, response)
        
        return response
      }

      // Step 3: Generate product recommendations
      console.log('\n[Workflow] Step 3: Generating product recommendations')
      const response = await this.generateProductRecommendations(
        products,
        {
          location: request.location,
          month: request.month,
          weather: request.weather
        },
        request.message
      )

      console.log('\n=== Chat Request Completed ===')
      
      // Log the chat request process
      this.logChatRequestProcess(request, response)
      
      return response
    } catch (error) {
      console.error('[Workflow] Error handling chat request:', error)
      const response = {
        text: 'Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, inténtalo de nuevo.',
        products: [],
        explanation: 'Error al procesar la consulta.'
      }
      
      // Log the chat request process
      this.logChatRequestProcess(request, response)
      
      return response
    }
  }

  // Método para verificar si las categorías son realmente relevantes para la consulta
  private async verifyCategoriesRelevance(query: string, categories: string[]): Promise<boolean> {
    console.log('[Relevance] Verifying categories relevance for query:', query)
    console.log('[Relevance] Categories to verify:', categories)
    
    // Palabras clave que indican que las categorías podrían no ser relevantes
    const irrelevantKeywords = [
      'sulfatar', 'viñedo', 'viña', 'pulverizar', 'fumigar', 'tratamiento', 'fitosanitario',
      'pesticida', 'herbicida', 'fungicida', 'insecticida', 'abono', 'fertilizante', 'compost',
      'semilla', 'siembra', 'plantar', 'cultivo', 'huerto', 'huerta', 'hortaliza', 'verdura',
      'fruta', 'árbol', 'arbusto', 'planta', 'flor', 'jardín', 'césped', 'prado', 'pradera'
    ]
    
    // Verificar si la consulta contiene palabras clave que no están relacionadas con las categorías
    const queryContainsIrrelevantKeywords = irrelevantKeywords.some(keyword => 
      query.toLowerCase().includes(keyword.toLowerCase())
    )
    
    // Verificar si las categorías son relevantes para las palabras clave
    const categoriesAreRelevant = categories.some(category => {
      const categoryLower = category.toLowerCase()
      return irrelevantKeywords.some(keyword => 
        categoryLower.includes(keyword.toLowerCase())
      )
    })
    
    // Si la consulta contiene palabras clave irrelevantes y las categorías no son relevantes,
    // entonces las categorías no son adecuadas para la consulta
    const isRelevant = !(queryContainsIrrelevantKeywords && !categoriesAreRelevant)
    
    console.log('[Relevance] Query contains irrelevant keywords:', queryContainsIrrelevantKeywords)
    console.log('[Relevance] Categories are relevant:', categoriesAreRelevant)
    console.log('[Relevance] Final relevance result:', isRelevant)
    
    return isRelevant
  }
}

export const chatService = new ChatService()

// Export the method as a standalone function
export const handleChatRequest = chatService.handleChatRequest.bind(chatService) 