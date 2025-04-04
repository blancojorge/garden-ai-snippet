import { chatService } from '../services/chat/service'

const testQueries = [
  {
    message: 'Necesito algo para mantener mi césped bonito y uniforme',
    location: 'Madrid',
    month: 5,
    weather: {
      condition: 'soleado',
      temperature: 25,
      humidity: 40,
      windSpeed: 10
    }
  },
  {
    message: 'Tengo un jardín grande y quiero algo automático para mantenerlo',
    location: 'Barcelona',
    month: 6,
    weather: {
      condition: 'parcialmente nublado',
      temperature: 28,
      humidity: 50,
      windSpeed: 15
    }
  },
  {
    message: 'Busco una máquina silenciosa para podar los arbustos',
    location: 'Valencia',
    month: 4,
    weather: {
      condition: 'lluvioso',
      temperature: 18,
      humidity: 70,
      windSpeed: 20
    }
  }
]

async function testChatService() {
  console.log('=== Testing Chat Service ===\n')

  for (const query of testQueries) {
    console.log('Query:', query.message)
    console.log('Location:', query.location)
    console.log('Month:', query.month)
    console.log('Weather:', query.weather)
    console.log('\nProcessing...\n')

    try {
      const response = await chatService.handleChatRequest(query)
      
      console.log('Response:')
      console.log('Text:', response.text)
      console.log('\nRecommended Products:')
      response.products.forEach(product => {
        console.log(`- ${product.name} (${product.price}€)`)
        console.log(`  Category: ${product.category}`)
        console.log(`  Brand: ${product.brand}`)
        console.log(`  Description: ${product.description}`)
        console.log(`  URL: ${product.url}\n`)
      })
      
      console.log('Explanation:', response.explanation)
      console.log('\n' + '='.repeat(50) + '\n')
    } catch (error) {
      console.error('Error processing query:', error)
      console.log('\n' + '='.repeat(50) + '\n')
    }
  }
}

testChatService().catch(console.error) 