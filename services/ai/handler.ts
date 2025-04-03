import { AI_CONFIG, SYSTEM_PROMPT } from './config'
import { getProductsByCategory, getAllCategories, getProductById } from '@/lib/products'
import catalog from '@/Bauhaus.catalog_maquinaria.json'
import { WeatherData } from '@/types'
import { Product } from '@/lib/products'

interface AIRequest {
  message: string
  location: string
  month: number
  weather?: WeatherData
}

interface AIResponse {
  text: string
  products: any[]
  explanation: string
}

function extractProductIdsFromMarkdown(text: string): string[] {
  // Match markdown links [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const productIds: string[] = []
  let match

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    const url = match[2]
    // Extract product ID from Bauhaus URL
    const productIdMatch = url.match(/\/p\/(\d+)/)
    if (productIdMatch && productIdMatch[1]) {
      productIds.push(productIdMatch[1])
    }
  }

  console.log('Extracted product IDs:', productIds)
  return productIds
}

export async function handleAIRequest(request: AIRequest): Promise<AIResponse> {
  try {
    console.log('\n=== AI Request ===')
    console.log('Message:', request.message)
    console.log('Location:', request.location)
    console.log('Month:', request.month)
    console.log('Weather:', request.weather)

    // Format the catalog for the prompt
    const catalogInfo = (catalog as any[]).map(item => ({
      name: item.schema?.name || 'Producto sin nombre',
      description: item.schema?.description || 'Sin descripción disponible',
      price: item.schema?.offers?.price || 0,
      categories: {
        subCategory1: item.datalayer?.product?.item?.[0]?.subCategory1 || '',
        subCategory2: item.datalayer?.product?.item?.[0]?.subCategory2 || '',
        subCategory3: item.datalayer?.product?.item?.[0]?.subCategory3 || '',
        subCategory4: item.datalayer?.product?.item?.[0]?.subCategory4 || '',
        subCategory5: item.datalayer?.product?.item?.[0]?.subCategory5 || '',
        subCategory6: item.datalayer?.product?.item?.[0]?.subCategory6 || ''
      },
      brand: item.schema?.brand?.name || 'Marca no especificada',
      url: item.schema?.url || '#'
    }))

    const prompt = `Contexto actual:
- Ubicación: ${request.location}
- Mes: ${request.month}
${request.weather ? `
- Clima: ${request.weather.condition}
- Temperatura: ${request.weather.temperature}°C
- Humedad: ${request.weather.humidity}%
- Viento: ${request.weather.windSpeed} km/h` : ''}

Catálogo completo de productos de Bauhaus:
${catalogInfo.map(product => 
  `- ${product.name} (${product.price}€)
   Categorías:
     ${product.categories.subCategory1 ? `- ${product.categories.subCategory1}` : ''}
     ${product.categories.subCategory2 ? `- ${product.categories.subCategory2}` : ''}
     ${product.categories.subCategory3 ? `- ${product.categories.subCategory3}` : ''}
     ${product.categories.subCategory4 ? `- ${product.categories.subCategory4}` : ''}
     ${product.categories.subCategory5 ? `- ${product.categories.subCategory5}` : ''}
     ${product.categories.subCategory6 ? `- ${product.categories.subCategory6}` : ''}
   Marca: ${product.brand}
   Descripción: ${product.description}
   URL: ${product.url}`
).join('\n\n')}

Pregunta del usuario: ${request.message}

IMPORTANTE: Cuando recomiendes productos, usa el formato markdown para los enlaces: [nombre del producto](url). Por ejemplo: [Cortacésped eléctrico GC-EM 1032](https://www.bauhaus.es/cortacespedes-electricos/einhell-cortacespede-electrico-gc-em-1032/p/28671824)`

    console.log('\n=== Sending Request to Together AI ===')
    console.log('\n=== Prompt ===')
    console.log(prompt)
    const response = await fetch(AI_CONFIG.baseURL + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens
      })
    })

    if (!response.ok) {
      throw new Error(`Together AI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.'
    console.log('\n=== AI Response ===')
    console.log(aiResponse)

    // Extract product IDs from markdown links
    const productIds = extractProductIdsFromMarkdown(aiResponse)
    console.log('Extracted product IDs:', productIds)

    // Get products by their IDs
    const products = productIds.map(id => getProductById(id)).filter(Boolean) as Product[]
    console.log('\n=== Products from AI Handler ===')
    console.log('Number of products:', products.length)
    console.log('First product sample:', products[0] ? {
      id: products[0].id,
      name: products[0].name,
      price: products[0].price,
      image: products[0].image
    } : 'No products found')

    return {
      text: aiResponse,
      products,
      explanation: products.length > 0 
        ? 'Basado en tu pregunta, te recomiendo estos productos de Bauhaus:'
        : 'No se encontraron productos en las categorías mencionadas. Por favor, intenta con otra categoría.'
    }
  } catch (error) {
    console.error('\n=== Error in AI Handler ===')
    console.error(error)
    throw error
  }
}

function extractProductCategories(text: string): string[] {
  const categories = getAllCategories()
  const normalizedText = text.toLowerCase()
  
  return categories.filter(category => 
    normalizedText.includes(category.toLowerCase()) ||
    category.toLowerCase().includes(normalizedText)
  )
} 