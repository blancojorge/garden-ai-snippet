import { categoryService } from '../services/category/service'

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function testCategoryFilter() {
  try {
    // Test queries with implicit category references
    const queries = [
      "Mi césped está muy alto y desigual, necesito algo para mantenerlo bonito",
      "Tengo que limpiar las hojas del patio después de la tormenta",
      "Quiero dar forma a los arbustos de mi jardín, son muy altos",
      "Necesito triturar las ramas gruesas que he podado del árbol",
      "Mi jardín es muy grande y no tengo tiempo para cortarlo manualmente",
      "Hay mucha maleza entre las plantas y es difícil de alcanzar",
      "Quiero podar las ramas altas de los árboles sin usar escalera",
      "Necesito algo automático que mantenga el césped mientras estoy de vacaciones",
      "Las ramas caídas ocupan mucho espacio, necesito reducir su tamaño",
      "El césped está muy compactado y amarillo, necesito que respire mejor",
      "Necesito cortar un árbol viejo que está en mi jardín",
      "Busco una máquina que no haga ruido para mantener el jardín",
      "Quiero limpiar el camino de entrada después de podar",
      "Necesito una máquina potente para un jardín grande con pendientes",
      "Busco algo ligero y fácil de usar para recortar los bordes del césped"
    ]

    console.log('Testing category filtering with natural language queries')
    console.log('----------------------------------------')

    // Get all categories first (we'll reuse them)
    const categories = await categoryService['getAllCategories']()
    console.log('\nAvailable categories:')
    console.log('----------------------------------------')
    // Display categories in columns
    const columns = 3
    const rows = Math.ceil(categories.length / columns)
    for (let i = 0; i < rows; i++) {
      const row = []
      for (let j = 0; j < columns; j++) {
        const idx = i + j * rows
        if (idx < categories.length) {
          const cat = categories[idx]
          row.push(`${cat.name} (${cat.id})`.padEnd(50))
        }
      }
      console.log(row.join(''))
    }
    console.log('----------------------------------------\n')

    for (const query of queries) {
      console.log(`Query: "${query}"`)
      
      // Get relevant categories using AI
      const relevantCategories = await categoryService.findRelevantCategories(query)
      
      console.log('\nRelevant categories:')
      if (relevantCategories.length === 0) {
        console.log('No relevant categories found')
      } else {
        relevantCategories.forEach(categoryId => {
          const category = categories.find(c => c.id === categoryId)
          if (category) {
            console.log(`- ${category.name} (${categoryId})`)
            console.log(`  Description: ${category.description}`)
          }
        })
      }
      
      console.log('\n----------------------------------------')
      
      // Add a 5-second delay between API calls
      if (queries.indexOf(query) < queries.length - 1) {
        console.log('Waiting 5 seconds before next query...')
        await delay(5000)
      }
    }
  } catch (error) {
    console.error('Error during test:', error)
  }
}

testCategoryFilter() 