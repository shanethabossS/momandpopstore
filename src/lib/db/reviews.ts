import { prisma } from '@/lib/prisma'

export async function getReviewsByStorefront(
  storefrontId: string,
  opts: { page?: number; pageSize?: number; status?: string } = {},
) {
  const { page = 1, pageSize = 20, status = 'approved' } = opts

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { storefrontId, status },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.review.count({ where: { storefrontId, status } }),
  ])

  return { reviews, total, page, pageSize }
}

export async function createReview(data: {
  storefrontId: string
  userId: string
  rating: number
  comment?: string
}) {
  const review = await prisma.review.create({ data })

  const agg = await prisma.review.aggregate({
    where: { storefrontId: data.storefrontId, status: 'approved' },
    _avg: { rating: true },
    _count: true,
  })

  await prisma.storefront.update({
    where: { id: data.storefrontId },
    data: {
      rating: agg._avg.rating ?? 0,
      reviewsCount: agg._count,
    },
  })

  return review
}

export async function updateReviewStatus(id: string, status: string) {
  const review = await prisma.review.update({ where: { id }, data: { status } })

  const agg = await prisma.review.aggregate({
    where: { storefrontId: review.storefrontId, status: 'approved' },
    _avg: { rating: true },
    _count: true,
  })

  await prisma.storefront.update({
    where: { id: review.storefrontId },
    data: {
      rating: agg._avg.rating ?? 0,
      reviewsCount: agg._count,
    },
  })

  return review
}
