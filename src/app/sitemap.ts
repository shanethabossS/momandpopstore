import type { MetadataRoute } from 'next';
import { getStorefronts } from '@/lib/mompop';

const baseUrl = 'https://momandpopstore.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const storefronts = await getStorefronts();
  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/stores`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/start`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ...storefronts.map((store) => ({ url: `${baseUrl}/store/${store.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: store.is_featured ? 0.9 : 0.8 })),
  ];
}
