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
    }
  }
  schema: {
    name: string
    description: string
  }
}

function getUniqueCategories(): string[] {
  const categories = new Set<string>()
  
  // Ensure catalog is an array
  const catalogArray = Array.isArray(catalog) ? catalog : [catalog]
  
  catalogArray.forEach(item => {
    if (!item?.datalayer?.product?.item?.[0]) return
    
    const itemCategories = item.datalayer.product.item[0]
    
    // Add all non-empty categories
    if (itemCategories.subCategory1 && itemCategories.subCategory1 !== 'n/a') {
      categories.add(itemCategories.subCategory1)
    }
    if (itemCategories.subCategory2 && itemCategories.subCategory2 !== 'n/a') {
      categories.add(itemCategories.subCategory2)
    }
    if (itemCategories.subCategory3 && itemCategories.subCategory3 !== 'n/a') {
      categories.add(itemCategories.subCategory3)
    }
    if (itemCategories.subCategory4 && itemCategories.subCategory4 !== 'n/a') {
      categories.add(itemCategories.subCategory4)
    }
    if (itemCategories.subCategory5 && itemCategories.subCategory5 !== 'n/a') {
      categories.add(itemCategories.subCategory5)
    }
    if (itemCategories.subCategory6 && itemCategories.subCategory6 !== 'n/a') {
      categories.add(itemCategories.subCategory6)
    }
  })
  
  return Array.from(categories).sort()
}

// Get and display all unique categories
const uniqueCategories = getUniqueCategories()
console.log('\nAll unique categories in the catalog:')
console.log('----------------------------------------')
uniqueCategories.forEach((category, index) => {
  console.log(`${index + 1}. ${category}`)
})
console.log(`\nTotal categories: ${uniqueCategories.length}`) 