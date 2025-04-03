import * as fs from 'fs'
import * as path from 'path'

interface CatalogItem {
  datalayer: {
    product: {
      item: Array<{
        subCategory1: string
        subCategory2: string
        subCategory3: string
        subCategory4: string
        subCategory5: string
        subCategory6: string
      }>
    }
  }
}

function getUniqueCategories(catalog: CatalogItem[]): string[] {
  const categories = new Set<string>()
  
  catalog.forEach(item => {
    if (item.datalayer?.product?.item?.[0]) {
      const subCategories = item.datalayer.product.item[0]
      if (subCategories.subCategory3 !== 'n/a') categories.add(subCategories.subCategory3)
      if (subCategories.subCategory4 !== 'n/a') categories.add(subCategories.subCategory4)
      if (subCategories.subCategory5 !== 'n/a') categories.add(subCategories.subCategory5)
      if (subCategories.subCategory6 !== 'n/a') categories.add(subCategories.subCategory6)
    }
  })
  
  return Array.from(categories).sort()
}

try {
  const catalogPath = path.resolve(process.cwd(), 'Bauhaus.catalog_maquinaria.json')
  const catalog: CatalogItem[] = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'))
  
  const uniqueCategories = getUniqueCategories(catalog)
  console.log('Unique categories in the catalog:')
  uniqueCategories.forEach((category, index) => {
    console.log(`${index + 1}. ${category}`)
  })
} catch (error) {
  console.error('Error processing catalog:', error)
} 