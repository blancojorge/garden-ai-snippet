import { ProductCategory } from '../../types/garden'
import catalog from '../../Bauhaus.catalog_maquinaria.json'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local')
dotenv.config({ path: envPath })

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

  async findRelevantCategories(query: string): Promise<string[]> {
    const categories = await this.getAllCategories()
    return this.getRelevantCategories(query, categories)
  }
}

export const categoryService = new CategoryService() 