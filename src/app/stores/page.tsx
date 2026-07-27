import Link from 'next/link';
import { getStorefronts } from '@/lib/mompop';

export const dynamic = 'force-dynamic';

export default async function StoresPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const storefronts = await getStorefronts(params);
  return <main className="container mx-auto px-4 py-10"><h1 className="text-4xl font-black tracking-tight">Browse local storefronts</h1><form action="/stores" className="mt-6 flex max-w-2xl gap-3"><input name="q" defaultValue={params.q} placeholder="Search stores" className="h-11 flex-1 rounded-md border bg-background px-3"/><button className="rounded-md bg-primary px-5 font-bold text-primary-foreground">Search</button></form><p className="mt-8 text-sm text-muted-foreground">{storefronts.length} storefront{storefronts.length === 1 ? '' : 's'} found</p><div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{storefronts.map((store) => <Link key={store.id} href={`/store/${store.slug}`} className="rounded-xl border bg-card p-6 transition hover:border-primary/50 hover:shadow-md"><p className="text-xs font-bold uppercase tracking-wide text-primary">{store.category_name || 'Local business'}</p><h2 className="mt-2 text-xl font-black">{store.name}</h2><p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{store.description || store.location}</p><p className="mt-4 text-sm font-semibold">{Number(store.rating || 0).toFixed(1)} rating · {store.reviews_count || 0} reviews</p></Link>)}</div>{!storefronts.length ? <div className="mt-6 rounded-xl border border-dashed p-8 text-center text-muted-foreground">No approved storefronts match that search yet.</div> : null}</main>;
}
