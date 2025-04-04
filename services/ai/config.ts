export const AI_CONFIG = {
  provider: 'together',
  // model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  //model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  //model: 'meta-llama/Meta-Llama-3-8B-Instruct-Lite',
  model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  baseURL: 'https://api.together.xyz/v1',
  temperature: 0.7,
  maxTokens: 3000, // Aumentado para evitar truncamiento
  minDelayMs: 1000, // 1 seconds between requests
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
  }
} as const

export const SYSTEM_PROMPT = `Eres un experto en maquinaria de huerto y jardín de Bauhaus.`
