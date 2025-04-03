import { gardenData } from '../../data/garden'
import { 
  GardenData, 
  Region, 
  Season, 
  Task, 
  SuggestedQuestion, 
  ProductCategory, 
  Specification,
  ConversationState,
  Product
} from '../../types/garden'

class GardenService {
  private data: GardenData

  constructor(data: GardenData) {
    this.data = data
  }

  // Region methods
  getRegions(): Region[] {
    return this.data.regions
  }

  getRegionById(id: string): Region | undefined {
    return this.data.regions.find(region => region.id === id)
  }

  // Season methods
  getSeasons(): Season[] {
    return this.data.seasons
  }

  getSeasonById(id: string): Season | undefined {
    return this.data.seasons.find(season => season.id === id)
  }

  getCurrentSeason(): Season | undefined {
    const currentMonth = new Date().getMonth() + 1
    return this.data.seasons.find(season => 
      season.months.includes(currentMonth)
    )
  }

  // Task methods
  getTasks(): Task[] {
    return this.data.tasks
  }

  getTasksBySeason(seasonId: string): Task[] {
    return this.data.tasks.filter(task => 
      task.relatedSeasons.includes(seasonId)
    )
  }

  getTasksByRegion(regionId: string): Task[] {
    return this.data.tasks.filter(task => 
      task.relatedRegions.includes(regionId)
    )
  }

  // Question methods
  getSuggestedQuestions(): SuggestedQuestion[] {
    return this.data.suggestedQuestions
  }

  getQuestionsByCategory(categoryId: string): SuggestedQuestion[] {
    return this.data.suggestedQuestions.filter(question =>
      question.relatedProductCategories.includes(categoryId)
    )
  }

  // Product Category methods
  getProductCategories(): ProductCategory[] {
    return this.data.productCategories
  }

  getProductCategoryById(id: string): ProductCategory | undefined {
    return this.data.productCategories.find(category => category.id === id)
  }

  getCategoriesByTask(taskId: string): ProductCategory[] {
    const categoryIds = this.data.relationships.taskProducts[taskId] || []
    return this.data.productCategories.filter(category => 
      categoryIds.includes(category.id)
    )
  }

  // Specification methods
  getSpecificationsByCategory(categoryId: string): Specification[] {
    const specIds = this.data.relationships.categorySpecifications[categoryId] || []
    return this.data.specifications.filter(spec => 
      specIds.includes(spec.id)
    )
  }

  // Conversation state management
  getNextSpecification(state: ConversationState): Specification | null {
    if (!state.currentCategory) return null

    const categorySpecs = this.getSpecificationsByCategory(state.currentCategory)
    const unansweredSpec = categorySpecs.find(spec => 
      !state.answeredSpecifications[spec.id]
    )

    return unansweredSpec || null
  }

  // Helper methods
  getRelatedProducts(taskId: string): ProductCategory[] {
    const categoryIds = this.data.relationships.taskProducts[taskId] || []
    return this.data.productCategories.filter(category => 
      categoryIds.includes(category.id)
    )
  }

  getRelatedTasks(categoryId: string): Task[] {
    return this.data.tasks.filter(task => 
      task.requiredTools.includes(categoryId)
    )
  }

  public getProductsByCategory(categoryId: string): Product[] {
    const category = this.getProductCategoryById(categoryId)
    if (!category) {
      return []
    }

    // This is a placeholder - in a real application, this would fetch from a database
    // For now, we'll return some example products based on the category
    const exampleProducts: Record<string, Product[]> = {
      'cortacespedes-electricos': [
        {
          id: 'cortacesped-1',
          name: 'Cortacésped Eléctrico GreenPower 40',
          description: 'Cortacésped eléctrico con ancho de corte de 40cm, ideal para jardines medianos.',
          categoryId: 'cortacespedes-electricos',
          specifications: {
            'power-type': 'eléctrico',
            'cutting-width': '40',
            'grass-collection': 'con bolsa',
            'self-propelled': 'sí'
          }
        },
        {
          id: 'cortacesped-2',
          name: 'Cortacésped Eléctrico EcoCut 35',
          description: 'Cortacésped eléctrico compacto con ancho de corte de 35cm, perfecto para jardines pequeños.',
          categoryId: 'cortacespedes-electricos',
          specifications: {
            'power-type': 'eléctrico',
            'cutting-width': '35',
            'grass-collection': 'mulching',
            'self-propelled': 'no'
          }
        }
      ],
      'pulverizadores': [
        {
          id: 'pulverizador-1',
          name: 'Pulverizador Manual GardenPro 5L',
          description: 'Pulverizador manual con capacidad de 5 litros, ideal para tratamientos fitosanitarios.',
          categoryId: 'pulverizadores',
          specifications: {
            'capacity': '5',
            'pressure-type': 'manual',
            'spray-type': 'chorro',
            'shoulder-strap': 'sí'
          }
        },
        {
          id: 'pulverizador-2',
          name: 'Pulverizador a Presión 10L',
          description: 'Pulverizador a presión con capacidad de 10 litros, perfecto para grandes superficies.',
          categoryId: 'pulverizadores',
          specifications: {
            'capacity': '10',
            'pressure-type': 'presión',
            'spray-type': 'abanico',
            'shoulder-strap': 'sí'
          }
        }
      ],
      'motocultores': [
        {
          id: 'motocultor-1',
          name: 'Motocultor Diesel 5HP',
          description: 'Motocultor diesel con potencia de 5HP, ideal para trabajos pesados.',
          categoryId: 'motocultores',
          specifications: {
            'power': '5',
            'working-width': '60',
            'fuel-type': 'diesel',
            'reversible': 'sí'
          }
        },
        {
          id: 'motocultor-2',
          name: 'Motocultor Gasolina 4HP',
          description: 'Motocultor a gasolina con potencia de 4HP, perfecto para huertos medianos.',
          categoryId: 'motocultores',
          specifications: {
            'power': '4',
            'working-width': '50',
            'fuel-type': 'gasolina',
            'reversible': 'no'
          }
        }
      ],
      'sembradoras': [
        {
          id: 'sembradora-1',
          name: 'Sembradora Manual 4L',
          description: 'Sembradora manual con capacidad de 4 litros, ideal para semillas medianas.',
          categoryId: 'sembradoras',
          specifications: {
            'seed-type': 'medianas',
            'row-spacing': '30',
            'depth-control': 'sí',
            'hopper-capacity': '4'
          }
        },
        {
          id: 'sembradora-2',
          name: 'Sembradora Manual 2L',
          description: 'Sembradora manual compacta con capacidad de 2 litros, perfecta para semillas pequeñas.',
          categoryId: 'sembradoras',
          specifications: {
            'seed-type': 'pequeñas',
            'row-spacing': '20',
            'depth-control': 'sí',
            'hopper-capacity': '2'
          }
        }
      ]
    }

    return exampleProducts[categoryId] || []
  }
}

// Export a singleton instance
export const gardenService = new GardenService(gardenData) 