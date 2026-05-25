import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function getProductsByStorefront(
  storefrontId: string,
  opts: { activeOnly?: boolean; page?: number; pageSize?: number } = {},
) {
  const { activeOnly = true, page = 1, pageSize = 50 } = opts
  const where: Prisma.ProductWhereInput = { storefrontId }
  if (activeOnly) where.isActive = true

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ])

  return { products, total, page, pageSize }
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } })
}

export async function createProduct(data: {
  storefrontId: string
  title: string
  description?: string
  price: number
  priceLabel?: string
  imageUrl?: string
  tags?: string[]
  paymentType?: string
  isFeatured?: boolean
}) {
  return prisma.product.create({
    data: {
      storefrontId: data.storefrontId,
      title: data.title,
      description: data.description,
      price: data.price,
      priceLabel: data.priceLabel,
      imageUrl: data.imageUrl,
      tags: data.tags ?? [],
      paymentType: data.paymentType ?? 'fygaro',
      isFeatured: data.isFeatured ?? false,
    },
  })
}

export async function updateProduct(
  id: string,
  data: Prisma.ProductUpdateInput,
) {
  return prisma.product.update({ where: { id }, data })
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } })
}

export async function toggleProductActive(id: string) {
  const product = await prisma.product.findUnique({ where: { id }, select: { isActive: true } })
  if (!product) return null
  return prisma.product.update({
    where: { id },
    data: { isActive: !product.isActive },
  })
}

export async function searchProducts(query: string, limit = 5) {
  if (!query.trim()) {
    return prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { storefront: { select: { name: true, slug: true, location: true } } },
      take: limit,
    })
  }

  return prisma.product.findMany({
    where: {
      isActive: true,
      storefront: { status: 'approved' },
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query.toLowerCase()] } },
      ],
    },
    include: { storefront: { select: { name: true, slug: true, location: true } } },
    orderBy: { isFeatured: 'desc' },
    take: limit,
  })
}
