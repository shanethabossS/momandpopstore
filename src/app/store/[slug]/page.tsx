import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStorefront, getStorefrontProducts, money, whatsappUrl } from '@/lib/mompop';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStorefront(slug);
  return store ? { title: store.name, description: store.description || `Visit ${store.name} on Mom & Pop Store.` } : {};
}

export default async function StorePage({ params }: Props) {
  const { slug } = await params;
  const store = await getStorefront(slug);
  if (!store) notFound();
  const products = await getStorefrontProducts(store.id);
  const contact = whatsappUrl(store.whatsapp_number, `Hi ${store.name}, I found your Mom & Pop storefront and would like to order.`);
  return <main className="container mx-auto max-w-5xl px-4 py-10"><Link href="/stores" className="text-sm font-bold text-primary">Back to storefronts</Link><section className="mt-5 rounded-2xl border bg-card p-7"><p className="text-sm font-bold text-primary">{store.category_name || 'Local business'}</p><h1 className="mt-2 text-4xl font-black">{store.name}</h1><p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{store.description}</p><div className="mt-4 flex flex-wrap gap-4 text-sm"><span>{store.location || store.address}</span><span>{Number(store.rating || 0).toFixed(1)} rating · {store.reviews_count || 0} reviews</span></div>{contact ? <a href={contact} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-lg bg-[#1f9d55] px-5 py-3 font-bold text-white">Message on WhatsApp</a> : null}</section><section className="py-10"><h2 className="text-3xl font-black">Products</h2><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <article key={product.id} className="rounded-xl border bg-card p-5"><h3 className="text-lg font-bold">{product.title}</h3><p className="mt-2 text-xl font-black text-primary">{money(product.price, product.price_label)}</p><p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{product.description}</p></article>)}</div>{!products.length ? <div className="mt-5 rounded-xl border border-dashed p-8 text-center text-muted-foreground">This merchant has not published products yet.</div> : null}</section></main>;
}
