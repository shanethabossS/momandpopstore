import Link from 'next/link';
import { MarketplaceMotion } from '@/components/MarketplaceMotion';
import { StoreCard } from '@/components/StoreCard';
import { getStorefronts, momPopDepartments } from '@/lib/mompop';

export const dynamic = 'force-dynamic';

export default async function StoresPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const storefronts = await getStorefronts(params);
  return (
    <main className="bg-background">
      <MarketplaceMotion />
      <section className="mx-auto max-w-[1600px] px-4 pb-2 pt-9 lg:px-8">
        <div className="max-w-3xl" data-reveal>
          <p className="mkt-kicker">Mom &amp; Pop</p>
          <h1 className="mkt-title mt-1 text-4xl">{params.q ? `“${params.q}”` : 'Browse local storefronts'}</h1>
          <p className="mt-3 text-muted-foreground">Independent Trinidad &amp; Tobago businesses, all in one place.</p>
        </div>
        <form action="/stores" className="mt-6 flex max-w-2xl flex-col gap-2 sm:flex-row">
          <input name="q" defaultValue={params.q} placeholder="Search stores, products or services" className="h-11 flex-1 rounded-full border border-border bg-card px-4 text-sm outline-none transition focus:border-brand" />
          <button className="mkt-btn-brand h-11 rounded-full px-6 text-sm">Search</button>
        </form>
        <nav aria-label="Departments" className="mt-6 flex flex-wrap gap-2">
          {momPopDepartments.slice(0, 12).map((d) => <Link key={d.label} href={d.href} className="mkt-pill">{d.label}</Link>)}
        </nav>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">
        <p className="mb-4 text-sm text-muted-foreground">{storefronts.length} storefront{storefronts.length === 1 ? '' : 's'} found</p>
        {storefronts.length ? (
          <div data-reveal-stagger className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-4">
            {storefronts.map((store, index) => <StoreCard key={store.id} store={store} priority={index < 4} />)}
          </div>
        ) : (
          <div className="mkt-empty">
            <div className="mkt-empty-mark">🏪</div>
            <h2 className="mt-4 text-lg font-black">No storefronts yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">No approved storefronts match that search. Run your own shop? Open one in minutes.</p>
            <Link href="/signup" className="mkt-btn-brand mt-5 rounded-full px-5 py-2.5 text-sm">Open a storefront</Link>
          </div>
        )}
      </section>
    </main>
  );
}
