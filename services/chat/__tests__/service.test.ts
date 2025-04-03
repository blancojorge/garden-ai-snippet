import { handleChatRequest } from '../service'
import { handleAIRequest } from '../../ai/handler'

// Mock the AI handler
jest.mock('../../ai/handler', () => ({
  handleAIRequest: jest.fn()
}))

describe('Chat Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('handleChatRequest', () => {
    it('should handle a basic chat request', async () => {
      const mockAIResponse = {
        text: 'Test response',
        products: [],
        explanation: 'Test explanation'
      }

      ;(handleAIRequest as jest.Mock).mockResolvedValue(mockAIResponse)

      const request = {
        message: 'Test message',
        location: 'Test location',
        month: 6
      }

      const response = await handleChatRequest(request)

      expect(handleAIRequest).toHaveBeenCalledWith({
        message: 'Test message',
        location: 'Test location',
        month: 6
      })

      expect(response).toEqual({
        content: 'Test response',
        products: []
      })
    })

    it('should handle a chat request with weather data', async () => {
      const mockAIResponse = {
        text: 'Test response with weather',
        products: [],
        explanation: 'Test explanation'
      }

      ;(handleAIRequest as jest.Mock).mockResolvedValue(mockAIResponse)

      const request = {
        message: 'Test message',
        location: 'Test location',
        month: 6,
        weather: {
          condition: 'sunny',
          temperature: 25,
          humidity: 60,
          windSpeed: 10,
          icon: '01d'
        }
      }

      const response = await handleChatRequest(request)

      expect(handleAIRequest).toHaveBeenCalledWith({
        message: 'Test message',
        location: 'Test location',
        month: 6,
        weather: {
          condition: 'sunny',
          temperature: 25,
          humidity: 60,
          windSpeed: 10,
          icon: '01d'
        }
      })

      expect(response).toEqual({
        content: 'Test response with weather',
        products: []
      })
    })

    it('should handle a chat request with specifications for cortacespedes-electricos', async () => {
      const mockAIResponse = {
        text: 'Test response with specifications',
        products: [],
        explanation: 'Test explanation'
      }

      ;(handleAIRequest as jest.Mock).mockResolvedValue(mockAIResponse)

      const request = {
        message: 'Test message',
        location: 'Test location',
        month: 6,
        specifications: {
          'power-type': 'eléctrico',
          'cutting-width': '40',
          'grass-collection': 'con bolsa',
          'self-propelled': 'sí'
        }
      }

      const response = await handleChatRequest(request)

      expect(handleAIRequest).toHaveBeenCalledWith({
        message: 'Test message',
        location: 'Test location',
        month: 6,
        specifications: {
          'power-type': 'eléctrico',
          'cutting-width': '40',
          'grass-collection': 'con bolsa',
          'self-propelled': 'sí'
        }
      })

      expect(response).toEqual({
        content: 'Test response with specifications',
        products: []
      })
    })

    it('should handle a chat request with specifications for pulverizadores', async () => {
      const mockAIResponse = {
        text: 'Test response with specifications',
        products: [],
        explanation: 'Test explanation'
      }

      ;(handleAIRequest as jest.Mock).mockResolvedValue(mockAIResponse)

      const request = {
        message: 'Test message',
        location: 'Test location',
        month: 6,
        specifications: {
          'capacity': '5',
          'pressure-type': 'manual',
          'spray-type': 'chorro',
          'shoulder-strap': 'sí'
        }
      }

      const response = await handleChatRequest(request)

      expect(handleAIRequest).toHaveBeenCalledWith({
        message: 'Test message',
        location: 'Test location',
        month: 6,
        specifications: {
          'capacity': '5',
          'pressure-type': 'manual',
          'spray-type': 'chorro',
          'shoulder-strap': 'sí'
        }
      })

      expect(response).toEqual({
        content: 'Test response with specifications',
        products: []
      })
    })

    it('should handle a chat request with specifications for motocultores', async () => {
      const mockAIResponse = {
        text: 'Test response with specifications',
        products: [],
        explanation: 'Test explanation'
      }

      ;(handleAIRequest as jest.Mock).mockResolvedValue(mockAIResponse)

      const request = {
        message: 'Test message',
        location: 'Test location',
        month: 6,
        specifications: {
          'power': '5',
          'working-width': '60',
          'fuel-type': 'gasolina',
          'reversible': 'sí'
        }
      }

      const response = await handleChatRequest(request)

      expect(handleAIRequest).toHaveBeenCalledWith({
        message: 'Test message',
        location: 'Test location',
        month: 6,
        specifications: {
          'power': '5',
          'working-width': '60',
          'fuel-type': 'gasolina',
          'reversible': 'sí'
        }
      })

      expect(response).toEqual({
        content: 'Test response with specifications',
        products: []
      })
    })

    it('should handle a chat request with specifications for sembradoras', async () => {
      const mockAIResponse = {
        text: 'Test response with specifications',
        products: [],
        explanation: 'Test explanation'
      }

      ;(handleAIRequest as jest.Mock).mockResolvedValue(mockAIResponse)

      const request = {
        message: 'Test message',
        location: 'Test location',
        month: 6,
        specifications: {
          'seed-type': 'medianas',
          'row-spacing': '30',
          'depth-control': 'sí',
          'hopper-capacity': '5'
        }
      }

      const response = await handleChatRequest(request)

      expect(handleAIRequest).toHaveBeenCalledWith({
        message: 'Test message',
        location: 'Test location',
        month: 6,
        specifications: {
          'seed-type': 'medianas',
          'row-spacing': '30',
          'depth-control': 'sí',
          'hopper-capacity': '5'
        }
      })

      expect(response).toEqual({
        content: 'Test response with specifications',
        products: []
      })
    })

    it('should handle AI handler errors gracefully', async () => {
      const error = new Error('AI handler error')
      ;(handleAIRequest as jest.Mock).mockRejectedValue(error)

      const request = {
        message: 'Test message',
        location: 'Test location',
        month: 6
      }

      const response = await handleChatRequest(request)

      expect(response).toEqual({
        content: 'Lo siento, ha ocurrido un error al procesar tu pregunta. Por favor, inténtalo de nuevo.',
        products: []
      })
    })
  })
}) 