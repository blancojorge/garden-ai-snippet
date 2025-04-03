import { getSeasonalInfo, SeasonalInfo } from '@/lib/seasonal'
import { WeatherData } from '@/types'

export interface Context {
  location: string
  weather: string
  temperature: number
  humidity: number
  windSpeed: number
  month: number
  seasonalInfo: SeasonalInfo
}

export function createContext(location: string, month: number, weatherData?: WeatherData): Context {
  const seasonalInfo = getSeasonalInfo(location, month)
  
  return {
    location,
    weather: weatherData?.condition || 'soleado',
    temperature: weatherData?.temperature || 20,
    humidity: weatherData?.humidity || 0,
    windSpeed: weatherData?.windSpeed || 0,
    month,
    seasonalInfo
  }
}

export function formatContextForPrompt(context: Context): string {
  return `Contexto actual:
- Ubicación: ${context.location}
- Clima: ${context.weather}
- Temperatura: ${context.temperature}°C
- Humedad: ${context.humidity}%
- Viento: ${context.windSpeed} km/h
- Estación: ${context.seasonalInfo.season}

Información estacional:
- Tareas recomendadas: ${context.seasonalInfo.tasks.join(', ')}
- Productos recomendados: ${context.seasonalInfo.recommendedProducts.join(', ')}`
} 