import { ProductCategory } from '../../types/garden'

export class GardenService {
  private categories: ProductCategory[] = [
    {
      id: 'cortacespedes-electricos',
      name: 'Cortacéspedes Eléctricos',
      description: 'Máquinas para cortar el césped con motor eléctrico',
      specifications: [
        {
          id: 'power-type',
          name: 'Tipo de alimentación',
          type: 'single',
          options: ['eléctrico', 'batería']
        },
        {
          id: 'cutting-width',
          name: 'Ancho de corte',
          type: 'range',
          min: 30,
          max: 46,
          step: 1
        },
        {
          id: 'grass-collection',
          name: 'Recogida de césped',
          type: 'single',
          options: ['con bolsa', 'sin bolsa', 'mulching']
        },
        {
          id: 'self-propelled',
          name: 'Autopropulsado',
          type: 'single',
          options: ['sí', 'no']
        }
      ]
    },
    {
      id: 'desbrozadoras',
      name: 'Desbrozadoras',
      description: 'Máquinas para cortar hierba alta y maleza',
      specifications: [
        {
          id: 'power-type',
          name: 'Tipo de alimentación',
          type: 'single',
          options: ['eléctrico', 'batería', 'gasolina']
        },
        {
          id: 'cutting-width',
          name: 'Ancho de corte',
          type: 'range',
          min: 25,
          max: 40,
          step: 1
        },
        {
          id: 'line-type',
          name: 'Tipo de hilo',
          type: 'single',
          options: ['hilo', 'disco']
        }
      ]
    },
    {
      id: 'cortasetos',
      name: 'Cortasetos',
      description: 'Herramientas para podar y dar forma a setos',
      specifications: [
        {
          id: 'power-type',
          name: 'Tipo de alimentación',
          type: 'single',
          options: ['eléctrico', 'batería']
        },
        {
          id: 'blade-length',
          name: 'Longitud de la hoja',
          type: 'range',
          min: 40,
          max: 60,
          step: 5
        },
        {
          id: 'telescopic',
          name: 'Mango telescópico',
          type: 'single',
          options: ['sí', 'no']
        }
      ]
    },
    {
      id: 'tijeras-jardineria',
      name: 'Tijeras de Jardinería',
      description: 'Herramientas manuales para podar y cortar',
      specifications: [
        {
          id: 'blade-type',
          name: 'Tipo de hoja',
          type: 'single',
          options: ['bypass', 'yunque']
        },
        {
          id: 'blade-length',
          name: 'Longitud de la hoja',
          type: 'range',
          min: 15,
          max: 25,
          step: 1
        },
        {
          id: 'handle-type',
          name: 'Tipo de mango',
          type: 'single',
          options: ['ergonómico', 'estándar']
        }
      ]
    },
    {
      id: 'escarificadores',
      name: 'Escarificadores y Aireadores',
      description: 'Máquinas para airear y escarificar el césped',
      specifications: [
        {
          id: 'power-type',
          name: 'Tipo de alimentación',
          type: 'single',
          options: ['eléctrico', 'batería']
        },
        {
          id: 'working-width',
          name: 'Ancho de trabajo',
          type: 'range',
          min: 30,
          max: 45,
          step: 5
        },
        {
          id: 'blade-type',
          name: 'Tipo de cuchillas',
          type: 'single',
          options: ['acero', 'carburo']
        }
      ]
    }
  ]

  async getProductCategories(): Promise<ProductCategory[]> {
    return this.categories
  }
}

export const gardenService = new GardenService() 