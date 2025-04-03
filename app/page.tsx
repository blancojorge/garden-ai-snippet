'use client'

import { useState, useEffect } from 'react'
import { getLocation } from '@/lib/location'
import { getWeatherData, translateWeatherCondition } from '@/lib/weather'
import { generateResponse, setLLMProvider } from '@/lib/ai'
import { getSeasonalInfo } from '@/lib/seasonal'
import WeatherDisplay from '@/components/WeatherDisplay'
import ChatInterface from '@/components/ChatInterface'
import ProductRecommendation from '@/components/ProductRecommendation'
import SuggestedQuestions from '@/components/SuggestedQuestions'
import type { Message, ProductRecommendation as ProductRecommendationType } from '@/types'

export default function Home() {
  const [weather, setWeather] = useState<any>(null)
  const [location, setLocation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [recommendations, setRecommendations] = useState<ProductRecommendationType[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showSuggestedQuestions, setShowSuggestedQuestions] = useState(true)
  const [initializationStep, setInitializationStep] = useState<string>('starting')

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Starting initialization...')
        setInitializationStep('checking_api')
        
        // Set Together.ai as the default provider
        setLLMProvider({ provider: 'together' })
        console.log('LLM provider set to Together.ai')

        setInitializationStep('fetching_location')
        console.log('Fetching location...')
        const locationData = await getLocation()
        console.log('Location data:', locationData)
        setLocation(locationData)

        setInitializationStep('fetching_weather')
        console.log('Fetching weather data...')
        const weatherData = await getWeatherData(
          locationData.coordinates?.latitude || 40.4168,
          locationData.coordinates?.longitude || -3.7038
        )
        console.log('Weather data:', weatherData)
        setWeather(weatherData)

        setInitializationStep('getting_seasonal_info')
        const seasonalInfo = getSeasonalInfo(locationData.region, new Date().getMonth())
        console.log('Seasonal info:', seasonalInfo)

        setInitializationStep('setting_initial_message')
        console.log('Setting initial message...')
        const timeOfDay = new Date().getHours() < 12 ? 'mañana' : 
                         new Date().getHours() < 18 ? 'tarde' : 'noche'
        
        const greeting = `¡Buenos días! Soy tu asesor de maquinaria de jardinería. 
        En ${locationData.region} estamos en ${seasonalInfo.season} y el clima está ${translateWeatherCondition(weatherData.condition)} con ${weatherData.temperature}°C.
        En esta época del año, algunas tareas importantes son: ${seasonalInfo.tasks.join(', ')}.`

        setMessages([{ text: greeting, isUser: false }])
        setShowSuggestedQuestions(true)
        setLoading(false)
        console.log('Initialization completed successfully')
      } catch (error) {
        console.error('Error during initialization:', error)
        setError(error instanceof Error ? error.message : 'An error occurred while initializing the application')
        setInitializationStep('error')
      }
    }

    initialize()
  }, [])

  const handleQuestionClick = async (question: string) => {
    try {
      setShowSuggestedQuestions(false)
      setMessages(prev => [...prev, { text: question, isUser: true }])
      
      const response = await generateResponse(question, {
        location: location?.region || 'tu región',
        weather: weather?.condition || 'desconocido',
        temperature: weather?.temperature || 0
      })
      
      setMessages(prev => [...prev, { text: response.response, isUser: false }])
      setRecommendations(response.recommendations)
    } catch (error) {
      console.error('Error processing message:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while processing your message')
    }
  }

  const handleSendMessage = async (message: string) => {
    try {
      setError(null)
      setMessages(prev => [...prev, { text: message, isUser: true }])
      
      const response = await generateResponse(message, {
        location: location?.region || 'tu región',
        weather: weather?.condition || 'desconocido',
        temperature: weather?.temperature || 0
      })
      
      setMessages(prev => [...prev, { text: response.response, isUser: false }])
      setRecommendations(response.recommendations)
    } catch (error) {
      console.error('Error processing message:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while processing your message')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {initializationStep === 'iniciando' && 'Iniciando la aplicación...'}
            {initializationStep === 'verificando_api' && 'Verificando configuración de API...'}
            {initializationStep === 'obteniendo_ubicacion' && 'Obteniendo tu ubicación...'}
            {initializationStep === 'obteniendo_clima' && 'Obteniendo datos del clima...'}
            {initializationStep === 'obteniendo_info_estacional' && 'Obteniendo información estacional...'}
            {initializationStep === 'configurando_mensaje_inicial' && 'Preparando tu asistente...'}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">
            {error.includes('API') ? 'Error de conexión con el servicio de IA. Por favor, verifica tu conexión a internet.' : error}
          </span>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <WeatherDisplay weather={weather} location={location} />
            <ChatInterface 
              messages={messages} 
              onSendMessage={handleSendMessage}
              isLoading={false}
            />
            {showSuggestedQuestions && location && (
              <SuggestedQuestions 
                seasonalInfo={getSeasonalInfo(location.region, new Date().getMonth())}
                onQuestionClick={handleQuestionClick}
              />
            )}
          </div>
          <div className="lg:col-span-1">
            <ProductRecommendation products={recommendations} />
          </div>
        </div>
      </div>
    </main>
  )
} 