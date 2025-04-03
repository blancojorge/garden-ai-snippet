import fs from 'fs'
import path from 'path'

interface BauhausProduct {
  id: string
  name: string
  description: string
  category: {
    id: string
    name: string
    parent?: {
      id: string
      name: string
    }
  }
  specifications: Record<string, string>
  price: number
  stock: number
  images: string[]
}

interface BauhausCatalog {
  products: BauhausProduct[]
  categories: {
    id: string
    name: string
    parentId?: string
    level: number
  }[]
}

interface CategoryStats {
  id: string
  name: string
  level: number
  productCount: number
  avgSpecCount: number
  uniqueSpecs: Set<string>
  children: CategoryStats[]
}

function analyzeCategory(
  categoryId: string,
  catalog: BauhausCatalog,
  level: number = 0
): CategoryStats {
  const products = catalog.products.filter(p => p.category.id === categoryId)
  const category = catalog.categories.find(c => c.id === categoryId)!
  const children = catalog.categories
    .filter(c => c.parentId === categoryId)
    .map(c => analyzeCategory(c.id, catalog, level + 1))

  const specs = new Set<string>()
  let totalSpecCount = 0

  products.forEach(product => {
    totalSpecCount += Object.keys(product.specifications).length
    Object.keys(product.specifications).forEach(spec => specs.add(spec))
  })

  return {
    id: categoryId,
    name: category.name,
    level,
    productCount: products.length,
    avgSpecCount: products.length > 0 ? totalSpecCount / products.length : 0,
    uniqueSpecs: specs,
    children
  }
}

function printCategoryStats(stats: CategoryStats, indent: string = ''): void {
  console.log(
    `${indent}${stats.name} (${stats.id}):`,
    `${stats.productCount} products,`,
    `${stats.avgSpecCount.toFixed(1)} avg specs,`,
    `${stats.uniqueSpecs.size} unique specs`
  )

  if (stats.children.length > 0) {
    console.log(`${indent}  Subcategories:`)
    stats.children.forEach(child => printCategoryStats(child, indent + '  '))
  }
}

function findOptimalCategories(
  stats: CategoryStats,
  minProducts: number = 10,
  maxLevel: number = 3
): string[] {
  const optimalCategories: string[] = []

  // If this category has enough products and is not too deep, use it
  if (stats.productCount >= minProducts && stats.level <= maxLevel) {
    optimalCategories.push(stats.id)
  } else if (stats.children.length > 0) {
    // Otherwise, check its children
    stats.children.forEach(child => {
      optimalCategories.push(...findOptimalCategories(child, minProducts, maxLevel))
    })
  }

  return optimalCategories
}

async function main() {
  try {
    console.log('Analyzing catalog structure...')

    // Read the catalog file
    const catalogPath = path.join(__dirname, '../data/Bauhaus.catalog_maquinaria.json')
    const catalogData: BauhausCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'))

    // Find root categories (those without parents)
    const rootCategories = catalogData.categories.filter(c => !c.parentId)

    // Analyze each root category
    const categoryStats = rootCategories.map(category =>
      analyzeCategory(category.id, catalogData)
    )

    // Print analysis
    console.log('\nCategory Analysis:')
    categoryStats.forEach(stats => printCategoryStats(stats))

    // Find optimal categories
    const optimalCategories = categoryStats.flatMap(stats =>
      findOptimalCategories(stats)
    )

    console.log('\nOptimal Categories for Vector Search:')
    optimalCategories.forEach(categoryId => {
      const category = catalogData.categories.find(c => c.id === categoryId)!
      const products = catalogData.products.filter(p => p.category.id === categoryId)
      console.log(
        `${category.name} (${categoryId}):`,
        `${products.length} products`
      )
    })

    // Save optimal categories to a file
    const optimalPath = path.join(__dirname, '../data/optimal-categories.json')
    const optimalData = optimalCategories.map(categoryId => {
      const category = catalogData.categories.find(c => c.id === categoryId)!
      const products = catalogData.products.filter(p => p.category.id === categoryId)
      return {
        id: categoryId,
        name: category.name,
        productCount: products.length,
        level: category.level
      }
    })

    fs.writeFileSync(optimalPath, JSON.stringify(optimalData, null, 2))
    console.log('\nOptimal categories saved to:', optimalPath)
  } catch (error) {
    console.error('Error during catalog analysis:', error)
    process.exit(1)
  }
}

main() 