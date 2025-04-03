import { handleAIRequest } from '@/services/ai/handler'
import { createContext, formatContextForPrompt } from '@/lib/ai/context'
import { Product } from '@/lib/products'
import { WeatherData } from '@/types'

export interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  products?: Product[]
}

export interface ChatRequest {
  message: string
  location: string
  month: number
  weather?: WeatherData
}

export interface ChatResponse {
  text: string
  products: Product[]
  explanation: string
}

export async function handleChatRequest(request: ChatRequest): Promise<ChatResponse> {
  try {
    // Create context for the conversation
    const context = createContext(request.location, request.month, request.weather)
    
    // Format the context for the AI request
    const contextPrompt = formatContextForPrompt(context)
    
    // Generate AI response with context
    const aiRequest = {
      message: `${contextPrompt}\n\nPregunta del usuario: ${request.message}`,
      location: request.location,
      month: request.month,
      weather: request.weather
    }
    
    const response = await handleAIRequest(aiRequest)
    
    console.log('\n=== Products in Chat Service ===')
    console.log('Number of products:', response.products.length)
    console.log('First product sample:', response.products[0] ? {
      id: response.products[0].id,
      name: response.products[0].name,
      price: response.products[0].price,
      image: response.products[0].image
    } : 'No products found')
    
    return {
      text: response.text,
      products: response.products,
      explanation: response.explanation
    }
  } catch (error) {
    console.error('Error in chat service:', error)
    throw error
  }
} 