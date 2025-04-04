import catalog from '../Bauhaus.catalog_maquinaria.json'

interface CatalogItem {
  datalayer: {
    product: {
      item: Array<{
        subCategory1: string
        subCategory1ID: string
        subCategory2: string
        subCategory2ID: string
        subCategory3: string
        subCategory3ID: string
        subCategory4: string
        subCategory4ID: string
        subCategory5: string
        subCategory5ID: string
        subCategory6: string
        subCategory6ID: string
      }>
      variants?: {
        primaryAttribute: string
        primaryValue: string
        secondaryAttribute: string
        secondaryValue: string
      }
    }
  }
  schema: {
    sku: string
    name: string
    description: string
    image: string
    url: string
    brand: {
      '@type': string
      name: string
    }
    offers: {
      priceCurrency: string
      price: string
    }
  }
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  url: string
  category: string
  brand: string
}

export function getProductsByCategory(category: string): Product[] {
  console.log('\n=== getProductsByCategory ===')
  console.log('Searching for category:', category)
  
  // Normalize the search category - remove accents and convert to lowercase
  const normalizedCategory = category.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
  
  const products = (catalog as CatalogItem[]).filter(item => {
    // Safely access the item categories
    const itemCategories = item.datalayer?.product?.item?.[0]
    if (!itemCategories) {
      return false
    }
    
    // Create an array of all category levels and normalize them
    const allCategories = [
      itemCategories.subCategory1,
      itemCategories.subCategory2,
      itemCategories.subCategory3,
      itemCategories.subCategory4,
      itemCategories.subCategory5,
      itemCategories.subCategory6
    ]
      .filter(cat => cat && cat !== 'n/a') // Remove undefined/null/n/a values
      .map(cat => cat.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')) // Remove accents
    
    // Check if any category level contains the search term
    return allCategories.some(cat => 
      cat.includes(normalizedCategory) ||
      normalizedCategory.includes(cat)
    )
  }).map(item => {
    // Skip items with missing required data
    if (!item.schema || !item.datalayer?.product?.item?.[0]) {
      return null
    }

    return {
      id: item.schema.sku || '',
      name: item.schema.name || 'Unknown',
      description: item.schema.description || '',
      price: parseFloat(item.schema.offers?.price || '0'),
      image: item.schema.image || '',
      url: item.schema.url || '',
      category: item.datalayer.product.item[0].subCategory3 || 'Uncategorized',
      brand: item.schema.brand?.name || 'Unknown'
    }
  }).filter(Boolean) as Product[] // Remove null items

  console.log(`Found ${products.length} products in category "${category}"`)
  return products
}

export function getProductById(id: string): Product | undefined {
  console.log('\n=== getProductById ===')
  console.log('Searching for product ID:', id)
  
  const item = (catalog as CatalogItem[]).find((item) => item.schema.sku === id)
  if (!item) {
    console.log('Product not found')
    return undefined
  }

  console.log('Found product:', {
    name: item.schema.name,
    description: item.schema.description,
    price: item.schema.offers.price,
    image: item.schema.image,
    url: item.schema.url,
    categories: item.datalayer.product.item[0]
  })

  return {
    id: item.schema.sku,
    name: item.schema.name,
    description: item.schema.description || '',
    price: parseFloat(item.schema.offers.price),
    image: item.schema.image || '',
    url: item.schema.url || '',
    category: item.datalayer.product.item[0].subCategory3 || '',
    brand: item.schema.brand.name || ''
  }
}

export function getAllCategories(): string[] {
  console.log('=== getAllCategories ===')
  console.log('Catalog type:', typeof catalog)
  console.log('Is catalog array:', Array.isArray(catalog))
  console.log('Catalog length:', (catalog as any[]).length)
  
  const categories = new Set<string>()
  ;(catalog as CatalogItem[]).forEach((item, index) => {
    if (index < 5) { // Log first 5 items for debugging
      console.log(`Item ${index}:`, {
        name: item.schema.name,
        categories: item.datalayer.product.item[0]
      })
    }
    
    if (item.datalayer?.product?.item?.[0]?.subCategory3) {
      const category = item.datalayer.product.item[0].subCategory3
      if (category !== 'n/a') {
        categories.add(category)
      }
    }
  })
  
  const categoryArray = Array.from(categories)
  console.log('Found categories:', categoryArray)
  console.log('Total categories:', categoryArray.length)
  
  return categoryArray
} 