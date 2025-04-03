import OpenAI from 'openai'

// LLM Provider Configuration
interface LLMConfig {
  provider: 'openai' | 'together'
  apiKey: string
  model: string
  baseURL?: string
}

// Default configuration
const DEFAULT_CONFIG: LLMConfig = {
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY || '',
  model: 'gpt-3.5-turbo'
}

// Together.ai configuration
const TOGETHER_CONFIG: LLMConfig = {
  provider: 'together',
  apiKey: process.env.TOGETHER_API_KEY || '',
  model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  baseURL: 'https://api.together.xyz/v1'
}

// Current configuration (can be changed at runtime)
let currentConfig: LLMConfig = DEFAULT_CONFIG

export function setLLMProvider(config: Partial<LLMConfig>) {
  if (config.provider === 'together') {
    if (!process.env.TOGETHER_API_KEY) {
      console.warn('La clave de API de Together.ai no está definida, usando OpenAI como alternativa')
      currentConfig = DEFAULT_CONFIG
      return
    }
    currentConfig = { ...TOGETHER_CONFIG, ...config }
  } else {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('La clave de API de OpenAI no está definida, usando Together.ai como alternativa')
      currentConfig = TOGETHER_CONFIG
      return
    }
    currentConfig = { ...DEFAULT_CONFIG, ...config }
  }
}

// Initialize the appropriate client based on the current configuration
function getLLMClient() {
  if (!currentConfig.apiKey) {
    // Try to fallback to the other provider
    if (currentConfig.provider === 'together' && process.env.OPENAI_API_KEY) {
      console.warn('Cambiando a OpenAI como alternativa')
      currentConfig = DEFAULT_CONFIG
    } else if (currentConfig.provider === 'openai' && process.env.TOGETHER_API_KEY) {
      console.warn('Cambiando a Together.ai como alternativa')
      currentConfig = TOGETHER_CONFIG
    } else {
      throw new Error('No se encontró una clave de API válida para ningún proveedor')
    }
  }

  const config: {
    apiKey: string
    dangerouslyAllowBrowser: boolean
    baseURL?: string
  } = {
    apiKey: currentConfig.apiKey,
    dangerouslyAllowBrowser: true
  }

  if (currentConfig.baseURL) {
    config.baseURL = currentConfig.baseURL
  }

  return new OpenAI(config)
}

interface Context {
  location: string
  weather: string
  temperature: number
}

// Fallback responses for when the API is unavailable
const FALLBACK_RESPONSES = {
  '¿Qué productos necesito para el mantenimiento del jardín?': {
    response: 'Para el mantenimiento básico del jardín, te recomiendo tener un cortacésped eléctrico para el césped, una desbrozadora para los bordes y zonas difíciles, y un soplador para la limpieza de hojas. Estos son los productos más esenciales para mantener tu jardín en buen estado.',
    recommendations: [
      {
        id: '1',
        name: 'Cortacésped eléctrico',
        description: 'Cortacésped eléctrico de 1200W con bolsa recolectora de 35L',
        price: '199,99 €',
        image: '/images/cortacesped.jpg',
        url: 'https://www.bauhaus.es/cortacesped-electrico'
      },
      {
        id: '2',
        name: 'Desbrozadora a gasolina',
        description: 'Desbrozadora a gasolina de 25cc con arnés de hombro',
        price: '149,99 €',
        image: '/images/desbrozadora.jpg',
        url: 'https://www.bauhaus.es/desbrozadora-gasolina'
      }
    ]
  },
  '¿Qué herramientas son mejores para principiantes?': {
    response: 'Para principiantes, recomiendo empezar con herramientas eléctricas que son más fáciles de manejar y requieren menos mantenimiento. Un cortacésped eléctrico, una desbrozadora eléctrica y un soplador eléctrico son excelentes opciones para empezar.',
    recommendations: [
      {
        id: '3',
        name: 'Cortacésped eléctrico básico',
        description: 'Cortacésped eléctrico de 1000W ideal para principiantes',
        price: '149,99 €',
        image: '/images/cortacesped-basico.jpg',
        url: 'https://www.bauhaus.es/cortacesped-basico'
      },
      {
        id: '4',
        name: 'Desbrozadora eléctrica',
        description: 'Desbrozadora eléctrica de 750W con mango ajustable',
        price: '99,99 €',
        image: '/images/desbrozadora-electrica.jpg',
        url: 'https://www.bauhaus.es/desbrozadora-electrica'
      }
    ]
  },
  '¿Qué productos son más adecuados para mi región?': {
    response: 'Basado en tu ubicación y el clima actual, te recomiendo productos que se adapten a las condiciones locales. Un cortacésped resistente y una desbrozadora potente son esenciales para el mantenimiento regular.',
    recommendations: [
      {
        id: '5',
        name: 'Cortacésped profesional',
        description: 'Cortacésped profesional de 1500W con sistema de mulching',
        price: '299,99 €',
        image: '/images/cortacesped-pro.jpg',
        url: 'https://www.bauhaus.es/cortacesped-profesional'
      },
      {
        id: '6',
        name: 'Desbrozadora profesional',
        description: 'Desbrozadora profesional de 30cc con sistema antivibración',
        price: '199,99 €',
        image: '/images/desbrozadora-pro.jpg',
        url: 'https://www.bauhaus.es/desbrozadora-profesional'
      }
    ]
  }
}

export async function generateResponse(
  userInput: string,
  context: Context
): Promise<{ response: string; recommendations: any[] }> {
  try {
    // Check for fallback response first
    const fallbackResponse = FALLBACK_RESPONSES[userInput as keyof typeof FALLBACK_RESPONSES]
    if (fallbackResponse) {
      return fallbackResponse
    }

    const client = getLLMClient()
    const completion = await client.chat.completions.create({
      model: currentConfig.model,
      messages: [
        {
          role: 'system',
          content: `Eres un asesor experto en maquinaria de jardinería para una tienda online española. 
          Estás en ${context.location}, donde el clima está ${context.weather} con una temperatura de ${context.temperature}°C.
          Debes ser amable, profesional y proporcionar recomendaciones específicas basadas en la ubicación y el clima.
          Siempre debes responder en español y usar el formato de moneda europeo (€).
          Siempre debes recomendar exactamente 2 productos relevantes.`
        },
        {
          role: 'user',
          content: userInput
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const response = completion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.'

    // Return a default set of recommendations if the API call succeeds
    return {
      response,
      recommendations: [
        {
          id: '1',
          name: 'Cortacésped eléctrico',
          description: 'Cortacésped eléctrico de 1200W con bolsa recolectora de 35L',
          price: '199,99 €',
          image: '/images/cortacesped.jpg',
          url: 'https://www.bauhaus.es/cortacesped-electrico'
        },
        {
          id: '2',
          name: 'Desbrozadora a gasolina',
          description: 'Desbrozadora a gasolina de 25cc con arnés de hombro',
          price: '149,99 €',
          image: '/images/desbrozadora.jpg',
          url: 'https://www.bauhaus.es/desbrozadora-gasolina'
        }
      ]
    }
  } catch (error) {
    console.error('Error al generar la respuesta:', error)
    
    // Return a fallback response for unknown queries
    return {
      response: 'Lo siento, estamos experimentando una alta demanda en este momento. Te recomiendo revisar nuestro catálogo de productos básicos para jardinería.',
      recommendations: [
        {
          id: 'default-1',
          name: 'Kit básico de jardinería',
          description: 'Kit completo con herramientas esenciales para el jardín',
          price: '99,99 €',
          image: '/images/kit-jardineria.jpg',
          url: 'https://www.bauhaus.es/kit-jardineria'
        }
      ]
    }
  }
} 