import { NextResponse } from 'next/server'
import { handleAIRequest } from '@/services/ai/handler'
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

    const response = await handleAIRequest({
      message,
      location,
      month,
      weather
    })

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