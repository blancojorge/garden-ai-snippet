import { NextResponse } from 'next/server'
import { chatService } from '@/services/chat/service'
import { WeatherData } from '@/types'

export async function POST(request: Request) {
  try {
    const { message, location, month, weather } = await request.json()

    if (!message || !location || month === undefined) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      )
    }

    console.log('\n=== API Request ===')
    console.log('Message:', message)
    console.log('Location:', location)
    console.log('Month:', month)
    console.log('Weather:', weather)

    const response = await chatService.handleChatRequest({
      message,
      location,
      month,
      weather
    })

    console.log('\n=== Products in API Route ===')
    console.log('Number of products:', response.products.length)
    console.log('First product sample:', response.products[0] ? {
      id: response.products[0].id,
      name: response.products[0].name,
      price: response.products[0].price,
      image: response.products[0].image
    } : 'No products found')

    return NextResponse.json(response)
  } catch (error) {
    console.error('\n=== API Error ===')
    console.error(error)
    
    return NextResponse.json(
      { 
        error: 'Error al procesar la solicitud',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
} 