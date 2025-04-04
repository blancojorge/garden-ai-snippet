'use client'

import { useState, useEffect } from 'react'
import { getLocation } from '@/lib/location'
import { getWeatherData, translateWeatherCondition } from '@/lib/weather'
import { getSeasonalInfo } from '@/lib/seasonal'
import WeatherDisplay from '@/components/WeatherDisplay'
import ChatInterface from '@/components/ChatInterface'
import type { LocationData, WeatherData } from '@/types'
import { chatService } from '@/services/chat/service'

// Define a local ChatMessage type that includes products
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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [month, setMonth] = useState(new Date().getMonth())
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true)
        
        // Get user's location
        const userLocation = await getLocation()
        setLocation(userLocation)

        // Get weather data only if we have coordinates
        if (userLocation.coordinates) {
          const weatherData = await getWeatherData(
            userLocation.coordinates.latitude,
            userLocation.coordinates.longitude
          )
          setWeather(weatherData)
        }

        // Get current month
        setMonth(new Date().getMonth())
      } catch (error) {
        console.error('Error initializing data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  const handleQuestionClick = async (question: string) => {
    try {
      console.log('=== Question Click from Page ===')
      console.log('Selected question:', question)
      
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: question,
        isUser: true
      }
      setMessages(prev => [...prev, userMessage])
      
      // Get response from chat service
      const response = await chatService.handleChatRequest({
        message: question,
        location: location?.region || '',
        month,
        weather: weather || undefined
      })
      
      // Add bot message with products if available
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        products: response.products
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error in handleQuestionClick:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, ha ocurrido un error al procesar tu pregunta. Por favor, inténtalo de nuevo.',
        isUser: false
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen max-w-3xl mx-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen max-w-3xl mx-auto">
      <div className="container mx-auto px-4 py-8">
        <img src="https://www.bauhaus.es/_ui/bauhaus/_assets2/images/logo_without_claim.png" alt="Bauhaus Logo" className="mx-auto mb-8" />
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Tu asesor de huerto y jardín 
        </h1>
        <div className="grid gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {location && weather && (
              <WeatherDisplay 
                location={location}
                weather={weather}
              />
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ChatInterface 
              messages={messages}
              setMessages={setMessages}
              location={location?.region || null}
              month={month}
              weather={weather || undefined}
              onQuestionClick={handleQuestionClick}
            />
          </div>
        </div>
      </div>
    </main>
  )
} 