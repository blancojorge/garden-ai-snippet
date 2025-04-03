import { Product } from '@/lib/products'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  products?: Product[]
}

export interface ChatRequest {
  message: string
  location?: string
  month?: number
  weather?: {
    condition: string
    temperature: number
    humidity: number
    windSpeed: number
  }
  specifications?: {
    [key: string]: string
  }
}

export interface ChatResponse {
  role: 'assistant'
  content: string
  products?: Product[]
} 