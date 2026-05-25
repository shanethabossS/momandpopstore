export type StorefrontCard = {
  id: string
  name: string
  slug: string
  description: string | null
  location: string | null
  address: string | null
  rating: number
  reviewsCount: number
  verifiedTier: string
  isFeatured: boolean
  logoUrl: string | null
  tags: string[]
  category: { name: string; slug: string } | null
  _count: { reviews: number; products: number }
}

export type ProductSearchResult = {
  id: string
  title: string
  price: number
  priceLabel: string | null
  isFeatured: boolean
  storefront: {
    name: string
    slug: string
    location: string | null
  }
}

export type CategoryInfo = {
  id: string
  name: string
  slug: string
  count: number
}
