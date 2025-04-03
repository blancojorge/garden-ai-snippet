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
  
  // Normalize the search category
  const normalizedCategory = category.toLowerCase().trim()
  
  const products = (catalog as CatalogItem[]).filter(item => {
    const itemCategories = item.datalayer.product.item[0]
    console.log('\nChecking item:', {
      name: item.schema.name,
      categories: {
        subCategory1: itemCategories.subCategory1,
        subCategory2: itemCategories.subCategory2,
        subCategory3: itemCategories.subCategory3,
        subCategory4: itemCategories.subCategory4,
        subCategory5: itemCategories.subCategory5,
        subCategory6: itemCategories.subCategory6
      }
    })
    
    // Create an array of all category levels
    const allCategories = [
      itemCategories.subCategory1,
      itemCategories.subCategory2,
      itemCategories.subCategory3,
      itemCategories.subCategory4,
      itemCategories.subCategory5,
      itemCategories.subCategory6
    ].filter(Boolean) // Remove undefined/null values
    
    // Check if any category level contains the search term
    const matches = allCategories.some(cat => 
      cat.toLowerCase().includes(normalizedCategory) ||
      normalizedCategory.includes(cat.toLowerCase())
    )
    
    console.log(`Matches category "${category}"? ${matches}`)
    return matches
  }).map(item => {
    console.log('\nMapping product:', {
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
      image: item.schema.image,
      url: item.schema.url,
      category: item.datalayer.product.item[0].subCategory2 || item.datalayer.product.item[0].subCategory1 || '',
      brand: item.schema.brand.name
    }
  })
  
  console.log(`Found ${products.length} products for category "${category}"`)
  if (products.length > 0) {
    console.log('Sample product:', JSON.stringify(products[0], null, 2))
  }
  
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