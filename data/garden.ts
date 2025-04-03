import { GardenData } from '../types/garden'

export const gardenData: GardenData = {
  regions: [
    {
      id: 'galicia',
      name: 'Galicia',
      description: 'Clima húmedo con lluvias frecuentes y temperaturas suaves'
    },
    {
      id: 'asturias',
      name: 'Asturias',
      description: 'Clima húmedo con lluvias frecuentes y temperaturas suaves'
    },
    {
      id: 'madrid',
      name: 'Madrid',
      description: 'Clima seco con inviernos fríos y veranos calurosos'
    },
    {
      id: 'andalucia',
      name: 'Andalucía',
      description: 'Clima cálido con veranos secos y inviernos suaves'
    }
  ],

  seasons: [
    {
      id: 'spring',
      name: 'Primavera',
      description: 'Temporada de crecimiento y floración',
      months: [3, 4, 5]
    },
    {
      id: 'summer',
      name: 'Verano',
      description: 'Temporada de mantenimiento y riego intensivo',
      months: [6, 7, 8]
    },
    {
      id: 'fall',
      name: 'Otoño',
      description: 'Temporada de preparación y limpieza',
      months: [9, 10, 11]
    },
    {
      id: 'winter',
      name: 'Invierno',
      description: 'Temporada de descanso y protección',
      months: [12, 1, 2]
    }
  ],

  tasks: [
    {
      id: 'prepare-soil',
      name: 'Preparar el suelo para la siembra',
      description: 'Preparación del terreno para nuevos cultivos',
      seasonId: 'spring',
      regionId: 'madrid',
      relatedSeasons: ['spring', 'fall'],
      relatedRegions: ['galicia', 'madrid', 'asturias', 'andalucia'],
      requiredTools: ['motocultores', 'azadas', 'rastrillos']
    },
    {
      id: 'plant-spring-vegetables',
      name: 'Plantar hortalizas de primavera',
      description: 'Siembra de cultivos de temporada primaveral',
      seasonId: 'spring',
      regionId: 'madrid',
      relatedSeasons: ['spring'],
      relatedRegions: ['galicia', 'madrid', 'andalucia', 'asturias'],
      requiredTools: ['semillas', 'palas', 'regaderas', 'motocultores', 'sembradoras']
    }
  ],

  suggestedQuestions: [
    {
      id: 'lawn-mower',
      text: '¿Necesitas renovar tu cortacésped?',
      categoryId: 'cortacespedes-electricos',
      relatedProductCategories: ['cortacespedes-electricos']
    },
    {
      id: 'lawn-robot',
      text: '¿Has oído hablar de los robot cortacésped?',
      categoryId: 'cortacespedes-robot',
      relatedProductCategories: ['cortacespedes-robot']
    },
    {
      id: 'sprayer-pests',
      text: '¿No sabes qué pulverizador necesitas para tratar plagas en tu huerto?',
      categoryId: 'pulverizadores',
      relatedProductCategories: ['pulverizadores']
    },
    {
      id: 'sprayer-weed',
      text: '¿No sabes qué pulverizador necesitas para tratar hierbas en tu huerto?',
      categoryId: 'pulverizadores',
      relatedProductCategories: ['pulverizadores']
    }
  ],

  productCategories: [
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
      id: 'pulverizadores',
      name: 'Pulverizadores',
      description: 'Herramientas para aplicar tratamientos fitosanitarios',
      specifications: [
        {
          id: 'capacity',
          name: 'Capacidad',
          type: 'range',
          min: 1,
          max: 20,
          step: 1
        },
        {
          id: 'pressure-type',
          name: 'Tipo de presión',
          type: 'single',
          options: ['manual', 'eléctrico']
        },
        {
          id: 'spray-type',
          name: 'Tipo de pulverización',
          type: 'single',
          options: ['chorro', 'niebla', 'abanico']
        },
        {
          id: 'shoulder-strap',
          name: 'Correa para hombro',
          type: 'single',
          options: ['sí', 'no']
        }
      ]
    },
    {
      id: 'motocultores',
      name: 'Motocultores',
      description: 'Máquinas para labrar y preparar el terreno',
      specifications: [
        {
          id: 'power',
          name: 'Potencia',
          type: 'range',
          min: 1,
          max: 10,
          step: 1
        },
        {
          id: 'working-width',
          name: 'Ancho de trabajo',
          type: 'range',
          min: 30,
          max: 100,
          step: 5
        },
        {
          id: 'fuel-type',
          name: 'Tipo de combustible',
          type: 'single',
          options: ['gasolina', 'diésel', 'eléctrico']
        },
        {
          id: 'reversible',
          name: 'Reversible',
          type: 'single',
          options: ['sí', 'no']
        }
      ]
    }
  ],

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
    },
    {
      id: 'capacity',
      name: 'Capacidad',
      type: 'range',
      min: 1,
      max: 20,
      step: 1
    },
    {
      id: 'pressure-type',
      name: 'Tipo de presión',
      type: 'single',
      options: ['manual', 'eléctrico']
    },
    {
      id: 'spray-type',
      name: 'Tipo de pulverización',
      type: 'single',
      options: ['chorro', 'niebla', 'abanico']
    },
    {
      id: 'shoulder-strap',
      name: 'Correa para hombro',
      type: 'single',
      options: ['sí', 'no']
    },
    {
      id: 'power',
      name: 'Potencia',
      type: 'range',
      min: 1,
      max: 10,
      step: 1
    },
    {
      id: 'working-width',
      name: 'Ancho de trabajo',
      type: 'range',
      min: 30,
      max: 100,
      step: 5
    },
    {
      id: 'fuel-type',
      name: 'Tipo de combustible',
      type: 'single',
      options: ['gasolina', 'diésel', 'eléctrico']
    },
    {
      id: 'reversible',
      name: 'Reversible',
      type: 'single',
      options: ['sí', 'no']
    }
  ],

  relationships: {
    taskSeasons: {
      'prepare-soil': ['spring', 'fall'],
      'plant-spring-vegetables': ['spring']
    },
    taskProducts: {
      'prepare-soil': ['motocultores', 'azadas', 'rastrillos'],
      'plant-spring-vegetables': ['semillas', 'palas', 'regaderas', 'motocultores', 'sembradoras']
    },
    questionProducts: {
      'lawn-mower': ['cortacespedes-electricos'],
      'lawn-robot': ['cortacespedes-robot'],
      'sprayer-pests': ['pulverizadores'],
      'sprayer-weed': ['pulverizadores']
    },
    categorySpecifications: {
      'cortacespedes-electricos': ['power-type', 'cutting-width', 'grass-collection', 'self-propelled'],
      'pulverizadores': ['capacity', 'pressure-type', 'spray-type', 'shoulder-strap'],
      'motocultores': ['power', 'working-width', 'fuel-type', 'reversible']
    }
  }
} 