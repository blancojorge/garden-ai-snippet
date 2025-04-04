import { vectorService } from '../services/vector/service'

async function testSearch() {
  try {
    // Test queries with varying specificity
    const queries = [
      // Category-specific queries
      "Necesito un cortacésped eléctrico con recogedor para jardín pequeño",
      "Busco una desbrozadora potente para maleza muy alta",
      "Quiero un cortasetos con mango telescópico para setos altos",
      
      // Mixed or ambiguous queries
      "Herramienta para mantener el césped en buen estado",
      "Necesito algo para podar arbustos y plantas",
      
      // Specific feature queries
      "Máquina con batería para jardín",
      "Herramienta ergonómica para jardinería",
      
      // Complex queries
      "Necesito equipo para mantenimiento completo de jardín grande",
      "Busco herramientas profesionales para paisajismo"
    ]

    console.log('Testing improved search functionality')
    console.log('----------------------------------------')

    for (const query of queries) {
      console.log(`\nQuery: "${query}"`)
      
      try {
        const results = await vectorService.searchSimilarProducts(query)
        
        if (results.length === 0) {
          console.log('No results found')
        } else {
          console.log(`Found ${results.length} results:`)
          results.forEach((product, index) => {
            console.log(`\n${index + 1}. ${product.name}`)
            console.log(`   Category: ${product.categoryId}`)
            console.log(`   Description: ${product.description}`)
            console.log('   Specifications:')
            Object.entries(product.specifications).forEach(([key, value]) => {
              console.log(`   - ${key}: ${value}`)
            })
          })
        }
      } catch (error) {
        console.error('Error searching for query:', error)
      }
      
      console.log('\n----------------------------------------')
    }
  } catch (error) {
    console.error('Error during test:', error)
  }
}

testSearch() 