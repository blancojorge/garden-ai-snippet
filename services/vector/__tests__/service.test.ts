import { vectorService } from '../service'
import { Product } from '@/types/garden'

// Mock fetch
global.fetch = jest.fn()

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockImplementation(() => ({
    from: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockResolvedValue({ error: null }),
    rpc: jest.fn().mockResolvedValue({
      data: [
        {
          product_id: 'test-product-1',
          category_id: 'test-category',
          similarity: 0.9,
          metadata: {
            name: 'Test Product 1',
            description: 'Test Description 1',
            specifications: {
              test: 'value'
            }
          }
        }
      ],
      error: null
    })
  }))
}))

describe('Vector Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock fetch response
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: [
          {
            embedding: Array(768).fill(0.5) // Together's model uses 768 dimensions
          }
        ]
      })
    })
  })

  describe('indexProduct', () => {
    it('should index a product successfully', async () => {
      const product: Product = {
        id: 'test-product-1',
        name: 'Test Product',
        description: 'Test Description',
        categoryId: 'test-category',
        specifications: {
          test: 'value'
        }
      }

      await expect(vectorService.indexProduct(product)).resolves.not.toThrow()
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.together.xyz/v1/embeddings',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer'),
            'Content-Type': 'application/json'
          }),
          body: expect.stringContaining('togethercomputer/m2-bert-80M-8k-base')
        })
      )
    })

    it('should handle Together API errors', async () => {
      const product: Product = {
        id: 'test-product-1',
        name: 'Test Product',
        description: 'Test Description',
        categoryId: 'test-category',
        specifications: {
          test: 'value'
        }
      }

      // Mock fetch error
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'API Error'
      })

      await expect(vectorService.indexProduct(product)).rejects.toThrow('Together API error: API Error')
    })

    it('should handle Supabase errors', async () => {
      const product: Product = {
        id: 'test-product-1',
        name: 'Test Product',
        description: 'Test Description',
        categoryId: 'test-category',
        specifications: {
          test: 'value'
        }
      }

      // Mock Supabase error
      const mockSupabase = require('@supabase/supabase-js').createClient()
      mockSupabase.from.mockReturnThis()
      mockSupabase.upsert.mockResolvedValue({ error: new Error('Test error') })

      await expect(vectorService.indexProduct(product)).rejects.toThrow('Test error')
    })
  })

  describe('searchSimilarProducts', () => {
    it('should search for similar products successfully', async () => {
      const query = 'test query'
      const categoryId = 'test-category'
      const limit = 5

      const results = await vectorService.searchSimilarProducts(query, categoryId, limit)

      expect(results).toHaveLength(1)
      expect(results[0]).toEqual({
        id: 'test-product-1',
        name: 'Test Product 1',
        description: 'Test Description 1',
        categoryId: 'test-category',
        specifications: {
          test: 'value'
        }
      })
    })

    it('should handle Together API errors during search', async () => {
      const query = 'test query'
      const categoryId = 'test-category'
      const limit = 5

      // Mock fetch error
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'API Error'
      })

      await expect(vectorService.searchSimilarProducts(query, categoryId, limit))
        .rejects.toThrow('Together API error: API Error')
    })

    it('should handle Supabase errors during search', async () => {
      const query = 'test query'
      const categoryId = 'test-category'
      const limit = 5

      // Mock Supabase error
      const mockSupabase = require('@supabase/supabase-js').createClient()
      mockSupabase.rpc.mockResolvedValue({ error: new Error('Test error') })

      await expect(vectorService.searchSimilarProducts(query, categoryId, limit))
        .rejects.toThrow('Test error')
    })
  })

  describe('indexAllProducts', () => {
    it('should index all products successfully', async () => {
      const products: Product[] = [
        {
          id: 'test-product-1',
          name: 'Test Product 1',
          description: 'Test Description 1',
          categoryId: 'test-category',
          specifications: {
            test: 'value1'
          }
        },
        {
          id: 'test-product-2',
          name: 'Test Product 2',
          description: 'Test Description 2',
          categoryId: 'test-category',
          specifications: {
            test: 'value2'
          }
        }
      ]

      await expect(vectorService.indexAllProducts(products)).resolves.not.toThrow()
      expect(global.fetch).toHaveBeenCalledTimes(2) // Called once for each product
    })

    it('should handle errors during bulk indexing', async () => {
      const products: Product[] = [
        {
          id: 'test-product-1',
          name: 'Test Product 1',
          description: 'Test Description 1',
          categoryId: 'test-category',
          specifications: {
            test: 'value1'
          }
        }
      ]

      // Mock fetch error
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'API Error'
      })

      await expect(vectorService.indexAllProducts(products)).rejects.toThrow('Together API error: API Error')
    })
  })
}) 