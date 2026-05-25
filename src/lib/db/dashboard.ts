import { prisma } from '@/lib/prisma'

export async function getDashboardStats(userId: string) {
  const storefront = await prisma.storefront.findUnique({
    where: { userId },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      isFeatured: true,
      verifiedTier: true,
      whatsappNumber: true,
      _count: { select: { products: true, reviews: true } },
    },
  })

  if (!storefront) return null

  const activeProducts = await prisma.product.count({
    where: { storefrontId: storefront.id, isActive: true },
  })

  return {
    storefront,
    activeProducts,
    totalProducts: storefront._count.products,
    totalReviews: storefront._count.reviews,
  }
}

export async function getDashboardProducts(
  userId: string,
  opts: { page?: number; pageSize?: number } = {},
) {
  const { page = 1, pageSize = 20 } = opts

  const storefront = await prisma.storefront.findUnique({
    where: { userId },
    select: { id: true },
  })

  if (!storefront) return { products: [], total: 0, page, pageSize }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { storefrontId: storefront.id },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where: { storefrontId: storefront.id } }),
  ])

  return { products, total, page, pageSize }
}
