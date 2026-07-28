import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarketplaceMotion } from '@/components/MarketplaceMotion';
import { StoreCard } from '@/components/StoreCard';
import { getStorefronts, momPopDepartments } from '@/lib/mompop';

export const revalidate = 300;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

const DEPARTMENTS = momPopDepartments
  .map((d) => ({ slug: (d.href.split('category=')[1] || '').trim(), label: d.label }))
  .filter((d) => d.slug);

export function generateStaticParams() { return DEPARTMENTS.map((d) => ({ slug: d.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dept = DEPARTMENTS.find((d) => d.slug === slug);
  if (!dept) return {};
  return {
    title: `${dept.label} businesses in Trinidad & Tobago`,
    description: `Discover verified local ${dept.label.toLowerCase()} storefronts in Trinidad & Tobago on Mom & Pop Store. Browse, then order directly via WhatsApp.`,
    alternates: { canonical: `/stores/category/${slug}` },
    openGraph: { title: `${dept.label} businesses in T&T | Mom & Pop Store`, description: `Local ${dept.label.toLowerCase()} storefronts across Trinidad & Tobago.`, type: 'website' },
  };
}

export default async function StoreCategoryPage({ params }: Props) {
  const { slug } = await params;
  const dept = DEPARTMENTS.find((d) => d.slug === slug);
  if (!dept) notFound();
  const storefronts = await getStorefronts({ category: slug });
  const others = DEPARTMENTS.filter((d) => d.slug !== slug).slice(0, 10);
  const jsonLd = { '@context': 'https://schema.org', '@type': 'ItemList', name: `${dept.label} storefronts`, numberOfItems: storefronts.length, itemListElement: storefronts.map((store, index) => ({ '@type': 'ListItem', position: index + 1, url: `https://momandpopstore.vercel.app/store/${store.slug}`, name: store.name })) };

  return (
    <main className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MarketplaceMotion />
      <section className="mx-auto max-w-[1600px] px-4 pb-2 pt-9 lg:px-8" data-reveal>
        <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Link href="/stores" className="hover:text-brand">All stores</Link><span>/</span><span className="text-foreground">{dept.label}</span>
        </nav>
        <h1 className="mkt-title mt-3 text-4xl">{dept.label} in Trinidad &amp; Tobago</h1>
        <p className="mt-2 text-muted-foreground">{storefronts.length} local {dept.label.toLowerCase()} storefront{storefronts.length === 1 ? '' : 's'}.</p>
        <nav aria-label="Other departments" className="mt-6 flex flex-wrap gap-2">
          {others.map((d) => <Link key={d.slug} href={`/stores/category/${d.slug}`} className="mkt-pill">{d.label}</Link>)}
        </nav>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">
        {storefronts.length ? (
          <div data-reveal-stagger className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-4">
            {storefronts.map((store, index) => <StoreCard key={store.id} store={store} priority={index < 4} />)}
          </div>
        ) : (
          <div className="mkt-empty">
            <div className="mkt-empty-mark">🏪</div>
            <h2 className="mt-4 text-lg font-black">No {dept.label.toLowerCase()} stores yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">This department is just getting started. Run a {dept.label.toLowerCase()} business? Open your storefront.</p>
            <Link href="/signup" className="mkt-btn-brand mt-5 rounded-full px-5 py-2.5 text-sm">Open a storefront</Link>
          </div>
        )}
      </section>
    </main>
  );
}
