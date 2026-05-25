/**
 * SOV Digital Group — Ecosystem site directory
 *
 * CANONICAL SOURCE: Copy this file to every SOV app's src/lib/sov-ecosystem.ts
 * When adding/removing a site, update this file and copy to all apps.
 *
 * Last updated: 2026-05-25
 */

export interface SovSite {
  name: string;
  slug: string;
  url: string;
  description: string;
  category: 'marketplace' | 'service' | 'social' | 'finance' | 'admin' | 'mobile';
  live: boolean;
}

export const SOV_ECOSYSTEM: SovSite[] = [
  { name: 'TTClassifieds', slug: 'ttclassifieds', url: 'https://ttclassifieds.com', description: 'Buy & sell classifieds', category: 'marketplace', live: true },
  { name: 'FindWorkTT', slug: 'findworktt', url: 'https://findworktt.com', description: 'Job listings & hiring', category: 'service', live: true },
  { name: 'FixNowTT', slug: 'fixnowtt', url: 'https://fixnowtt.com', description: 'Home repair & trades', category: 'service', live: true },
  { name: 'RentMeTT', slug: 'rentmett', url: 'https://rentmett.com', description: 'Property rentals', category: 'marketplace', live: true },
  { name: 'ShowLoveTT', slug: 'showlovett', url: 'https://showlovett.com', description: 'Crowdfunding & donations', category: 'finance', live: true },
  { name: 'TalkFreeTT', slug: 'talkfreett', url: 'https://talkfreett.com', description: 'Community forum', category: 'social', live: true },
  { name: 'FoodTT', slug: 'foodtt', url: 'https://foodtt.vercel.app', description: 'Food delivery & ordering', category: 'marketplace', live: true },
  { name: 'AuctionTT', slug: 'auctiontt', url: 'https://auctionsite-web.vercel.app', description: 'Online auctions', category: 'marketplace', live: true },
  { name: 'Mom & Pop Store', slug: 'momandpopstore', url: 'https://momandpopstore.vercel.app', description: 'Local storefront marketplace', category: 'marketplace', live: true },
  { name: 'SOV Connect', slug: 'sovconnect', url: 'https://ttmerchant.vercel.app', description: 'Business & driver onboarding', category: 'service', live: true },
  { name: 'Shop868', slug: 'shop868', url: '#', description: 'Caribbean mobile marketplace', category: 'mobile', live: false },
  { name: 'SOV Invoice', slug: 'sovinvoice', url: '#', description: 'Invoicing & billing SaaS', category: 'finance', live: false },
];

/** Only sites that are live and publicly accessible */
export const SOV_LIVE_SITES = SOV_ECOSYSTEM.filter((s) => s.live);

/** Sites to show in footer nav (exclude admin, current app) */
export function getEcosystemLinks(currentSlug?: string) {
  return SOV_LIVE_SITES.filter(
    (s) => s.slug !== currentSlug && s.category !== 'admin',
  );
}
