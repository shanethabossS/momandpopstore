import Link from 'next/link';
import { MarketplaceMotion } from '@/components/MarketplaceMotion';
import { getStorefronts, momPopDepartments, type Storefront } from '@/lib/mompop';

export const revalidate = 300;

export default async function HomePage() {
  const [featuredStores, allStores] = await Promise.all([
    getStorefronts({ featured: true }),
    getStorefronts(),
  ]);
  const storefronts = Array.from(new Map([...featuredStores, ...allStores].map((store) => [store.id, store])).values());
  const spotlight = storefronts.slice(0, 8);
  const moreStores = storefronts.slice(8, 20);

  return (
    <main className="bg-[#f7f7f5]">
      <MarketplaceMotion />
      <section data-market-hero className="relative overflow-hidden bg-black text-white">
        <div className="pointer-events-none absolute inset-0 opacity-80 [background:radial-gradient(520px_circle_at_var(--pointer-x,72%)_var(--pointer-y,35%),rgba(255,56,92,.32),transparent_60%)]" />
        <div className="relative mx-auto grid min-h-[330px] max-w-[1600px] items-end gap-8 px-4 py-10 lg:grid-cols-[1.25fr_.75fr] lg:px-8 lg:py-12">
          <div data-reveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-white/50">Independent commerce, curated</p>
            <h1 className="max-w-5xl text-[clamp(3rem,7.2vw,7.4rem)] font-black leading-[0.82] tracking-[-0.075em]">Small stores. Big taste.</h1>
          </div>
          <div data-reveal className="pb-1 lg:pb-2">
            <p className="max-w-lg text-base leading-7 text-white/65 sm:text-lg">Discover standout independent businesses, products and services in one beautifully simple marketplace.</p>
            <form action="/stores" className="mt-6 flex h-14 max-w-xl items-center rounded-full bg-white p-1.5 text-black shadow-2xl">
              <input name="q" aria-label="Search the marketplace" placeholder="Search stores, products or services" className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none sm:text-base" />
              <button className="h-full rounded-full bg-[#ff385c] px-6 text-sm font-bold text-white">Search</button>
            </form>
          </div>
        </div>
      </section>

      {spotlight.length ? (
        <section data-reveal className="mx-auto max-w-[1600px] px-4 py-8 lg:px-8">
          <div className="mb-5 flex items-end justify-between"><div><p className="mp-kicker">Selected storefronts</p><h2 className="mp-title">Worth knowing</h2></div><Link href="/stores" className="mp-link">Explore all <span>→</span></Link></div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-4">
            {spotlight.map((store) => <StorefrontCard key={store.id} store={store} />)}
          </div>
        </section>
      ) : null}

      <section data-reveal className="border-y border-black/10 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-8 lg:px-8">
          <div className="mb-5 flex items-end justify-between"><div><p className="mp-kicker">Browse your way</p><h2 className="mp-title">Shop every category</h2></div><span className="hidden text-sm text-black/45 sm:block">{momPopDepartments.length} departments</span></div>
          <div className="grid grid-cols-2 border-l border-t border-black/10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {momPopDepartments.map((department, index) => (
              <Link key={department.label} href={department.href} className="mp-category group">
                <span className="text-[10px] font-bold tabular-nums text-black/30">{String(index + 1).padStart(2, '0')}</span>
                <span className="mt-7 max-w-[14ch] text-sm font-bold leading-tight">{department.label}</span>
                <span className="absolute bottom-4 right-4 text-black/25 transition group-hover:translate-x-1 group-hover:text-[#ff385c]">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {moreStores.length ? (
        <section data-reveal className="mx-auto max-w-[1600px] px-4 py-9 lg:px-8">
          <div className="mb-5 flex items-end justify-between"><div><p className="mp-kicker">More independent finds</p><h2 className="mp-title">Keep discovering</h2></div><Link href="/signup" className="mp-link">Open a storefront <span>→</span></Link></div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-4">
            {moreStores.map((store) => <StorefrontCard key={store.id} store={store} />)}
          </div>
        </section>
      ) : null}

      {!storefronts.length ? <div className="mx-auto max-w-[1600px] px-4 py-16 text-center text-black/45">Approved storefronts will appear here.</div> : null}
    </main>
  );
}

function StorefrontCard({ store }: { store: Storefront }) {
  const image = store.banner_url || store.logo_url;
  return (
    <Link href={`/store/${store.slug}`} className="group min-w-0">
      <div className="mp-card-media">
        {image ? <div className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.035]" style={{ backgroundImage: `url("${String(image).replaceAll('"', '%22')}")` }} /> : <div className="mp-card-fallback"><span>{store.name.slice(0, 2).toUpperCase()}</span></div>}
        {store.verified_tier && store.verified_tier !== 'none' ? <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide shadow-sm">Verified</span> : null}
      </div>
      <div className="pt-3">
        <div className="flex items-start justify-between gap-3"><h3 className="line-clamp-1 text-sm font-bold">{store.name}</h3><span className="shrink-0 text-xs font-bold">★ {Number(store.rating || 0).toFixed(1)}</span></div>
        <p className="mt-1 truncate text-xs text-black/48">{store.category_name || 'Independent store'}{store.location ? ` · ${store.location}` : ''}</p>
      </div>
    </Link>
  );
}
