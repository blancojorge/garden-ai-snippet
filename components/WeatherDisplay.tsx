import React from 'react'
import { FaSun, FaCloud, FaCloudRain, FaSnowflake, FaWind } from 'react-icons/fa'
import type { WeatherData, LocationData } from '@/types'

interface WeatherDisplayProps {
  weather: WeatherData
  location: LocationData
}

const WEATHER_TRANSLATIONS: { [key: string]: string } = {
  'clear': 'Despejado',
  'cloudy': 'Nublado',
  'partly cloudy': 'Parcialmente nublado',
  'overcast': 'Cubierto',
  'rain': 'Lluvia',
  'light rain': 'Lluvia ligera',
  'heavy rain': 'Lluvia intensa',
  'snow': 'Nieve',
  'light snow': 'Nieve ligera',
  'heavy snow': 'Nieve intensa',
  'thunderstorm': 'Tormenta',
  'fog': 'Niebla',
  'mist': 'Bruma',
  'haze': 'Calima',
  'windy': 'Ventoso',
  'breezy': 'Brisa',
  'sunny': 'Soleado',
  'mostly sunny': 'Mayormente soleado',
  'scattered clouds': 'Nubes dispersas',
  'broken clouds': 'Nubes rotas',
  'showers': 'Chubascos',
  'drizzle': 'Llovizna',
  'freezing rain': 'Lluvia helada',
  'sleet': 'Aguanieve',
  'blizzard': 'Ventisca',
  'dust': 'Polvo',
  'smoke': 'Humo',
  'tornado': 'Tornado',
  'hurricane': 'Huracán',
  'tropical storm': 'Tormenta tropical'
}

export default function WeatherDisplay({ weather, location }: WeatherDisplayProps) {
  const translatedCondition = WEATHER_TRANSLATIONS[weather.condition.toLowerCase()] || weather.condition

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <FaSun className="text-yellow-500 text-2xl" />
      case 'cloudy':
        return <FaCloud className="text-gray-400 text-2xl" />
      case 'rainy':
        return <FaCloudRain className="text-blue-500 text-2xl" />
      case 'snowy':
        return <FaSnowflake className="text-blue-200 text-2xl" />
      case 'windy':
        return <FaWind className="text-gray-300 text-2xl" />
      default:
        return <FaSun className="text-yellow-500 text-2xl" />
    }
  }

  const getWeatherDescription = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'Soleado'
      case 'cloudy':
        return 'Nublado'
      case 'rainy':
        return 'Lluvioso'
      case 'snowy':
        return 'Nevado'
      case 'windy':
        return 'Ventoso'
      default:
        return 'Despejado'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {location.region}
          </h2>
          <p className="text-gray-600">
            {translatedCondition.charAt(0).toUpperCase() + translatedCondition.slice(1)} • {weather.temperature}°C
          </p>
          <p className="text-gray-600">
            Humedad: {weather.humidity}% • Viento: {weather.windSpeed} km/h
          </p>
        </div>
        <div className="text-4xl">
          {weather.icon === '01d' && '☀️'}
          {weather.icon === '02d' && '⛅'}
          {weather.icon === '03d' && '☁️'}
          {weather.icon === '04d' && '☁️'}
          {weather.icon === '09d' && '🌧️'}
          {weather.icon === '10d' && '🌦️'}
          {weather.icon === '11d' && '⛈️'}
          {weather.icon === '13d' && '🌨️'}
          {weather.icon === '50d' && '🌫️'}
        </div>
      </div>
    </div>
  )
} 