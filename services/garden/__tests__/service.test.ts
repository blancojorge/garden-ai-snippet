import { gardenService } from '../service'
import { gardenData } from '../../../../data/garden'

describe('Garden Service', () => {
  describe('getRegions', () => {
    it('should return all regions', () => {
      const regions = gardenService.getRegions()
      expect(regions).toEqual(gardenData.regions)
    })
  })

  describe('getRegionById', () => {
    it('should return the correct region by id', () => {
      const region = gardenService.getRegionById('north')
      expect(region).toEqual(gardenData.regions[0])
    })

    it('should return undefined for non-existent region', () => {
      const region = gardenService.getRegionById('non-existent')
      expect(region).toBeUndefined()
    })
  })

  describe('getSeasons', () => {
    it('should return all seasons', () => {
      const seasons = gardenService.getSeasons()
      expect(seasons).toEqual(gardenData.seasons)
    })
  })

  describe('getSeasonById', () => {
    it('should return the correct season by id', () => {
      const season = gardenService.getSeasonById('spring')
      expect(season).toEqual(gardenData.seasons[0])
    })

    it('should return undefined for non-existent season', () => {
      const season = gardenService.getSeasonById('non-existent')
      expect(season).toBeUndefined()
    })
  })

  describe('getTasks', () => {
    it('should return all tasks', () => {
      const tasks = gardenService.getTasks()
      expect(tasks).toEqual(gardenData.tasks)
    })
  })

  describe('getTaskById', () => {
    it('should return the correct task by id', () => {
      const task = gardenService.getTaskById('pruning')
      expect(task).toEqual(gardenData.tasks[0])
    })

    it('should return undefined for non-existent task', () => {
      const task = gardenService.getTaskById('non-existent')
      expect(task).toBeUndefined()
    })
  })

  describe('getSuggestedQuestions', () => {
    it('should return all suggested questions', () => {
      const questions = gardenService.getSuggestedQuestions()
      expect(questions).toEqual(gardenData.suggestedQuestions)
    })
  })

  describe('getProductCategories', () => {
    it('should return all product categories with their specifications', () => {
      const categories = gardenService.getProductCategories()
      expect(categories).toEqual(gardenData.productCategories)
      expect(categories[0].specifications).toHaveLength(4) // cortacespedes-electricos
      expect(categories[1].specifications).toHaveLength(4) // pulverizadores
      expect(categories[2].specifications).toHaveLength(4) // motocultores
      expect(categories[3].specifications).toHaveLength(4) // sembradoras
    })
  })

  describe('getProductCategoryById', () => {
    it('should return the correct product category with all specifications', () => {
      const category = gardenService.getProductCategoryById('cortacespedes-electricos')
      expect(category).toEqual(gardenData.productCategories[0])
      expect(category?.specifications).toContainEqual(
        expect.objectContaining({
          id: 'power-type',
          name: 'Tipo de alimentación',
          type: 'single',
          options: ['eléctrico', 'batería']
        })
      )
      expect(category?.specifications).toContainEqual(
        expect.objectContaining({
          id: 'grass-collection',
          name: 'Recogida de césped',
          type: 'single',
          options: ['con bolsa', 'sin bolsa', 'mulching']
        })
      )
    })

    it('should return undefined for non-existent category', () => {
      const category = gardenService.getProductCategoryById('non-existent')
      expect(category).toBeUndefined()
    })
  })

  describe('getSpecifications', () => {
    it('should return all specifications', () => {
      const specifications = gardenService.getSpecifications()
      expect(specifications).toEqual(gardenData.specifications)
      expect(specifications).toHaveLength(16) // Total number of specifications
    })
  })

  describe('getSpecificationById', () => {
    it('should return the correct specification by id', () => {
      const specification = gardenService.getSpecificationById('grass-collection')
      expect(specification).toEqual(
        expect.objectContaining({
          id: 'grass-collection',
          name: 'Recogida de césped',
          type: 'single',
          options: ['con bolsa', 'sin bolsa', 'mulching']
        })
      )
    })

    it('should return undefined for non-existent specification', () => {
      const specification = gardenService.getSpecificationById('non-existent')
      expect(specification).toBeUndefined()
    })
  })

  describe('getSpecificationsByCategory', () => {
    it('should return all specifications for cortacespedes-electricos', () => {
      const specifications = gardenService.getSpecificationsByCategory('cortacespedes-electricos')
      expect(specifications).toHaveLength(4)
      expect(specifications).toEqual([
        expect.objectContaining({ id: 'power-type' }),
        expect.objectContaining({ id: 'cutting-width' }),
        expect.objectContaining({ id: 'grass-collection' }),
        expect.objectContaining({ id: 'self-propelled' })
      ])
    })

    it('should return all specifications for pulverizadores', () => {
      const specifications = gardenService.getSpecificationsByCategory('pulverizadores')
      expect(specifications).toHaveLength(4)
      expect(specifications).toEqual([
        expect.objectContaining({ id: 'capacity' }),
        expect.objectContaining({ id: 'pressure-type' }),
        expect.objectContaining({ id: 'spray-type' }),
        expect.objectContaining({ id: 'shoulder-strap' })
      ])
    })

    it('should return all specifications for motocultores', () => {
      const specifications = gardenService.getSpecificationsByCategory('motocultores')
      expect(specifications).toHaveLength(4)
      expect(specifications).toEqual([
        expect.objectContaining({ id: 'power' }),
        expect.objectContaining({ id: 'working-width' }),
        expect.objectContaining({ id: 'fuel-type' }),
        expect.objectContaining({ id: 'reversible' })
      ])
    })

    it('should return all specifications for sembradoras', () => {
      const specifications = gardenService.getSpecificationsByCategory('sembradoras')
      expect(specifications).toHaveLength(4)
      expect(specifications).toEqual([
        expect.objectContaining({ id: 'seed-type' }),
        expect.objectContaining({ id: 'row-spacing' }),
        expect.objectContaining({ id: 'depth-control' }),
        expect.objectContaining({ id: 'hopper-capacity' })
      ])
    })

    it('should return empty array for category with no specifications', () => {
      const specifications = gardenService.getSpecificationsByCategory('non-existent')
      expect(specifications).toEqual([])
    })
  })

  describe('getNextSpecification', () => {
    it('should return the next unanswered specification for cortacespedes-electricos', () => {
      const conversationState = {
        currentCategory: 'cortacespedes-electricos',
        currentSpecification: 'power-type',
        answeredSpecifications: {
          'power-type': 'eléctrico'
        }
      }
      const nextSpec = gardenService.getNextSpecification(conversationState)
      expect(nextSpec).toEqual(
        expect.objectContaining({
          id: 'cutting-width',
          name: 'Ancho de corte'
        })
      )
    })

    it('should return the next unanswered specification for pulverizadores', () => {
      const conversationState = {
        currentCategory: 'pulverizadores',
        currentSpecification: 'capacity',
        answeredSpecifications: {
          'capacity': '5'
        }
      }
      const nextSpec = gardenService.getNextSpecification(conversationState)
      expect(nextSpec).toEqual(
        expect.objectContaining({
          id: 'pressure-type',
          name: 'Tipo de presión'
        })
      )
    })

    it('should return the next unanswered specification for motocultores', () => {
      const conversationState = {
        currentCategory: 'motocultores',
        currentSpecification: 'power',
        answeredSpecifications: {
          'power': '5'
        }
      }
      const nextSpec = gardenService.getNextSpecification(conversationState)
      expect(nextSpec).toEqual(
        expect.objectContaining({
          id: 'working-width',
          name: 'Ancho de trabajo'
        })
      )
    })

    it('should return the next unanswered specification for sembradoras', () => {
      const conversationState = {
        currentCategory: 'sembradoras',
        currentSpecification: 'seed-type',
        answeredSpecifications: {
          'seed-type': 'medianas'
        }
      }
      const nextSpec = gardenService.getNextSpecification(conversationState)
      expect(nextSpec).toEqual(
        expect.objectContaining({
          id: 'row-spacing',
          name: 'Separación entre líneas'
        })
      )
    })

    it('should return undefined when all specifications are answered', () => {
      const conversationState = {
        currentCategory: 'cortacespedes-electricos',
        currentSpecification: 'self-propelled',
        answeredSpecifications: {
          'power-type': 'eléctrico',
          'cutting-width': '40',
          'grass-collection': 'con bolsa',
          'self-propelled': 'sí'
        }
      }
      const nextSpec = gardenService.getNextSpecification(conversationState)
      expect(nextSpec).toBeUndefined()
    })

    it('should return undefined for non-existent category', () => {
      const conversationState = {
        currentCategory: 'non-existent',
        currentSpecification: null,
        answeredSpecifications: {}
      }
      const nextSpec = gardenService.getNextSpecification(conversationState)
      expect(nextSpec).toBeUndefined()
    })
  })
}) 