import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStorefront, getStorefrontProducts, money, whatsappUrl, type Product } from '@/lib/mompop';
import { SmartImage } from '@/components/media/SmartImage';
import { MarketplaceMotion } from '@/components/MarketplaceMotion';

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStorefront(slug);
  return store ? { title: store.name, description: store.description || `Visit ${store.name} on Mom & Pop Store.`, alternates: { canonical: `/store/${slug}` } } : {};
}

export default async function StorePage({ params }: Props) {
  const { slug } = await params;
  const store = await getStorefront(slug);
  if (!store) notFound();
  const products = await getStorefrontProducts(store.id);
  const contact = whatsappUrl(store.whatsapp_number, `Hi ${store.name}, I found your Mom & Pop storefront and would like to order.`);
  const verified = store.verified_tier && store.verified_tier !== 'none';
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Store', name: store.name, description: store.description || undefined, image: store.banner_url || store.logo_url || undefined, address: store.location || store.address || undefined, aggregateRating: store.reviews_count ? { '@type': 'AggregateRating', ratingValue: Number(store.rating || 0), reviewCount: store.reviews_count } : undefined };

  return (
    <main className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MarketplaceMotion />

      <div className="mkt-store-banner">
        {store.banner_url ? (
          <SmartImage src={store.banner_url} alt={`${store.name} banner`} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div className="mkt-card-fallback"><span>{store.name.slice(0, 2).toUpperCase()}</span></div>
        )}
        <span className="mkt-card-scrim" />
      </div>

      <section className="mx-auto -mt-14 max-w-[1100px] px-4 lg:px-8">
        <div data-reveal className="rounded-2xl border border-border bg-card p-5 shadow-lg sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="mkt-store-logo">
              {store.logo_url ? (
                <SmartImage src={store.logo_url} alt={`${store.name} logo`} fill sizes="88px" className="object-cover" />
              ) : (
                <span>{store.name.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="mkt-kicker">{store.category_name || 'Local business'}</p>
                {verified ? <span className="mkt-verified" style={{ position: 'static' }}>Verified</span> : null}
              </div>
              <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{store.name}</h1>
              {store.description ? <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{store.description}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {store.location || store.address ? <span className="mkt-pill">📍 {store.location || store.address}</span> : null}
                <span className="mkt-pill">★ {Number(store.rating || 0).toFixed(1)} · {store.reviews_count || 0} reviews</span>
                {store.offers_delivery ? <span className="mkt-pill">🚚 Delivery</span> : null}
                {store.offers_pickup ? <span className="mkt-pill">🛍️ Pickup</span> : null}
              </div>
              {contact ? (
                <a href={contact} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1f9d55] px-6 py-3 font-bold text-white transition hover:bg-[#188045]">
                  <span aria-hidden="true">💬</span> Message on WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-10 lg:px-8">
        <h2 className="mkt-title text-3xl">Products</h2>
        {products.length ? (
          <div data-reveal-stagger className="mt-6 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-4">
            {products.map((product) => <ProductTile key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="mkt-empty mt-6">
            <div className="mkt-empty-mark">📦</div>
            <h3 className="mt-4 text-lg font-black">No products published yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">Check back soon — or message the store directly to ask what&apos;s in stock.</p>
          </div>
        )}
      </section>
    </main>
  );
}

function ProductTile({ product }: { product: Product }) {
  return (
    <article className="mkt-card min-w-0">
      <div className="mkt-card-media">
        {product.image_url ? (
          <SmartImage src={product.image_url} alt={product.title} fill sizes="(max-width: 640px) 50vw, 25vw" className="mkt-card-img object-cover" />
        ) : (
          <div className="mkt-card-fallback"><span>{product.title.slice(0, 2).toUpperCase()}</span></div>
        )}
        <span className="mkt-card-scrim" />
        <span className="mkt-card-sheen" />
        <span className="mkt-price-chip">{money(product.price, product.price_label)}</span>
      </div>
      <div className="pt-3">
        <h3 className="mkt-card-title line-clamp-1 text-sm font-bold">{product.title}</h3>
        {product.description ? <p className="mkt-card-meta mt-1 line-clamp-2 text-xs">{product.description}</p> : null}
      </div>
    </article>
  );
}
