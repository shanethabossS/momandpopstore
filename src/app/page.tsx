import Link from 'next/link';
import { MarketplaceMotion } from '@/components/MarketplaceMotion';
import { StoreCard } from '@/components/StoreCard';
import { RotatingWord } from '@/components/hero/RotatingWord';
import { CountUp } from '@/components/hero/CountUp';
import { getStorefronts, momPopDepartments } from '@/lib/mompop';

// Marketplace homepage — new storefronts should surface within the hour, so 1h
// rather than the 24h used on the long-tail /stores/category SEO pages.
export const revalidate = 3600;

const TICKER = momPopDepartments.slice(0, 12).map((d) => {
  const slug = (d.href.split('category=')[1] || '').trim();
  return { label: d.label, href: slug ? `/stores/category/${slug}` : d.href };
});

export default async function HomePage() {
  const [featuredStores, allStores] = await Promise.all([
    getStorefronts({ featured: true }),
    getStorefronts(),
  ]);
  const storefronts = Array.from(new Map([...featuredStores, ...allStores].map((store) => [store.id, store])).values());
  const spotlight = storefronts.slice(0, 8);
  const moreStores = storefronts.slice(8, 20);

  return (
    <main className="mkt-surface bg-background">
      <MarketplaceMotion />
      <section data-market-hero className="mkt-hero">
        <div className="mkt-hero-mesh" />
        <div className="mkt-hero-glow" />
        <div className="mkt-hero-grain" />
        <div className="relative mx-auto grid min-h-[330px] max-w-[1600px] items-end gap-8 px-4 py-10 lg:grid-cols-[1.25fr_.75fr] lg:px-8 lg:py-12">
          <div data-reveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-white/50">Independent commerce, curated</p>
            <h1 className="max-w-5xl text-[clamp(3rem,7vw,7rem)] font-black leading-[0.82] tracking-[-0.075em]">
              Small stores.<br />Big <RotatingWord words={['taste', 'heart', 'hustle', 'flavour', 'love']} />.
            </h1>
            <p className="mt-5 flex items-center gap-2 text-sm font-medium text-white/55"><span aria-hidden="true">🇹🇹</span> Shop small, big up your neighbour — made in Trinidad &amp; Tobago.</p>
          </div>
          <div data-reveal className="pb-1 lg:pb-2">
            <p className="max-w-lg text-base leading-7 text-white/65 sm:text-lg">Discover standout independent businesses, products and services in one beautifully simple marketplace.</p>
            <form action="/stores" className="mt-6 flex h-14 max-w-xl items-center rounded-full bg-white p-1.5 text-black shadow-2xl">
              <input name="q" aria-label="Search the marketplace" placeholder="Search stores, products or services" className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none sm:text-base" />
              <button className="mkt-btn-brand h-full rounded-full px-6 text-sm">Search</button>
            </form>
          </div>
        </div>
      </section>

      <div className="mkt-ticker" aria-label="Browse by department">
        <div className="mkt-ticker-track">
          {[...TICKER, ...TICKER].map((item, i) => (
            <Link key={i} href={item.href} className="mkt-ticker-item" aria-hidden={i >= TICKER.length}>{item.label}</Link>
          ))}
        </div>
      </div>

      <section data-reveal className="mx-auto max-w-[1600px] px-4 pt-8 lg:px-8">
        <div className="mkt-statband">
          <div className="mkt-stat"><div className="mkt-stat-value"><CountUp to={storefronts.length} /></div><div className="mkt-stat-label">Local storefronts</div></div>
          <div className="mkt-stat"><div className="mkt-stat-value"><CountUp to={momPopDepartments.length} /></div><div className="mkt-stat-label">Categories</div></div>
          <div className="mkt-stat"><div className="mkt-stat-value">🇹🇹</div><div className="mkt-stat-label">Made for T&amp;T</div></div>
          <div className="mkt-stat"><div className="mkt-stat-value">✦</div><div className="mkt-stat-label">Order on WhatsApp</div></div>
        </div>
      </section>

      {spotlight.length ? (
        <section data-reveal className="mx-auto max-w-[1600px] px-4 py-8 lg:px-8">
          <div className="mb-5 flex items-end justify-between"><div><p className="mkt-kicker">Selected storefronts</p><h2 className="mkt-title">Worth knowing</h2></div><Link href="/stores" className="mkt-link">Explore all <span>→</span></Link></div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-4">
            {spotlight.map((store, index) => <StoreCard key={store.id} store={store} priority={index < 4} />)}
          </div>
        </section>
      ) : null}

      <section data-reveal className="mkt-surface border-y border-border bg-card">
        <div className="mx-auto max-w-[1600px] px-4 py-8 lg:px-8">
          <div className="mb-5 flex items-end justify-between"><div><p className="mkt-kicker">Browse your way</p><h2 className="mkt-title">Shop every category</h2></div><span className="hidden text-sm text-muted-foreground sm:block">{momPopDepartments.length} departments</span></div>
          <div className="grid grid-cols-2 border-l border-t border-border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {momPopDepartments.map((department, index) => (
              <Link key={department.label} href={department.href} className="mkt-category group">
                <span className="mkt-category-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="mkt-category-label">{department.label}</span>
                <span className="mkt-category-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {moreStores.length ? (
        <section data-reveal className="mx-auto max-w-[1600px] px-4 py-9 lg:px-8">
          <div className="mb-5 flex items-end justify-between"><div><p className="mkt-kicker">More independent finds</p><h2 className="mkt-title">Keep discovering</h2></div><Link href="/signup" className="mkt-link">Open a storefront <span>→</span></Link></div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-4">
            {moreStores.map((store) => <StoreCard key={store.id} store={store} />)}
          </div>
        </section>
      ) : null}

      {!storefronts.length ? <div className="mx-auto max-w-[1600px] px-4 py-16 text-center text-muted-foreground">Approved storefronts will appear here.</div> : null}
    </main>
  );
}
