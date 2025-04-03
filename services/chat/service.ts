import { handleAIRequest } from '../ai/handler'
import { WeatherData } from '@/types'

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

export async function handleChatRequest(request: AIRequest): Promise<AIResponse> {
  try {
    const response = await handleAIRequest({
      message: request.message,
      location: request.location,
      month: request.month,
      weather: request.weather
    })

    return response
  } catch (error) {
    console.error('Error in chat service:', error)
    return {
      text: 'Lo siento, ha ocurrido un error al procesar tu pregunta. Por favor, inténtalo de nuevo.',
      products: [],
      explanation: ''
    }
  }
} 