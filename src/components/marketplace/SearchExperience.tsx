"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Store, Tag } from "lucide-react";
import { allProducts, categories, searchStorefronts, storefronts } from "@/lib/marketplace-data";

type SearchExperienceProps = {
  mode?: "hero" | "directory";
};

export function SearchExperience({ mode = "hero" }: SearchExperienceProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const matches = useMemo(() => {
    const byQuery = searchStorefronts(query);
    return category === "All" ? byQuery : byQuery.filter((store) => store.category === category);
  }, [category, query]);

  const productMatches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return allProducts.filter((product) => product.featured).slice(0, 4);
    }

    return allProducts
      .filter((product) =>
        [product.name, product.description, product.tags.join(" "), product.storeName, product.location]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .slice(0, 5);
  }, [query]);

  const showResults = mode === "directory" || query.trim().length > 0 || category !== "All";

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
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`h-9 shrink-0 rounded-full border px-3 text-sm font-medium transition ${
              category === item
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {showResults ? (
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">
              {matches.length} storefront{matches.length === 1 ? "" : "s"} found
            </span>
            <Badge variant="outline">Case-insensitive partial search</Badge>
          </div>

          <div className="divide-y divide-border">
            {matches.slice(0, mode === "hero" ? 4 : 8).map((store) => (
              <Link
                key={store.slug}
                href={`/store/${store.slug}`}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 transition hover:bg-muted/60 focus:bg-muted/60 focus:outline-none"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-black text-primary">
                  {store.initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{store.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {store.category} / {store.location}
                  </span>
                </span>
                <Store className="size-4 text-muted-foreground" />
              </Link>
            ))}

            {productMatches.length ? (
              <div className="bg-muted/35 px-4 py-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <Tag className="size-3.5" />
                  Product matches
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {productMatches.map((product) => (
                    <Link
                      key={`${product.storeSlug}-${product.id}`}
                      href={`/store/${product.storeSlug}`}
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm transition hover:border-primary/40"
                    >
                      <span className="block font-semibold">{product.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {product.price} at {product.storeName}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          {storefronts.slice(0, 4).map((store) => (
            <Link
              key={store.slug}
              href={`/store/${store.slug}`}
              className="rounded-lg border border-border bg-card px-3 py-2 font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            >
              {store.location}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
