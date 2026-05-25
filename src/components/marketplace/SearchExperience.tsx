"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Store, Tag } from "lucide-react"
import type { StorefrontCard, ProductSearchResult, CategoryInfo } from "@/lib/types"

type SearchExperienceProps = {
  mode?: "hero" | "directory"
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatPrice(price: number, label: string | null): string {
  if (label) return label
  return `TT$${price.toFixed(2)}`
}

export function SearchExperience({ mode = "hero" }: SearchExperienceProps) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState<CategoryInfo[]>([])
  const [storefronts, setStorefronts] = useState<StorefrontCard[]>([])
  const [products, setProducts] = useState<ProductSearchResult[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        const params = new URLSearchParams()
        if (query.trim()) params.set('q', query.trim())
        if (category) params.set('category', category)
        params.set('limit', mode === 'hero' ? '4' : '8')

        const res = await fetch(`/api/search?${params}`)
        if (res.ok) {
          const data = await res.json()
          setStorefronts(data.storefronts || [])
          setProducts(data.products || [])
          if (!loaded) {
            setCategories(data.categories || [])
            setLoaded(true)
          }
        }
      } catch { /* ignore */ }
    }, query.trim() ? 300 : 0)

    return () => clearTimeout(timeout)
  }, [query, category, mode, loaded])

  const showResults = mode === "directory" || query.trim().length > 0 || category !== ""

  const allCategories = useMemo(() => [
    { id: '', name: 'All', slug: '', count: 0 },
    ...categories,
  ], [categories])

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search doubles, hardware, salons, Chaguanas, deals..."
          className="h-13 rounded-lg border-input bg-card pl-12 pr-4 text-base shadow-sm focus-visible:border-primary focus-visible:ring-primary/25"
          aria-label="Search Mom & Pop Marketplace storefronts and products"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {allCategories.map((item) => (
          <button
            key={item.slug || 'all'}
            type="button"
            onClick={() => setCategory(item.slug)}
            className={`h-9 shrink-0 rounded-full border px-3 text-sm font-medium transition ${
              category === item.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {showResults ? (
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">
              {storefronts.length} storefront{storefronts.length === 1 ? "" : "s"} found
            </span>
            {query.trim() && <Badge variant="outline">Search results</Badge>}
          </div>

          <div className="divide-y divide-border">
            {storefronts.map((store) => (
              <Link
                key={store.slug}
                href={`/store/${store.slug}`}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 transition hover:bg-muted/60 focus:bg-muted/60 focus:outline-none"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-black text-primary">
                  {getInitials(store.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{store.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {store.category?.name || 'General'} / {store.location || 'Trinidad'}
                  </span>
                </span>
                <Store className="size-4 text-muted-foreground" />
              </Link>
            ))}

            {products.length ? (
              <div className="bg-muted/35 px-4 py-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <Tag className="size-3.5" />
                  Product matches
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/store/${product.storefront.slug}`}
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm transition hover:border-primary/40"
                    >
                      <span className="block font-semibold">{product.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {formatPrice(Number(product.price), product.priceLabel)} at {product.storefront.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        !loaded ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Loading storefronts...</div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            {storefronts.slice(0, 4).map((store) => (
              <Link
                key={store.slug}
                href={`/store/${store.slug}`}
                className="rounded-lg border border-border bg-card px-3 py-2 font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              >
                {store.location || store.name}
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  )
}
