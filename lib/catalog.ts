import catalog from '../Bauhaus.catalog_maquinaria.json'

interface CatalogProduct {
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
    }
    variants: {
      primaryAttribute: string
      primaryValue: string
      secondaryAttribute: string
      secondaryValue: string
    }
  }
  schema: {
    name: string
    image: string
    description: string
    url: string
    sku: string
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

// Type assertion to ensure the catalog matches our interface
const typedCatalog = catalog as CatalogProduct[]

export function getProductsByCategory(category: string): CatalogProduct[] {
  return typedCatalog.filter(product => 
    product.datalayer.product.item.some(item => 
      item.subCategory1 === category || 
      item.subCategory2 === category || 
      item.subCategory3 === category
    )
  )
}

export function getProductById(sku: string): CatalogProduct | undefined {
  return typedCatalog.find(product => product.schema.sku === sku)
}

export function searchProducts(query: string): CatalogProduct[] {
  const searchTerms = query.toLowerCase().split(' ')
  return typedCatalog.filter(product => 
    searchTerms.some(term => 
      product.schema.name.toLowerCase().includes(term) ||
      product.schema.description.toLowerCase().includes(term) ||
      product.datalayer.product.item.some(item => 
        item.subCategory1.toLowerCase().includes(term) ||
        item.subCategory2.toLowerCase().includes(term) ||
        item.subCategory3.toLowerCase().includes(term)
      )
    )
  )
} 