import { prisma } from '@/lib/prisma'

export async function getWhatsAppLeadUrl(
  storefrontSlug: string,
  message: string,
) {
  const storefront = await prisma.storefront.findUnique({
    where: { slug: storefrontSlug },
    select: { whatsappNumber: true, name: true },
  })

  if (!storefront?.whatsappNumber) return null

  return {
    url: `https://wa.me/${storefront.whatsappNumber}?text=${encodeURIComponent(message)}`,
    storeName: storefront.name,
    phone: storefront.whatsappNumber,
  }
}

export async function getStorefrontContact(storefrontId: string) {
  return prisma.storefront.findUnique({
    where: { id: storefrontId },
    select: {
      id: true,
      name: true,
      slug: true,
      whatsappNumber: true,
      address: true,
      location: true,
      hours: true,
      user: { select: { name: true, email: true, phone: true } },
    },
  })
}

export async function getStorefrontLeadSummary(storefrontId: string) {
  const storefront = await prisma.storefront.findUnique({
    where: { id: storefrontId },
    select: {
      id: true,
      name: true,
      slug: true,
      whatsappNumber: true,
      _count: { select: { products: true, reviews: true } },
      rating: true,
      reviewsCount: true,
      status: true,
      verifiedTier: true,
    },
  })

  return storefront
}

export async function getStorefrontsWithContacts(opts: {
  page?: number
  pageSize?: number
  hasWhatsApp?: boolean
} = {}) {
  const { page = 1, pageSize = 20, hasWhatsApp } = opts

  const where: Record<string, unknown> = { status: 'approved' }
  if (hasWhatsApp === true) where.whatsappNumber = { not: null }
  if (hasWhatsApp === false) where.whatsappNumber = null

  const [storefronts, total] = await Promise.all([
    prisma.storefront.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        whatsappNumber: true,
        location: true,
        category: { select: { name: true } },
        user: { select: { name: true, email: true, phone: true } },
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.storefront.count({ where }),
  ])

  return { storefronts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}
