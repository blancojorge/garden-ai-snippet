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
    0: { // March
      season: 'Primavera',
      tasks: [
        'Preparar el suelo para la siembra',
        'Plantar hortalizas de primavera',
        'Podar árboles frutales',
        'Controlar plagas y enfermedades'
      ],
      recommendedProducts: [
        'Cortacésped eléctrico',
        'Motosierra de poda',
        'Pulverizador de mochila'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué cortacésped eléctrico me recomiendas para un jardín de 200m²?',
          '¿Qué motosierra es más adecuada para podar árboles frutales?',
          '¿Qué pulverizador necesito para tratar plagas en mi huerto?'
        ],
        openQuestion: '¿Qué otras tareas de jardinería debo realizar en primavera?'
      }
    },
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
        'Preparar el suelo para la siembra',
        'Plantar hortalizas de primavera',
        'Podar árboles frutales',
        'Primera siega del césped'
      ],
      recommendedProducts: [
        'Cortacésped',
        'Motoazada',
        'Tijeras de poda'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué cortacésped poco ruidoso me recomiendas?',
          '¿Qué necesito para dejar mi suelo en buen estado de fertilidad?',
          '¿Cuáles son las herramientas imprescindibles para mantener mis frutales en primavera?'
        ],
        openQuestion: '¿Qué tareas de jardinería debo realizar esta primavera en Galicia?'
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
  },
  'Galicia': {
    'spring': {
      season: 'primavera',
      tasks: [
        'Preparar el suelo para la siembra',
        'Plantar hortalizas de primavera',
        'Podar árboles frutales',
        'Primera siega del césped',
        'Proteger plantas de las lluvias'
      ],
      recommendedProducts: [
        'Cortacésped',
        'Motoazada',
        'Tijeras de poda'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué cortacésped me recomiendas para un jardín húmedo?',
          '¿Qué necesito para dejar mi suelo en buen estado de fertilidad?',
          '¿Cuáles son las herramientas imprescindibles para mantener mis frutales en primavera?'
        ],
        openQuestion: '¿Qué tareas de jardinería debo realizar esta primavera en Galicia?'
      }
    },
    'summer': {
      season: 'verano',
      tasks: [
        'Mantener el riego adecuado',
        'Controlar la humedad del suelo',
        'Proteger plantas de las lluvias intensas',
        'Cortar el césped regularmente',
        'Controlar plagas y enfermedades'
      ],
      recommendedProducts: [
        'Sistema de riego automático',
        'Cortacésped profesional',
        'Pulverizador de presión',
        'Kit de protección contra lluvia'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué sistema de riego es mejor para clima húmedo?',
          '¿Qué cortacésped profesional me recomiendas para césped húmedo?',
          '¿Qué protección necesito para las lluvias intensas?'
        ],
        openQuestion: '¿Cómo mantener mi jardín en verano en Galicia?'
      }
    },
    'autumn': {
      season: 'otoño',
      tasks: [
        'Limpiar hojas caídas',
        'Preparar el suelo para el invierno',
        'Plantar bulbos de primavera',
        'Proteger plantas sensibles',
        'Controlar la humedad del suelo'
      ],
      recommendedProducts: [
        'Soplador de hojas',
        'Kit de herramientas de jardín',
        'Cubiertas para plantas',
        'Sistema de drenaje'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué soplador me recomiendas para hojas húmedas?',
          '¿Qué sistema de drenaje necesito para el otoño?',
          '¿Cómo proteger mis plantas de la humedad excesiva?'
        ],
        openQuestion: '¿Qué preparativos necesito para el invierno en Galicia?'
      }
    },
    'winter': {
      season: 'invierno',
      tasks: [
        'Proteger plantas del frío y la humedad',
        'Mantener herramientas en buen estado',
        'Controlar el drenaje del suelo',
        'Realizar podas de mantenimiento',
        'Planificar la próxima temporada'
      ],
      recommendedProducts: [
        'Cubiertas para plantas',
        'Kit de mantenimiento de herramientas',
        'Invernadero portátil',
        'Sistema de drenaje'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué protección necesito para el clima gallego?',
          '¿Qué sistema de drenaje es mejor para invierno?',
          '¿Cómo mantener mis herramientas en clima húmedo?'
        ],
        openQuestion: '¿Qué cuidados necesita mi jardín en invierno en Galicia?'
      }
    }
  },
  'Asturias': {
    'spring': {
      season: 'primavera',
      tasks: [
        'Preparar el suelo para la siembra',
        'Plantar hortalizas de primavera',
        'Podar árboles frutales',
        'Primera siega del césped',
        'Proteger plantas de las lluvias'
      ],
      recommendedProducts: [
        'Cortacésped',
        'Motoazada',
        'Tijeras de poda'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué cortacésped me recomiendas para un jardín húmedo?',
          '¿Qué necesito para dejar mi suelo en buen estado de fertilidad?',
          '¿Cuáles son las herramientas imprescindibles para mantener mis frutales en primavera?'
        ],
        openQuestion: '¿Qué tareas de jardinería debo realizar esta primavera en Galicia?'
      }
    },
    'summer': {
      season: 'verano',
      tasks: [
        'Mantener el riego adecuado',
        'Controlar la humedad del suelo',
        'Proteger plantas de las lluvias intensas',
        'Cortar el césped regularmente',
        'Controlar plagas y enfermedades'
      ],
      recommendedProducts: [
        'Sistema de riego automático',
        'Cortacésped profesional',
        'Pulverizador de presión',
        'Kit de protección contra lluvia'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué sistema de riego es mejor para clima húmedo?',
          '¿Qué cortacésped profesional me recomiendas para césped húmedo?',
          '¿Qué protección necesito para las lluvias intensas?'
        ],
        openQuestion: '¿Cómo mantener mi jardín en verano en Galicia?'
      }
    },
    'autumn': {
      season: 'otoño',
      tasks: [
        'Limpiar hojas caídas',
        'Preparar el suelo para el invierno',
        'Plantar bulbos de primavera',
        'Proteger plantas sensibles',
        'Controlar la humedad del suelo'
      ],
      recommendedProducts: [
        'Soplador de hojas',
        'Kit de herramientas de jardín',
        'Cubiertas para plantas',
        'Sistema de drenaje'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué soplador me recomiendas para hojas húmedas?',
          '¿Qué sistema de drenaje necesito para el otoño?',
          '¿Cómo proteger mis plantas de la humedad excesiva?'
        ],
        openQuestion: '¿Qué preparativos necesito para el invierno en Galicia?'
      }
    },
    'winter': {
      season: 'invierno',
      tasks: [
        'Proteger plantas del frío y la humedad',
        'Mantener herramientas en buen estado',
        'Controlar el drenaje del suelo',
        'Realizar podas de mantenimiento',
        'Planificar la próxima temporada'
      ],
      recommendedProducts: [
        'Cubiertas para plantas',
        'Kit de mantenimiento de herramientas',
        'Invernadero portátil',
        'Sistema de drenaje'
      ],
      suggestedQuestions: {
        productQuestions: [
          '¿Qué protección necesito para el clima gallego?',
          '¿Qué sistema de drenaje es mejor para invierno?',
          '¿Cómo mantener mis herramientas en clima húmedo?'
        ],
        openQuestion: '¿Qué cuidados necesita mi jardín en invierno en Galicia?'
      }
    }
  }
}

export function getSeasonalInfo(region: string | null | undefined, month: number): SeasonalInfo {
  // Default seasonal info for unknown regions
  const defaultInfo: SeasonalInfo = {
    season: 'Desconocida',
    tasks: [
      'Mantener el jardín limpio y ordenado',
      'Regar según las necesidades de las plantas',
      'Controlar plagas y enfermedades',
      'Realizar podas de mantenimiento'
    ],
    recommendedProducts: [
      'Kit básico de herramientas de jardín',
      'Cortacésped eléctrico',
      'Pulverizador de mochila',
      'Sistema de riego básico'
    ],
    suggestedQuestions: {
      productQuestions: [
        '¿Qué herramientas básicas necesito para mi jardín?',
        '¿Qué cortacésped me recomiendas?',
        '¿Qué sistema de riego es más adecuado?'
      ],
      openQuestion: '¿En qué puedo ayudarte con tu jardín?'
    }
  }

  // Return default info if region is not provided
  if (!region) {
    console.warn('No region provided, using default seasonal info')
    return defaultInfo
  }

  const regionInfo = SEASONAL_DATA[region]
  if (!regionInfo) {
    console.warn(`No seasonal data found for region: ${region}, using default info`)
    return defaultInfo
  }
  
  let season: string
  if (month >= 3 && month <= 5) season = 'spring'
  else if (month >= 6 && month <= 8) season = 'summer'
  else if (month >= 9 && month <= 11) season = 'autumn'
  else season = 'winter'
  
  return regionInfo[season] || defaultInfo
} 