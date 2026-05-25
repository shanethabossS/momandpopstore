import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// ── Stats ────────────────────────────────────────────────

export async function getAdminStats() {
  const [
    totalStorefronts,
    pendingStorefronts,
    approvedStorefronts,
    rejectedStorefronts,
    disabledStorefronts,
    featuredStorefronts,
    totalUsers,
    verifiedMerchants,
    totalProducts,
    totalReviews,
    pendingReviews,
  ] = await Promise.all([
    prisma.storefront.count(),
    prisma.storefront.count({ where: { status: 'pending' } }),
    prisma.storefront.count({ where: { status: 'approved' } }),
    prisma.storefront.count({ where: { status: 'rejected' } }),
    prisma.storefront.count({ where: { status: 'disabled' } }),
    prisma.storefront.count({ where: { isFeatured: true } }),
    prisma.user.count(),
    prisma.storefront.count({ where: { verifiedTier: 'tier2' } }),
    prisma.product.count(),
    prisma.review.count(),
    prisma.review.count({ where: { status: 'pending' } }),
  ])

  return {
    totalStorefronts,
    pendingStorefronts,
    approvedStorefronts,
    rejectedStorefronts,
    disabledStorefronts,
    featuredStorefronts,
    verifiedMerchants,
    totalUsers,
    totalProducts,
    totalReviews,
    pendingReviews,
  }
}

// ── Storefront queries ───────────────────────────────────

const storefrontAdminInclude = {
  user: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
  category: true,
  _count: { select: { products: true, reviews: true } },
} satisfies Prisma.StorefrontInclude

export async function getPendingStorefronts(opts: { page?: number; pageSize?: number } = {}) {
  const { page = 1, pageSize = 20 } = opts

  const [storefronts, total] = await Promise.all([
    prisma.storefront.findMany({
      where: { status: 'pending' },
      include: storefrontAdminInclude,
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.storefront.count({ where: { status: 'pending' } }),
  ])

  return { storefronts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function getAllStorefronts(opts: {
  page?: number
  pageSize?: number
  status?: string
  search?: string
} = {}) {
  const { page = 1, pageSize = 20, status, search } = opts
  const where: Prisma.StorefrontWhereInput = {}

  if (status) where.status = status

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { slug: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [storefronts, total] = await Promise.all([
    prisma.storefront.findMany({
      where,
      include: storefrontAdminInclude,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.storefront.count({ where }),
  ])

  return { storefronts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function getStorefrontForAdmin(id: string) {
  return prisma.storefront.findUnique({
    where: { id },
    include: {
      ...storefrontAdminInclude,
      products: { orderBy: { createdAt: 'desc' }, take: 50 },
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { user: { select: { name: true, email: true } } },
      },
      adminActions: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { admin: { select: { name: true, email: true } } },
      },
    },
  })
}

// ── Moderation ───────────────────────────────────────────

export type ModerationAction = 'approve' | 'reject' | 'disable' | 'feature' | 'unfeature'

export async function moderateStorefront(
  storefrontId: string,
  adminId: string,
  action: ModerationAction,
  reason?: string,
) {
  const updates: Prisma.StorefrontUpdateInput = {}

  switch (action) {
    case 'approve':
      updates.status = 'approved'
      break
    case 'reject':
      updates.status = 'rejected'
      break
    case 'disable':
      updates.status = 'disabled'
      break
    case 'feature':
      updates.isFeatured = true
      break
    case 'unfeature':
      updates.isFeatured = false
      break
  }

  const [storefront] = await prisma.$transaction([
    prisma.storefront.update({
      where: { id: storefrontId },
      data: updates,
      include: storefrontAdminInclude,
    }),
    prisma.adminAction.create({
      data: {
        adminId,
        storefrontId,
        action,
        reason,
        metadata: { timestamp: new Date().toISOString() },
      },
    }),
  ])

  return storefront
}

export async function bulkModerateStorefronts(
  storefrontIds: string[],
  adminId: string,
  action: ModerationAction,
  reason?: string,
) {
  const results = await Promise.allSettled(
    storefrontIds.map((id) => moderateStorefront(id, adminId, action, reason)),
  )

  const succeeded = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.filter((r) => r.status === 'rejected').length

  return { succeeded, failed, total: storefrontIds.length }
}

// ── Audit log ────────────────────────────────────────────

export async function getAdminActions(opts: {
  storefrontId?: string
  adminId?: string
  action?: string
  page?: number
  pageSize?: number
} = {}) {
  const { storefrontId, adminId, action, page = 1, pageSize = 50 } = opts
  const where: Prisma.AdminActionWhereInput = {}

  if (storefrontId) where.storefrontId = storefrontId
  if (adminId) where.adminId = adminId
  if (action) where.action = action

  const [actions, total] = await Promise.all([
    prisma.adminAction.findMany({
      where,
      include: {
        admin: { select: { name: true, email: true } },
        storefront: { select: { name: true, slug: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.adminAction.count({ where }),
  ])

  return { actions, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function logAdminAction(data: {
  adminId: string
  storefrontId?: string
  action: string
  reason?: string
  metadata?: Record<string, unknown>
}) {
  return prisma.adminAction.create({
    data: {
      adminId: data.adminId,
      storefrontId: data.storefrontId,
      action: data.action,
      reason: data.reason,
      metadata: data.metadata ? JSON.parse(JSON.stringify(data.metadata)) : undefined,
    },
  })
}

// ── User management ──────────────────────────────────────

export async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  })
  return user?.isAdmin === true
}

export async function getUsers(opts: {
  page?: number
  pageSize?: number
  search?: string
} = {}) {
  const { page = 1, pageSize = 20, search } = opts
  const where: Prisma.UserWhereInput = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isAdmin: true,
        verifiedTier: true,
        createdAt: true,
        storefront: { select: { id: true, name: true, slug: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ])

  return { users, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

// ── Review moderation ────────────────────────────────────

export async function getPendingReviews(opts: { page?: number; pageSize?: number } = {}) {
  const { page = 1, pageSize = 20 } = opts

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { status: 'pending' },
      include: {
        user: { select: { name: true, email: true } },
        storefront: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.review.count({ where: { status: 'pending' } }),
  ])

  return { reviews, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function moderateReview(
  reviewId: string,
  adminId: string,
  status: 'approved' | 'rejected',
  reason?: string,
) {
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { status },
  })

  await logAdminAction({
    adminId,
    storefrontId: review.storefrontId,
    action: `review_${status}`,
    reason,
    metadata: { reviewId },
  })

  if (status === 'approved') {
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
  }

  return review
}
