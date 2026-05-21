import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl, type Storefront } from "@/lib/marketplace-data";
import { CheckCircle2, MapPin, MessageCircle, Star, Zap } from "lucide-react";

type StoreCardProps = {
  store: Storefront;
  compact?: boolean;
};

export function StoreCard({ store, compact = false }: StoreCardProps) {
  const whatsappUrl = buildWhatsAppUrl(
    store.whatsapp,
    `Hi ${store.name}, I found your storefront on Mom & Pop Marketplace and want to place an order.`,
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md">
      <Link href={`/store/${store.slug}`} className="block">
        <div className="relative min-h-28 bg-[linear-gradient(135deg,rgba(20,97,84,0.16),rgba(226,181,80,0.2)),linear-gradient(90deg,rgba(255,255,255,0.9),rgba(247,250,248,0.95))] p-4">
          <div className="absolute right-4 top-4 flex gap-2">
            {store.boosted ? (
              <Badge className="bg-amber-100 text-amber-800">
                <Zap className="size-3" />
                Featured
              </Badge>
            ) : null}
            <Badge className="bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="size-3" />
              {store.verifiedTier}
            </Badge>
          </div>
          <div className="flex size-16 items-center justify-center rounded-lg bg-white text-xl font-black text-primary shadow-sm ring-1 ring-border">
            {store.initials}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <Link href={`/store/${store.slug}`} className="min-w-0">
              <h3 className="line-clamp-2 text-lg font-bold leading-tight transition group-hover:text-primary">
                {store.name}
              </h3>
            </Link>
            <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-amber-700">
              <Star className="size-4 fill-current" />
              {store.rating.toFixed(1)}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{store.category}</span>
            <span aria-hidden="true">/</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {store.location}
            </span>
          </div>
          <p className={compact ? "line-clamp-2 text-sm text-muted-foreground" : "line-clamp-3 text-sm text-muted-foreground"}>
            {store.description}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          {store.tags.slice(0, compact ? 2 : 3).map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2 pt-1">
          <Link href={`/store/${store.slug}`} className="min-w-0">
            <Button variant="outline" className="h-10 w-full">
              View storefront
            </Button>
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label={`Message ${store.name} on WhatsApp`}>
            <Button className="h-10 bg-[#1f9d55] px-3 text-white hover:bg-[#188348]">
              <MessageCircle className="size-4" />
            </Button>
          </a>
        </div>
      </div>
    </article>
  );
}
