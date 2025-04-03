import { GardenData } from '@/types/garden'

export const gardenData: GardenData = {
  regions: [
    {
      id: 'galicia',
      name: 'Galicia',
      climate: 'oceánico',
      description: 'Clima húmedo con lluvias frecuentes y temperaturas suaves'
    },
    {
      id: 'asturias',
      name: 'Asturias',
      climate: 'oceánico',
      description: 'Clima húmedo con lluvias frecuentes y temperaturas suaves'
    },
    {
      id: 'madrid',
      name: 'Madrid',
      climate: 'mediterráneo continental',
      description: 'Clima seco con inviernos fríos y veranos calurosos'
    },
    {
      id: 'andalucia',
      name: 'Andalucía',
      climate: 'mediterráneo',
      description: 'Clima cálido con veranos secos y inviernos suaves'
    }
  ],

  seasons: [
    {
      id: 'spring',
      name: 'Primavera',
      months: [3, 4, 5],
      typicalWeather: ['soleado', 'lluvioso', 'templado'],
      description: 'Temporada de crecimiento y floración'
    },
    {
      id: 'summer',
      name: 'Verano',
      months: [6, 7, 8],
      typicalWeather: ['caluroso', 'seco', 'soleado'],
      description: 'Temporada de mantenimiento y riego intensivo'
    },
    {
      id: 'fall',
      name: 'Otoño',
      months: [9, 10, 11],
      typicalWeather: ['templado', 'lluvioso', 'ventoso'],
      description: 'Temporada de preparación y limpieza'
    },
    {
      id: 'winter',
      name: 'Invierno',
      months: [12, 1, 2],
      typicalWeather: ['frío', 'heladas', 'nieve'],
      description: 'Temporada de descanso y protección'
    }
  ],

  tasks: [
    {
      id: 'prepare-soil',
      name: 'Preparar el suelo para la siembra',
      description: 'Preparación del terreno para nuevos cultivos',
      difficulty: 'medium',
      duration: '2-3 horas',
      relatedSeasons: ['spring', 'fall'],
      relatedRegions: ['galicia', 'madrid', 'asturias', 'andalucia'],
      requiredTools: ['motocultores', 'azadas', 'rastrillos']
    },
    {
      id: 'plant-spring-vegetables',
      name: 'Plantar hortalizas de primavera',
      description: 'Siembra de cultivos de temporada primaveral',
      difficulty: 'easy',
      duration: '1-2 horas',
      relatedSeasons: ['spring'],
      relatedRegions: ['galicia', 'madrid', 'andalucia', 'asturias'],
      requiredTools: ['semillas', 'palas', 'regaderas', 'motocultores', 'sembradoras']
    }
  ],

  suggestedQuestions: [
    {
      id: 'lawn-mower',
      text: '¿Necesitas renovar tu cortacésped?',
      relatedProductCategories: ['cortacespedes'],
      relatedTasks: ['maintain-lawn']
    },
    {
      id: 'lawn-robot',
      text: '¿Has oído hablar de los robot cortacésped?',
      relatedProductCategories: ['cortacespedes-robot'],
      relatedTasks: ['maintain-lawn']
    },
    {
      id: 'sprayer-pests',
      text: '¿No sabes qué pulverizador necesitas para tratar plagas en tu huerto?',
      relatedProductCategories: ['pulverizadores'],
      relatedTasks: ['treat-pests']
    },
    {
      id: 'sprayer-weed',
      text: '¿No sabes qué pulverizador necesitas para tratar hierbas en tu huerto?',
      relatedProductCategories: ['pulverizadores'],
      relatedTasks: ['treat-weed']
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
          options: ['eléctrico', 'batería'],
          categoryId: 'cortacespedes-electricos'
        },
        {
          id: 'cutting-width',
          name: 'Ancho de corte',
          type: 'range',
          options: { min: 30, max: 46 },
          categoryId: 'cortacespedes-electricos'
        },
        {
          id: 'grass-collection',
          name: 'Recogida de césped',
          type: 'single',
          options: ['con bolsa', 'sin bolsa', 'mulching'],
          categoryId: 'cortacespedes-electricos'
        },
        {
          id: 'self-propelled',
          name: 'Autopropulsado',
          type: 'single',
          options: ['sí', 'no'],
          categoryId: 'cortacespedes-electricos'
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
          options: { min: 1, max: 20 },
          categoryId: 'pulverizadores'
        },
        {
          id: 'pressure-type',
          name: 'Tipo de presión',
          type: 'single',
          options: ['manual', 'eléctrico'],
          categoryId: 'pulverizadores'
        },
        {
          id: 'spray-type',
          name: 'Tipo de pulverización',
          type: 'single',
          options: ['chorro', 'niebla', 'abanico'],
          categoryId: 'pulverizadores'
        },
        {
          id: 'shoulder-strap',
          name: 'Correa para hombro',
          type: 'single',
          options: ['sí', 'no'],
          categoryId: 'pulverizadores'
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
          options: { min: 1, max: 10 },
          categoryId: 'motocultores'
        },
        {
          id: 'working-width',
          name: 'Ancho de trabajo',
          type: 'range',
          options: { min: 30, max: 100 },
          categoryId: 'motocultores'
        },
        {
          id: 'fuel-type',
          name: 'Tipo de combustible',
          type: 'single',
          options: ['gasolina', 'diésel', 'eléctrico'],
          categoryId: 'motocultores'
        },
        {
          id: 'reversible',
          name: 'Reversible',
          type: 'single',
          options: ['sí', 'no'],
          categoryId: 'motocultores'
        }
      ]
    },
    {
      id: 'sembradoras',
      name: 'Sembradoras',
      description: 'Herramientas para sembrar semillas de forma precisa',
      specifications: [
        {
          id: 'seed-type',
          name: 'Tipo de semilla',
          type: 'single',
          options: ['pequeñas', 'medianas', 'grandes'],
          categoryId: 'sembradoras'
        },
        {
          id: 'row-spacing',
          name: 'Separación entre líneas',
          type: 'range',
          options: { min: 10, max: 50 },
          categoryId: 'sembradoras'
        },
        {
          id: 'depth-control',
          name: 'Control de profundidad',
          type: 'single',
          options: ['sí', 'no'],
          categoryId: 'sembradoras'
        },
        {
          id: 'hopper-capacity',
          name: 'Capacidad del depósito',
          type: 'range',
          options: { min: 1, max: 10 },
          categoryId: 'sembradoras'
        }
      ]
    }
  ],

  specifications: [
    {
      id: 'power-type',
      name: 'Tipo de alimentación',
      type: 'single',
      options: ['eléctrico', 'batería'],
      categoryId: 'cortacespedes-electricos'
    },
    {
      id: 'cutting-width',
      name: 'Ancho de corte',
      type: 'range',
      options: { min: 30, max: 46 },
      categoryId: 'cortacespedes-electricos'
    },
    {
      id: 'grass-collection',
      name: 'Recogida de césped',
      type: 'single',
      options: ['con bolsa', 'sin bolsa', 'mulching'],
      categoryId: 'cortacespedes-electricos'
    },
    {
      id: 'self-propelled',
      name: 'Autopropulsado',
      type: 'single',
      options: ['sí', 'no'],
      categoryId: 'cortacespedes-electricos'
    },
    {
      id: 'capacity',
      name: 'Capacidad',
      type: 'range',
      options: { min: 1, max: 20 },
      categoryId: 'pulverizadores'
    },
    {
      id: 'pressure-type',
      name: 'Tipo de presión',
      type: 'single',
      options: ['manual', 'eléctrico'],
      categoryId: 'pulverizadores'
    },
    {
      id: 'spray-type',
      name: 'Tipo de pulverización',
      type: 'single',
      options: ['chorro', 'niebla', 'abanico'],
      categoryId: 'pulverizadores'
    },
    {
      id: 'shoulder-strap',
      name: 'Correa para hombro',
      type: 'single',
      options: ['sí', 'no'],
      categoryId: 'pulverizadores'
    },
    {
      id: 'power',
      name: 'Potencia',
      type: 'range',
      options: { min: 1, max: 10 },
      categoryId: 'motocultores'
    },
    {
      id: 'working-width',
      name: 'Ancho de trabajo',
      type: 'range',
      options: { min: 30, max: 100 },
      categoryId: 'motocultores'
    },
    {
      id: 'fuel-type',
      name: 'Tipo de combustible',
      type: 'single',
      options: ['gasolina', 'diésel', 'eléctrico'],
      categoryId: 'motocultores'
    },
    {
      id: 'reversible',
      name: 'Reversible',
      type: 'single',
      options: ['sí', 'no'],
      categoryId: 'motocultores'
    },
    {
      id: 'seed-type',
      name: 'Tipo de semilla',
      type: 'single',
      options: ['pequeñas', 'medianas', 'grandes'],
      categoryId: 'sembradoras'
    },
    {
      id: 'row-spacing',
      name: 'Separación entre líneas',
      type: 'range',
      options: { min: 10, max: 50 },
      categoryId: 'sembradoras'
    },
    {
      id: 'depth-control',
      name: 'Control de profundidad',
      type: 'single',
      options: ['sí', 'no'],
      categoryId: 'sembradoras'
    },
    {
      id: 'hopper-capacity',
      name: 'Capacidad del depósito',
      type: 'range',
      options: { min: 1, max: 10 },
      categoryId: 'sembradoras'
    }
  ],

  relationships: {
    taskSeasons: {
      'prepare-soil': ['spring', 'fall'],
      'plant-spring-vegetables': ['spring']
    },
    taskProducts: {
      'prepare-soil': ['motocultores', 'azadas', 'rastrillos'],
      'plant-spring-vegetables': ['semillas', 'palas', 'regaderas']
    },
    questionProducts: {
      'lawn-mower-200m2': ['cortacespedes-electricos'],
      'sprayer-pests': ['pulverizadores']
    },
    categorySpecifications: {
      'cortacespedes-electricos': ['power-type', 'cutting-width', 'grass-collection', 'self-propelled'],
      'pulverizadores': ['capacity', 'pressure-type', 'spray-type', 'shoulder-strap'],
      'motocultores': ['power', 'working-width', 'fuel-type', 'reversible'],
      'sembradoras': ['seed-type', 'row-spacing', 'depth-control', 'hopper-capacity']
    }
  }
} 