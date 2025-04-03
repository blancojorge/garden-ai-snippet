import axios from 'axios'

interface WeatherResponse {
  current_weather: {
    temperature: number
    weathercode: number
  }
  daily: {
    weathercode: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
}

export interface WeatherData {
  temperature: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
}

const weatherCodeToCondition = (code: number): { condition: string; icon: string } => {
  // Open-Meteo weather codes mapping
  // https://open-meteo.com/en/docs
  switch (code) {
    case 0:
      return { condition: 'sunny', icon: '01d' }
    case 1:
    case 2:
    case 3:
      return { condition: 'cloudy', icon: '02d' }
    case 45:
    case 48:
      return { condition: 'foggy', icon: '50d' }
    case 51:
    case 53:
    case 55:
      return { condition: 'drizzle', icon: '09d' }
    case 61:
    case 63:
    case 65:
      return { condition: 'rainy', icon: '10d' }
    case 71:
    case 73:
    case 75:
      return { condition: 'snowy', icon: '13d' }
    case 80:
    case 81:
    case 82:
      return { condition: 'showers', icon: '09d' }
    case 95:
    case 96:
    case 99:
      return { condition: 'thunderstorm', icon: '11d' }
    default:
      return { condition: 'sunny', icon: '01d' }
  }
}

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  console.log('Starting weather fetch for coordinates:', `${lat}, ${lon}`)
  
  try {
    const response = await axios.get<WeatherResponse>(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
    )

    const { condition, icon } = weatherCodeToCondition(response.data.current_weather.weathercode)

    return {
      temperature: Math.round(response.data.current_weather.temperature),
      condition,
      icon,
      humidity: 60,
      windSpeed: 10
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    throw new Error('Failed to fetch weather data')
  }
} 