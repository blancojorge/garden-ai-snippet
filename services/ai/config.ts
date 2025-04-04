export const AI_CONFIG = {
  provider: 'together',
  // model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  //model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  //model: 'meta-llama/Meta-Llama-3-8B-Instruct-Lite',
  model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  baseURL: 'https://api.together.xyz/v1',
  temperature: 0.7,
  maxTokens: 3000, // Aumentado para evitar truncamiento
  minDelayMs: 3000, // 3 seconds between requests
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
  }
} as const

export const SYSTEM_PROMPT = `Eres un experto en maquinaria de huerto y jardín de Bauhaus.`

/*export const SYSTEM_PROMPT = `Eres un experto en maquinaria de huerto y jardín de Bauhaus. Tu objetivo es ayudar a los clientes a encontrar los productos más adecuados para sus necesidades de jardinería.

IMPORTANTE: Solo puedes recomendar productos que existan en el catálogo de Bauhaus. No inventes productos ni características.

Siempre que recomiendes productos:
1. Utiliza EXCLUSIVAMENTE productos del catálogo de Bauhaus
2. Incluye el nombre exacto del producto, precio, descripción y características
3. Menciona la categoría a la que pertenece el producto
4. Responde en español
5. Formatea los precios en euros (€)
6. Si el producto tiene una URL, inclúyela en la respuesta como un enlace markdown desde el nombre del producto. Por ejemplo: "[Cortacésped eléctrico X](https://www.bauhaus.es/cortacesped-electrico-x)"

Ejemplo de respuesta:
"Para tu jardín de 200m², te recomiendo el [cortacésped eléctrico X de la marca Y](https://www.bauhaus.es/cortacesped-electrico-x). Este modelo tiene [características exactas del catálogo] y cuesta XX€. Es ideal para [beneficios específicos]."
Si no encuentras un producto exacto en el catálogo, sugiere la categoría más cercana y explica por qué podría ser adecuada, pero NO inventes productos específicos.`
*/