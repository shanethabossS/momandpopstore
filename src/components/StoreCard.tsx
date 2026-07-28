import Link from 'next/link';
import { SmartImage } from '@/components/media/SmartImage';
import type { Storefront } from '@/lib/mompop';

/**
 * StoreCard — the single storefront card used on the homepage, /stores and
 * every SEO landing page. Image-first, theme-aware, with a hover zoom,
 * gradient scrim, glass rating chip and a light-sweep sheen on hover.
 */
export function StoreCard({ store, priority = false }: { store: Storefront; priority?: boolean }) {
  const image = store.banner_url || store.logo_url;
  const verified = store.verified_tier && store.verified_tier !== 'none';
  const meta = [store.category_name || 'Independent store', store.location].filter(Boolean).join(' · ');
  return (
    <Link href={`/store/${store.slug}`} className="mkt-card group min-w-0">
      <div className="mkt-card-media mkt-card-media-wide">
        {image ? (
          <SmartImage
            src={image}
            alt={store.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="mkt-card-img object-cover"
          />
        ) : (
          <div className="mkt-card-fallback"><span>{store.name.slice(0, 2).toUpperCase()}</span></div>
        )}
        <span className="mkt-card-scrim" />
        <span className="mkt-card-sheen" />
        <span className="mkt-price-chip">★ {Number(store.rating || 0).toFixed(1)}</span>
        {verified ? <span className="mkt-verified">Verified</span> : null}
      </div>
      <div className="pt-3">
        <h3 className="mkt-card-title line-clamp-1 text-sm font-bold">{store.name}</h3>
        <p className="mkt-card-meta mt-1 truncate text-xs">{meta}</p>
      </div>
    </Link>
  );
}
