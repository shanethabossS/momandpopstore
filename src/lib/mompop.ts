import { cache } from 'react';

const apiBase = (process.env.API_SERVER_URL || 'https://api.sovdigitalgroup.com').replace(/\/$/, '');

export type Storefront = {
  id: string; name: string; slug: string; description?: string | null; logo_url?: string | null;
  banner_url?: string | null; whatsapp_number?: string | null; address?: string | null;
  location?: string | null; service_area?: string | null; hours?: string[]; tags?: string[];
  deals?: string[]; offers_delivery?: boolean; offers_pickup?: boolean; rating?: number | string;
  reviews_count?: number; verified_tier?: string; is_featured?: boolean; category_name?: string | null;
};

export type Product = {
  id: string; storefront_id: string; title: string; description?: string | null; price?: number | string | null;
  price_label?: string | null; image_url?: string | null; tags?: string[]; payment_type?: string;
};

export const momPopDepartments = [
  { label: 'Food & Drink', href: '/stores?category=food-drink' },
  { label: 'Fashion', href: '/stores?category=fashion-beauty' },
  { label: 'Beauty', href: '/stores?q=beauty' },
  { label: 'Home & Garden', href: '/stores?category=home-garden' },
  { label: 'Health & Wellness', href: '/stores?category=health-wellness' },
  { label: 'Professional Services', href: '/stores?category=professional-services' },
  { label: 'Arts & Crafts', href: '/stores?category=arts-crafts' },
  { label: 'Technology', href: '/stores?category=technology' },
  { label: 'Bakeries', href: '/stores?q=bakery' },
  { label: 'Restaurants', href: '/stores?q=restaurant' },
  { label: 'Jewellery', href: '/stores?q=jewellery' },
  { label: 'Gifts', href: '/stores?q=gifts' },
  { label: 'Kids & Baby', href: '/stores?q=kids' },
  { label: 'Pet Care', href: '/stores?q=pet' },
  { label: 'Automotive', href: '/stores?q=automotive' },
  { label: 'Events', href: '/stores?q=events' },
  { label: 'Repairs', href: '/stores?q=repair' },
  { label: 'Other', href: '/stores?category=other' },
] as const;

async function getJson<T>(path: string): Promise<T | null> {
  const response = await fetch(`${apiBase}/api/mompop${path}`, { next: { revalidate: 300 } }).catch(() => null);
  if (!response?.ok) return null;
  return response.json() as Promise<T>;
}

export async function getStorefronts(params: { q?: string; category?: string; featured?: boolean } = {}) {
  const search = new URLSearchParams();
  if (params.q) search.set('q', params.q);
  if (params.category) search.set('category', params.category);
  if (params.featured) search.set('featured', 'true');
  const data = await getJson<{ storefronts: Storefront[] }>(`/storefronts?${search}`);
  return data?.storefronts || [];
}

export const getStorefront = cache(async (slug: string) => {
  const data = await getJson<{ storefront: Storefront }>(`/storefronts/slug/${encodeURIComponent(slug)}`);
  return data?.storefront || null;
});

export async function getStorefrontProducts(id: string) {
  const data = await getJson<{ products: Product[] }>(`/storefronts/${encodeURIComponent(id)}/products`);
  return data?.products || [];
}

export function money(value: Product['price'], label?: string | null) {
  if (label) return label;
  const amount = Number(value);
  return Number.isFinite(amount) ? new Intl.NumberFormat('en-TT', { style: 'currency', currency: 'TTD' }).format(amount) : 'Price on request';
}

export function whatsappUrl(number: string | null | undefined, message: string) {
  const digits = String(number || '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null;
}
