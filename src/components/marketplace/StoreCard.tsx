import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, MapPin, Star, Zap } from "lucide-react"
import type { StorefrontCard } from "@/lib/types"
import type { Storefront as MockStorefront } from "@/lib/marketplace-data"

type StoreCardProps = {
  store: StorefrontCard | MockStorefront
  compact?: boolean
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function isDbStorefront(store: StorefrontCard | MockStorefront): store is StorefrontCard {
  return 'id' in store && '_count' in store
}

export function StoreCard({ store, compact = false }: StoreCardProps) {
  const isDb = isDbStorefront(store)

  const slug = store.slug
  const name = store.name
  const initials = isDb ? getInitials(name) : (store as MockStorefront).initials
  const rating = Number(isDb ? store.rating : store.rating)
  const isFeatured = isDb ? store.isFeatured : (store as MockStorefront).boosted
  const verifiedTier = isDb
    ? (store.verifiedTier === 'tier2' ? 'Tier 2' : 'Tier 1')
    : (store as MockStorefront).verifiedTier
  const categoryName = isDb ? (store.category?.name || 'General') : (store as MockStorefront).category
  const location = isDb ? (store.location || 'Trinidad') : (store as MockStorefront).location
  const description = isDb ? store.description : (store as MockStorefront).description
  const tags = isDb ? store.tags : (store as MockStorefront).tags

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md">
      <Link href={`/store/${slug}`} className="block">
        <div className="relative min-h-28 bg-[linear-gradient(135deg,rgba(20,97,84,0.16),rgba(226,181,80,0.2)),linear-gradient(90deg,rgba(255,255,255,0.9),rgba(247,250,248,0.95))] p-4">
          <div className="absolute right-4 top-4 flex gap-2">
            {isFeatured ? (
              <Badge className="bg-amber-100 text-amber-800">
                <Zap className="size-3" />
                Featured
              </Badge>
            ) : null}
            <Badge className="bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="size-3" />
              {verifiedTier}
            </Badge>
          </div>
          <div className="flex size-16 items-center justify-center rounded-lg bg-white text-xl font-black text-primary shadow-sm ring-1 ring-border">
            {initials}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <Link href={`/store/${slug}`} className="min-w-0">
              <h3 className="line-clamp-2 text-lg font-bold leading-tight transition group-hover:text-primary">
                {name}
              </h3>
            </Link>
            <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-amber-700">
              <Star className="size-4 fill-current" />
              {rating.toFixed(1)}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{categoryName}</span>
            <span aria-hidden="true">/</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {location}
            </span>
          </div>
          <p className={compact ? "line-clamp-2 text-sm text-muted-foreground" : "line-clamp-3 text-sm text-muted-foreground"}>
            {description}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          {tags.slice(0, compact ? 2 : 3).map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-1">
          <Link href={`/store/${slug}`} className="block">
            <Button variant="outline" className="h-10 w-full">
              View storefront
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
