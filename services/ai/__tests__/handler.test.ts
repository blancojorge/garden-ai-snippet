import { handleAIRequest } from '../handler'
import { getProductById } from '@/lib/products'

// Mock the products module
jest.mock('@/lib/products', () => ({
  getProductById: jest.fn()
}))

// Mock the fetch function
global.fetch = jest.fn()

describe('AI Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  describe('handleAIRequest', () => {
    it('should handle a basic request', async () => {
      const mockAIResponse = {
        choices: [{
          message: {
            content: 'Test response with [Product 1](https://www.bauhaus.es/p/123)'
          }
        }]
      }

      const mockProduct = {
        id: '123',
        name: 'Product 1',
        price: 100,
        image: 'product1.jpg'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAIResponse)
      })

      ;(getProductById as jest.Mock).mockReturnValue(mockProduct)

      const request = {
        message: 'Test message',
        location: 'Test location',
        month: 6
      }

      const response = await handleAIRequest(request)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/chat/completions'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': expect.stringContaining('Bearer')
          }),
          body: expect.stringContaining('Test message')
        })
      )

      expect(getProductById).toHaveBeenCalledWith('123')
      expect(response).toEqual({
        text: 'Test response with [Product 1](https://www.bauhaus.es/p/123)',
        products: [mockProduct],
        explanation: 'Basado en tu pregunta, te recomiendo estos productos de Bauhaus:'
      })
    })

    it('should handle a request with weather data', async () => {
      const mockAIResponse = {
        choices: [{
          message: {
            content: 'Test response with weather'
          }
        }]
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAIResponse)
      })

      const request = {
        message: 'Test message',
        location: 'Test location',
        month: 6,
        weather: {
          condition: 'sunny',
          temperature: 25,
          humidity: 60,
          windSpeed: 10
        }
      }

      const response = await handleAIRequest(request)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('Clima: sunny')
        })
      )

      expect(response).toEqual({
        text: 'Test response with weather',
        products: [],
        explanation: 'No se encontraron productos en las categorías mencionadas. Por favor, intenta con otra categoría.'
      })
    })

    it('should handle a request with specifications', async () => {
      const mockAIResponse = {
        choices: [{
          message: {
            content: 'Test response with specifications'
          }
        }]
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAIResponse)
      })

      const request = {
        message: 'Test message',
        location: 'Test location',
        month: 6,
        specifications: {
          'garden-size': 'medium',
          'terrain-type': 'flat'
        }
      }

      const response = await handleAIRequest(request)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('garden-size: medium')
        })
      )

      expect(response).toEqual({
        text: 'Test response with specifications',
        products: [],
        explanation: 'No se encontraron productos en las categorías mencionadas. Por favor, intenta con otra categoría.'
      })
    })

    it('should handle API errors gracefully', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ error: 'API Error' })
      })

      const request = {
        message: 'Test message',
        location: 'Test location',
        month: 6
      }

      await expect(handleAIRequest(request)).rejects.toThrow('Together AI API error: Internal Server Error - {"error":"API Error"}')
    })

    it('should handle network errors gracefully', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const request = {
        message: 'Test message',
        location: 'Test location',
        month: 6
      }

      await expect(handleAIRequest(request)).rejects.toThrow('Network error')
    })
  })
}) 