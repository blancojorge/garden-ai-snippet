import React, { useState, useRef, useEffect } from 'react'
import { getSeasonalInfo } from '@/lib/seasonal'
import { translateWeatherCondition } from '@/lib/weather'
import SuggestedQuestions from './SuggestedQuestions'
import ProductRecommendation from './ProductRecommendation'
import type { Product } from '@/lib/products'
import type { ChatMessage, ChatRequest, ChatResponse } from '@/types/chat'
import type { WeatherData } from '@/types'
import { handleChatRequest } from '@/services/chat/service'
import { gardenService } from '@/services/garden/service'
import { ConversationState } from '@/types/garden'
import { ChatMessages } from './ChatMessages'

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
  const [conversationState, setConversationState] = useState<ConversationState>({
    currentCategory: null,
    currentSpecification: null,
    answeredSpecifications: {}
  })

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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          location: location || '',
          month,
          weather
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error en la respuesta del servidor')
      }

      const data = await response.json()
      console.log('\n=== Products in ChatInterface ===')
      console.log('Number of products:', data.products?.length || 0)
      console.log('First product sample:', data.products?.[0] ? {
        id: data.products[0].id,
        name: data.products[0].name,
        price: data.products[0].price,
        image: data.products[0].image
      } : 'No products found')
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.text,
        isUser: false,
        products: data.products
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

  const createMessage = (role: 'user' | 'assistant', content: string, products?: Product[]): ChatMessage => ({
    id: Date.now().toString(),
    role,
    content,
    products
  })

  const handleQuestionClick = async (question: string) => {
    setIsLoading(true)
    try {
      // Add user question to chat
      setMessages(prev => [...prev, createMessage('user', question)])

      // Get suggested questions from garden service
      const suggestedQuestions = gardenService.getSuggestedQuestions()
      const matchingQuestion = suggestedQuestions.find(q => q.text === question)

      if (matchingQuestion) {
        // If we have a matching question, get its related category
        const categoryId = matchingQuestion.relatedProductCategories[0]
        setConversationState(prev => ({
          ...prev,
          currentCategory: categoryId
        }))

        // Get specifications for this category
        const specifications = gardenService.getSpecificationsByCategory(categoryId)
        if (specifications.length > 0) {
          // Ask for the first specification
          const firstSpec = specifications[0]
          setConversationState(prev => ({
            ...prev,
            currentSpecification: firstSpec.id
          }))
          
          // Add AI message asking for specification
          setMessages(prev => [...prev, createMessage('assistant', `Para recomendarte el mejor producto, necesito saber: ${firstSpec.name}`)])
        } else {
          // If no specifications, proceed with AI response
          const request: ChatRequest = { message: question }
          const response = await handleChatRequest(request)
          setMessages(prev => [...prev, createMessage('assistant', response.content, response.products)])
        }
      } else {
        // If no matching question, proceed with AI response
        const request: ChatRequest = { message: question }
        const response = await handleChatRequest(request)
        setMessages(prev => [...prev, createMessage('assistant', response.content, response.products)])
      }
    } catch (error) {
      console.error('Error in handleQuestionClick:', error)
      setMessages(prev => [...prev, createMessage('assistant', 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.')])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSpecificationAnswer = async (answer: string) => {
    if (!conversationState.currentSpecification) return

    setIsLoading(true)
    try {
      // Add user answer to chat
      setMessages(prev => [...prev, createMessage('user', answer)])

      // Update conversation state with the answer
      setConversationState(prev => ({
        ...prev,
        answeredSpecifications: {
          ...prev.answeredSpecifications,
          [prev.currentSpecification!]: answer
        }
      }))

      // Get next specification
      const nextSpec = gardenService.getNextSpecification(conversationState)
      
      if (nextSpec) {
        // If there's another specification, ask for it
        setConversationState(prev => ({
          ...prev,
          currentSpecification: nextSpec.id
        }))
        
        setMessages(prev => [...prev, createMessage('assistant', `Gracias. Ahora necesito saber: ${nextSpec.name}`)])
      } else {
        // If no more specifications, get AI response with all gathered information
        const request: ChatRequest = {
          message: `Basado en las siguientes especificaciones: ${JSON.stringify(conversationState.answeredSpecifications)}, ¿qué producto me recomiendas?`,
          specifications: conversationState.answeredSpecifications
        }
        const response = await handleChatRequest(request)
        setMessages(prev => [...prev, createMessage('assistant', response.content, response.products)])
        
        // Reset conversation state
        setConversationState({
          currentCategory: null,
          currentSpecification: null,
          answeredSpecifications: {}
        })
      }
    } catch (error) {
      console.error('Error in handleSpecificationAnswer:', error)
      setMessages(prev => [...prev, createMessage('assistant', 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.')])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <ChatMessages messages={messages} />
        
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