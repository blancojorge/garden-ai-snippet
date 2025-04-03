import { vectorService } from '../services/vector/service'
import { gardenService } from '../services/garden/service'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local')
dotenv.config({ path: envPath })

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function testSearch() {
  try {
    // First, check how many products are in the database
    const { count, error: countError } = await supabase
      .from('product_embeddings')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('Error checking database:', countError)
      return
    }
    
    console.log(`Found ${count} products in the database`)

    // Get all categories
    const categories = await gardenService.getProductCategories()
    console.log('\nAvailable categories:')
    categories.forEach(cat => console.log(`- ${cat.name} (${cat.id})`))

    // Test queries for each category
    const queries = {
      'cortacespedes': [
        "cortacésped eléctrico para jardín pequeño",
        "máquina para cortar césped con recogedor",
        "cortacésped autopropulsado para jardín grande",
        "cortacésped eléctrico con sistema mulching",
        "máquina para mantenimiento de césped con ancho de corte 40cm"
      ],
      'pulverizadores': [
        "pulverizador para aplicar fertilizante líquido",
        "equipo para fumigar árboles frutales",
        "pulverizador a presión para grandes superficies",
        "mochila pulverizadora con correa para hombro",
        "pulverizador manual para tratamientos fitosanitarios"
      ],
      'motocultores': [
        "motocultor para preparar tierra de huerto",
        "máquina para cultivar terreno duro",
        "motocultor diesel para parcela grande",
        "motocultor con marcha atrás para huerto",
        "máquina para labrar tierra con ancho de trabajo 60cm"
      ]
    }

    console.log('\nTesting vector search with different categories')
    console.log('----------------------------------------')

    for (const category of categories) {
      // Only test the specified categories
      if (!Object.keys(queries).includes(category.id)) continue
      
      console.log(`\nTesting with category: ${category.name}`)
      
      const categoryQueries = queries[category.id as keyof typeof queries]
      
      for (const query of categoryQueries) {
        console.log(`\nSearching for: "${query}"`)
        try {
          const results = await vectorService.searchSimilarProducts(query, category.id, 5)
          
          if (results.length === 0) {
            console.log('No results found')
          } else {
            console.log('Results:')
            results.forEach((product, index) => {
              console.log(`${index + 1}. ${product.name} (${product.similarity}% match)`)
              console.log(`   ${product.description}`)
              console.log('   Specifications:')
              Object.entries(product.specifications).forEach(([key, value]) => {
                console.log(`   - ${key}: ${value}`)
              })
              console.log('')
            })
          }
        } catch (error) {
          console.error('Error during search:', error)
        }
      }
    }
  } catch (error) {
    console.error('Error during test:', error)
  }
}

testSearch() 