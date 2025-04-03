export interface SeasonalInfo {
  season: string
  tasks: string[]
  recommendedProducts: string[]
  suggestedQuestions: {
    productQuestions: string[]
    openQuestion: string
  }
}

export interface RegionSeasonalInfo {
  [season: string]: SeasonalInfo
}

export interface SeasonalData {
  [region: string]: RegionSeasonalInfo
}

export const SEASONAL_DATA: SeasonalData = {
  'Andalucía': {
    'spring': {
      season: 'primavera',
      tasks: [
        'Preparar el suelo para la siembra',
        'Podar árboles y arbustos',
        'Controlar las malas hierbas',
        'Iniciar el riego regular',
        'Plantar especies de temporada'
      ],
      recommendedProducts: [
        'Cortacésped básico',
        'Desbrozadora eléctrica',
        'Kit de herramientas de poda',
        'Sistema de riego por goteo'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué cortacésped me recomiendas para mi jardín?',
          '¿Qué desbrozadora es mejor para mi terreno?'
        ],
        openQuestion: '¿Qué tareas de jardinería debo realizar esta primavera?'
      }
    },
    'summer': {
      season: 'verano',
      tasks: [
        'Mantener el riego adecuado',
        'Cortar el césped regularmente',
        'Controlar plagas y enfermedades',
        'Proteger plantas del calor extremo',
        'Recoger frutas y verduras'
      ],
      recommendedProducts: [
        'Sistema de riego automático',
        'Cortacésped profesional',
        'Pulverizador de presión',
        'Manguera extensible'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué sistema de riego necesito para el verano?',
          '¿Cómo puedo proteger mis plantas del calor?'
        ],
        openQuestion: '¿Cómo mantener mi jardín en verano?'
      }
    },
    'autumn': {
      season: 'otoño',
      tasks: [
        'Limpiar hojas caídas',
        'Preparar el suelo para el invierno',
        'Plantar bulbos de primavera',
        'Proteger plantas sensibles',
        'Realizar la última poda'
      ],
      recommendedProducts: [
        'Soplador de hojas',
        'Kit de herramientas de jardín',
        'Cubiertas para plantas',
        'Fertilizante de otoño'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué soplador me recomiendas para las hojas?',
          '¿Cómo proteger mis plantas del frío?'
        ],
        openQuestion: '¿Qué preparativos necesito para el invierno?'
      }
    },
    'winter': {
      season: 'invierno',
      tasks: [
        'Proteger plantas del frío',
        'Mantener herramientas',
        'Planificar la próxima temporada',
        'Realizar podas de mantenimiento',
        'Controlar el riego'
      ],
      recommendedProducts: [
        'Cubiertas para plantas',
        'Kit de mantenimiento de herramientas',
        'Invernadero portátil',
        'Guantes de jardinería'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué protección necesito para mis plantas?',
          '¿Cómo mantener mis herramientas en invierno?'
        ],
        openQuestion: '¿Qué cuidados necesita mi jardín en invierno?'
      }
    }
  },
  'Madrid': {
    'spring': {
      season: 'primavera',
      tasks: [
        'Preparar el jardín para la nueva temporada',
        'Realizar la primera siega del césped',
        'Plantar especies resistentes',
        'Iniciar el programa de riego',
        'Controlar plagas emergentes'
      ],
      recommendedProducts: [
        'Cortacésped profesional',
        'Desbrozadora profesional',
        'Kit de herramientas básicas',
        'Sistema de riego programable'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué cortacésped profesional me recomiendas?',
          '¿Qué desbrozadora es mejor para un jardín grande?'
        ],
        openQuestion: '¿Qué tareas de jardinería debo realizar esta primavera?'
      }
    },
    'summer': {
      season: 'verano',
      tasks: [
        'Mantener el riego eficiente',
        'Proteger plantas del calor',
        'Controlar el crecimiento del césped',
        'Vigilar plagas estivales',
        'Recoger frutos de temporada'
      ],
      recommendedProducts: [
        'Sistema de riego por aspersión',
        'Cortacésped de alto rendimiento',
        'Pulverizador de presión',
        'Kit de protección solar'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué sistema de riego es más eficiente?',
          '¿Cómo proteger mi jardín del calor extremo?'
        ],
        openQuestion: '¿Cómo mantener mi jardín en verano?'
      }
    },
    'autumn': {
      season: 'otoño',
      tasks: [
        'Preparar el jardín para el invierno',
        'Limpiar hojas y restos vegetales',
        'Plantar especies de otoño',
        'Realizar podas de formación',
        'Aplicar abono orgánico'
      ],
      recommendedProducts: [
        'Soplador profesional',
        'Kit de herramientas de poda',
        'Fertilizante de otoño',
        'Cubiertas para plantas'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué soplador profesional me recomiendas?',
          '¿Cómo preparar mis plantas para el invierno?'
        ],
        openQuestion: '¿Qué preparativos necesito para el invierno?'
      }
    },
    'winter': {
      season: 'invierno',
      tasks: [
        'Proteger plantas sensibles',
        'Mantener herramientas en buen estado',
        'Planificar la próxima temporada',
        'Realizar podas de mantenimiento',
        'Controlar el riego según necesidades'
      ],
      recommendedProducts: [
        'Invernadero portátil',
        'Kit de mantenimiento de herramientas',
        'Cubiertas térmicas',
        'Guantes de invierno'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué protección necesito para el invierno?',
          '¿Cómo mantener mis herramientas?'
        ],
        openQuestion: '¿Qué cuidados necesita mi jardín en invierno?'
      }
    }
  }
}

export function getSeasonalInfo(region: string, month: number): SeasonalInfo {
  const regionInfo = SEASONAL_DATA[region] || SEASONAL_DATA['Madrid']
  
  let season: string
  if (month >= 3 && month <= 5) season = 'spring'
  else if (month >= 6 && month <= 8) season = 'summer'
  else if (month >= 9 && month <= 11) season = 'autumn'
  else season = 'winter'
  
  return regionInfo[season]
} 