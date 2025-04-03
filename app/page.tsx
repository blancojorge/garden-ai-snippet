'use client'

import { useState, useEffect } from 'react'
import { getLocation } from '@/lib/location'
import { getWeatherData, translateWeatherCondition } from '@/lib/weather'
import { getSeasonalInfo } from '@/lib/seasonal'
import WeatherDisplay from '@/components/WeatherDisplay'
import ChatInterface from '@/components/ChatInterface'
import type { ChatMessage } from '@/services/chat/service'
import type { LocationData, WeatherData } from '@/types'

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

  const handleQuestionClick = (question: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: question,
      isUser: true
    }
    setMessages(prev => [...prev, userMessage])
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <img src="https://www.bauhaus.es/_ui/bauhaus/_assets2/images/logo_without_claim.png" alt="Bauhaus Logo" className="mx-auto mb-8" />
        <h1 className="text-4xl font-bold text-center text-green-800 mb-8">
          Asesor de Maquinaria de Jardinería
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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