/**
 * NetworkBar — slim cross-site top strip for all SOV Digital apps.
 * Shared SOV marketplace module (duplicated per app; keep the site list in sync).
 */

const NETWORK_SITES = [
  { id: 'ttclassifieds', name: 'TTClassifieds', href: 'https://ttclassifieds.com', dot: '#00b7ff' },
  { id: 'fixnowtt', name: 'FixNowTT', href: 'https://fixnowtt.com', dot: '#12b886' },
  { id: 'findworktt', name: 'FindWorkTT', href: 'https://findworktt.com', dot: '#4f46e5' },
  { id: 'rentmett', name: 'RentMeTT', href: 'https://rentmett.com', dot: '#f97316' },
  { id: 'showlovett', name: 'ShowLoveTT', href: 'https://showlovett.com', dot: '#ec4899' },
  { id: 'talkfreett', name: 'TalkFreeTT', href: 'https://talkfreett.com', dot: '#a855f7' },
  { id: 'foodtt', name: 'FoodsTT', href: 'https://www.foodstt.com', dot: '#f43f5e' },
  { id: 'farmlinktt', name: 'FarmLinkTT', href: 'https://farmlinktt.vercel.app', dot: '#22c55e' },
  { id: 'sovpredict', name: 'SOV Predict', href: 'https://sovpredict.vercel.app', dot: '#14b8a6' },
  { id: 'dealztt', name: 'DealzTT', href: 'https://dealztt.com', dot: '#eab308' },
  { id: 'momandpopstore', name: 'Mom & Pop', href: 'https://momandpopstore.vercel.app', dot: '#d97706' },
  { id: 'shop868', name: 'Shop868', href: 'https://shop868-web.vercel.app', dot: '#0891b2' },
];

export function NetworkBar({ currentSite }: { currentSite: string }) {
  return (
    <div className="sov-network-bar">
      <span className="sov-network-label">SOV Network</span>
      <div className="sov-network-chips">
        {NETWORK_SITES.map((site) => {
          const isCurrent = site.id === currentSite;
          const dot = <span className="sov-network-dot" style={{ background: site.dot }} />;
          return isCurrent ? (
            <span key={site.id} className="sov-network-chip sov-network-chip-current">
              {dot}
              {site.name}
            </span>
          ) : (
            <a key={site.id} href={site.href} className="sov-network-chip" target="_blank" rel="noopener noreferrer">
              {dot}
              {site.name}
            </a>
          );
        })}
      </div>
    </div>
  );
}
