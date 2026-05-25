import { NextRequest, NextResponse } from 'next/server'
import { searchStorefronts, getCategories } from '@/lib/db/storefronts'
import { searchProducts } from '@/lib/db/products'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const limit = Math.min(parseInt(searchParams.get('limit') || '8'), 20)

  const [storefronts, products, categories] = await Promise.all([
    searchStorefronts(query, limit),
    searchProducts(query, 5),
    getCategories(),
  ])

  const filteredStorefronts = category
    ? storefronts.filter((s) => s.category?.slug === category)
    : storefronts

  return NextResponse.json({
    storefronts: filteredStorefronts,
    products,
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: c._count.storefronts,
    })),
  })
}
