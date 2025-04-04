import React, { useState, useRef, useEffect } from 'react'
import { getSeasonalInfo } from '@/lib/seasonal'
import { translateWeatherCondition } from '@/lib/weather'
import SuggestedQuestions from './SuggestedQuestions'
import ProductRecommendation from './ProductRecommendation'
import type { WeatherData } from '@/types'
import { chatService } from '@/services/chat/service'

interface ChatProduct {
  name: string
  description: string
  price: number
  image: string
  url: string
  category: string
  brand: string
}

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  products?: ChatProduct[]
}

interface ChatInterfaceProps {
  messages: ChatMessage[]
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  location: string | null
  month: number
  weather?: WeatherData
  onQuestionClick: (question: string) => void
}

export default function ChatInterface({ 
  messages, 
  setMessages, 
  location, 
  month,
  weather,
  onQuestionClick 
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const seasonalInfo = getSeasonalInfo(location, month)
  const [hasShownWelcome, setHasShownWelcome] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (location && weather && !hasShownWelcome && messages.length === 0) {
      const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour >= 6 && hour < 12) return '¡Buenos días!'
        if (hour >= 12 && hour < 20) return '¡Buenas tardes!'
        return '¡Buenas noches!'
      }

      const getSeason = () => {
        if (month >= 2 && month <= 4) return 'primavera'
        if (month >= 5 && month <= 7) return 'verano'
        if (month >= 8 && month <= 10) return 'otoño'
        return 'invierno'
      }

      const welcomeMessage = `${getGreeting()} Es ${getSeason()} y está ${translateWeatherCondition(weather.condition)} en ${location}. En ${getSeason()}, las tareas principales de jardinería en tu área incluyen: ${seasonalInfo.tasks.join(', ')}.`

      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: welcomeMessage,
        isUser: false
      }
      setMessages([botMessage])
      setHasShownWelcome(true)
    }
  }, [location, weather, month, seasonalInfo, hasShownWelcome, setMessages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      isUser: true
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      console.log('=== User Message ===')
      console.log('Message:', input)
      console.log('Location:', location || '')
      console.log('Month:', month)
      console.log('Weather:', weather)
      
      // Use the chat service directly instead of the API route
      const response = await chatService.handleChatRequest({
        message: input,
        location: location || '',
        month,
        weather
      })
      
      console.log('\n=== Products in ChatInterface ===')
      console.log('Number of products:', response.products?.length || 0)
      console.log('First product sample:', response.products?.[0] ? {
        id: response.products[0].id,
        name: response.products[0].name,
        price: response.products[0].price,
        image: response.products[0].image
      } : 'No products found')
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        products: response.products
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.',
        isUser: false
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuestionClick = async (question: string) => {
    try {
      console.log('=== Question Click ===')
      console.log('Selected question:', question)
      
      setIsLoading(true)
      setInput(question)
      
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: question,
        isUser: true
      }
      setMessages(prev => [...prev, userMessage])
      
      console.log('Sending question to chat service...')
      const response = await chatService.handleChatRequest({
        message: question,
        location: location || '',
        month,
        weather
      })
      
      console.log('Chat service response:', response)
      
      // Add bot message with products if available
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        products: response.products
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error: unknown) {
      console.error('=== Error in handleQuestionClick ===')
      if (error instanceof Error) {
        console.error('Error type:', error.constructor.name)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      } else {
        console.error('Unknown error:', error)
      }
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, ha ocurrido un error al procesar tu pregunta. Por favor, inténtalo de nuevo.',
        isUser: false
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="space-y-4">
            <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {message.text.split('\n').map((line: string, i: number) => (
                  <p key={i} className="mb-2">
                    {line.split(/(\[.*?\]\(.*?\))/g).map((part: string, j: number) => {
                      const match = part.match(/\[(.*?)\]\((.*?)\)/)
                      if (match) {
                        return (
                          <a
                            key={j}
                            href={match[2]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${message.isUser ? 'text-white underline' : 'text-blue-600 hover:text-blue-800 underline'}`}
                          >
                            {match[1]}
                          </a>
                        )
                      }
                      return part
                    })}
                  </p>
                ))}
              </div>
            </div>
            
            {!message.isUser && message.products && message.products.length > 0 && (
              <div className="mt-4">
                <ProductRecommendation products={message.products} />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {messages.length === 1 && !isLoading && location && (
          <SuggestedQuestions 
            seasonalInfo={seasonalInfo} 
            onQuestionClick={handleQuestionClick} 
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={location ? "Escribe tu pregunta..." : "Esperando datos de ubicación..."}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading || !location}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !location}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
} 