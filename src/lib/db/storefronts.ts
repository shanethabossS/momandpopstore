import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export type StorefrontWithRelations = Prisma.StorefrontGetPayload<{
  include: { category: true; products: true; _count: { select: { reviews: true } } }
}>

export type StorefrontListItem = Prisma.StorefrontGetPayload<{
  include: { category: true; _count: { select: { reviews: true; products: true } } }
}>

const listIncludes = {
  category: true,
  _count: { select: { reviews: true, products: true } },
} satisfies Prisma.StorefrontInclude

const detailIncludes = {
  category: true,
  products: { where: { isActive: true }, orderBy: { isFeatured: 'desc' as const } },
  _count: { select: { reviews: true } },
} satisfies Prisma.StorefrontInclude

export async function getStorefronts(opts: {
  page?: number
  pageSize?: number
  search?: string
  category?: string
  featured?: boolean
  status?: string
} = {}) {
  const { page = 1, pageSize = 12, search, category, featured, status = 'approved' } = opts
  const where: Prisma.StorefrontWhereInput = { status }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
      { tags: { hasSome: [search.toLowerCase()] } },
    ]
  }

  if (category) {
    where.category = { slug: category }
  }

  if (featured !== undefined) {
    where.isFeatured = featured
  }

  const [storefronts, total] = await Promise.all([
    prisma.storefront.findMany({
      where,
      include: listIncludes,
      orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.storefront.count({ where }),
  ])

  return { storefronts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function getStorefrontBySlug(slug: string) {
  return prisma.storefront.findUnique({
    where: { slug },
    include: detailIncludes,
  })
}

export async function getStorefrontById(id: string) {
  return prisma.storefront.findUnique({
    where: { id },
    include: detailIncludes,
  })
}

export async function getStorefrontByUserId(userId: string) {
  return prisma.storefront.findUnique({
    where: { userId },
    include: detailIncludes,
  })
}

export async function createStorefront(data: {
  userId: string
  name: string
  slug: string
  description?: string
  whatsappNumber?: string
  categoryId?: string
  address?: string
  location?: string
  hours?: string[]
  tags?: string[]
}) {
  return prisma.storefront.create({
    data: {
      userId: data.userId,
      name: data.name,
      slug: data.slug,
      description: data.description,
      whatsappNumber: data.whatsappNumber,
      categoryId: data.categoryId,
      address: data.address,
      location: data.location,
      hours: data.hours ?? [],
      tags: data.tags ?? [],
    },
    include: detailIncludes,
  })
}

export async function updateStorefront(
  id: string,
  data: Prisma.StorefrontUpdateInput,
) {
  return prisma.storefront.update({
    where: { id },
    data,
    include: detailIncludes,
  })
}

export async function getFeaturedStorefronts(limit = 3) {
  return prisma.storefront.findMany({
    where: { status: 'approved', isFeatured: true },
    include: listIncludes,
    orderBy: { rating: 'desc' },
    take: limit,
  })
}

export async function searchStorefronts(query: string, limit = 8) {
  if (!query.trim()) {
    return prisma.storefront.findMany({
      where: { status: 'approved' },
      include: listIncludes,
      orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }],
      take: limit,
    })
  }

  return prisma.storefront.findMany({
    where: {
      status: 'approved',
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query.toLowerCase()] } },
        { products: { some: { title: { contains: query, mode: 'insensitive' } } } },
      ],
    },
    include: listIncludes,
    orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }],
    take: limit,
  })
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { storefronts: true } } },
  })
}
