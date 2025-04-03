export interface WeatherData {
  temperature: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
}

export interface LocationData {
  region: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface ProductRecommendation {
  id: string
  name: string
  description: string
  price: number
  image: string
  url: string
}

export interface Message {
  text: string
  isUser: boolean
}

export interface ChatContext {
  location: string
  weather: string
  temperature: number
} 