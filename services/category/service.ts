import { ProductCategory } from '../../types/garden'
import catalog from '../../Bauhaus.catalog_maquinaria.json'
import { getProductsByCategory } from '../../lib/products'
import { SYSTEM_PROMPT, AI_CONFIG } from '../ai/config'

// Utility function to add delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export class CategoryService {
  private async getAllCategories(): Promise<ProductCategory[]> {
    const categories = new Set<string>()
    const catalogArray = Array.isArray(catalog) ? catalog : [catalog]
    
    catalogArray.forEach(item => {
      if (!item?.datalayer?.product?.item?.[0]) return
      const itemCategories = item.datalayer.product.item[0]
      
      // Add all non-empty categories
      if (itemCategories.subCategory1 && itemCategories.subCategory1 !== 'n/a') {
        categories.add(itemCategories.subCategory1)
      }
      if (itemCategories.subCategory2 && itemCategories.subCategory2 !== 'n/a') {
        categories.add(itemCategories.subCategory2)
      }
      if (itemCategories.subCategory3 && itemCategories.subCategory3 !== 'n/a') {
        categories.add(itemCategories.subCategory3)
      }
      if (itemCategories.subCategory4 && itemCategories.subCategory4 !== 'n/a') {
        categories.add(itemCategories.subCategory4)
      }
      if (itemCategories.subCategory5 && itemCategories.subCategory5 !== 'n/a') {
        categories.add(itemCategories.subCategory5)
      }
      if (itemCategories.subCategory6 && itemCategories.subCategory6 !== 'n/a') {
        categories.add(itemCategories.subCategory6)
      }
    })

    // Convert category names to ProductCategory objects
    return Array.from(categories).sort().map(name => ({
      id: name.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      name,
      description: this.getCategoryDescription(name),
      specifications: []
    }))
  }

  private getCategoryDescription(category: string): string {
    // Map of category descriptions
    const descriptions: { [key: string]: string } = {
      'Cortacéspedes': 'Máquinas para cortar y mantener el césped',
      'Cortacéspedes de batería': 'Máquinas a batería para cortar el césped, ideales para jardines pequeños y medianos',
      'Cortacéspedes de gasolina': 'Potentes máquinas con motor de gasolina para cortar césped en jardines grandes',
      'Cortacéspedes eléctricos': 'Máquinas con cable eléctrico para cortar césped en jardines pequeños y medianos',
      'Cortacéspedes manuales': 'Máquinas sin motor para cortar césped en áreas pequeñas',
      'Robots cortacésped': 'Máquinas automáticas que cortan el césped sin supervisión',
      'Desbrozadoras': 'Máquinas para cortar hierba alta, maleza y vegetación densa',
      'Cortasetos': 'Herramientas para recortar y dar forma a setos y arbustos',
      'Biotrituradores': 'Máquinas para triturar ramas y restos de poda',
      'Escarificadores y aireadores': 'Máquinas para eliminar musgo y airear el césped',
      'Sopladores y aspiradores': 'Máquinas para limpiar hojas y residuos del jardín',
      'Motosierras': 'Herramientas para cortar troncos y ramas gruesas',
      'Podadoras telescópicas': 'Herramientas extensibles para podar ramas altas',
      'Tijeras de jardinería': 'Herramientas manuales para poda y corte preciso',
      'Barredoras': 'Máquinas para limpiar superficies exteriores',
      'Tractores cortacésped': 'Vehículos con asiento para cortar grandes extensiones de césped',
      'Trituradoras': 'Máquinas para reducir el volumen de restos vegetales',
      'Accesorios': 'Complementos y piezas para máquinas de jardín'
    }

    // Return description if exists, or generate a generic one
    return descriptions[category] || `Herramientas y máquinas para ${category.toLowerCase()}`
  }

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

  async getRelevantCategories(query: string): Promise<string[]> {
    console.log('[Categories] Finding relevant categories for query:', query)
    const categories = await this.getAllCategories()
    console.log('[Categories] Found', categories.length, 'total categories in catalog')
    
    // Log the query for debugging
    console.log('[Categories] Processing query:', query)
    
    const prompt = `Given the following user query and list of product categories, analyze which categories are most relevant to the query. Return ONLY a JSON array containing the IDs of the relevant categories, with no additional text or explanation.

User Query: "${query}"

Available Categories:
${categories.map(cat => `- ${cat.name} (${cat.id}): ${cat.description}`).join('\n')}

IMPORTANT: 
1. Return ONLY a JSON array of category IDs, with no additional text. For example: ["cortacespedes-electricos", "desbrozadoras"]
2. Prioritize categories that directly match the user's needs
3. Include categories that are closely related to the main topic
4. Limit the response to 3-5 most relevant categories
5. Consider the context of the query (e.g., garden size, weather conditions, specific tasks)`

    try {
      // Add a timestamp to prevent caching
      const timestamp = Date.now()
      const response = await fetch(`${AI_CONFIG.baseURL}/chat/completions?t=${timestamp}`, {
        method: 'POST',
        headers: AI_CONFIG.headers,
        body: JSON.stringify({
          model: AI_CONFIG.model,
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
          max_tokens: 1000
        })
      })

      const data = await response.json()
      const content = data.choices[0].message.content.trim()
      
      try {
        const categoryIds = JSON.parse(content)
        console.log('[Categories] AI selected category IDs:', categoryIds)
        
        // Convert IDs back to category names
        const relevantCategories = categoryIds.map((id: string) => {
          const category = categories.find(cat => cat.id === id)
          return category ? category.name : id
        })
        
        console.log('[Categories] Found relevant categories:', relevantCategories)
        return relevantCategories
      } catch (error) {
        console.error('[Categories] Error parsing AI response:', error)
        return []
      }
    } catch (error) {
      console.error('[Categories] Error getting relevant categories:', error)
      return []
    }
  }
}

export const categoryService = new CategoryService() 