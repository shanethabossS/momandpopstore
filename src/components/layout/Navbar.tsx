'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/92 backdrop-blur">
      <div className="sov-network-bar">
        <span className="sov-network-label">SOV Network</span>
        <div className="sov-network-chips">
          <a href="https://ttclassifieds.com" className="sov-network-chip" target="_blank" rel="noopener noreferrer">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00b7ff', display: 'inline-block', flexShrink: 0 }} />
            TTClassifieds
          </a>
          <a href="https://fixnowtt.com" className="sov-network-chip" target="_blank" rel="noopener noreferrer">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#12b886', display: 'inline-block', flexShrink: 0 }} />
            FixNowTT
          </a>
          <a href="https://findworktt.com" className="sov-network-chip" target="_blank" rel="noopener noreferrer">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f46e5', display: 'inline-block', flexShrink: 0 }} />
            FindWorkTT
          </a>
          <a href="https://rentmett.com" className="sov-network-chip" target="_blank" rel="noopener noreferrer">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', display: 'inline-block', flexShrink: 0 }} />
            RentMeTT
          </a>
          <a href="https://showlovett.com" className="sov-network-chip" target="_blank" rel="noopener noreferrer">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ec4899', display: 'inline-block', flexShrink: 0 }} />
            ShowLoveTT
          </a>
          <a href="https://talkfreett.com" className="sov-network-chip" target="_blank" rel="noopener noreferrer">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a855f7', display: 'inline-block', flexShrink: 0 }} />
            TalkFreeTT
          </a>
          <span className="sov-network-chip sov-network-chip-current">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d97706', display: 'inline-block', flexShrink: 0 }} />
            Mom &amp; Pop Store
          </span>
        </div>
      </div>

      <div className="container mx-auto flex min-h-16 items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground">
            M&P
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xl font-black tracking-tight">Mom &amp; Pop Store</span>
            <span className="hidden text-xs font-medium text-muted-foreground sm:block">
              Powered by Sovereign Digital Group Limited
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/stores" className="text-sm font-semibold text-muted-foreground transition hover:text-foreground">
            Browse stores
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold text-muted-foreground transition hover:text-foreground">
            Merchant
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <div className="hidden items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 lg:flex">
            <ShieldCheck className="size-3.5" />
            Verified sellers
          </div>
          {!loading && user ? (
            <div className="flex items-center gap-2">
              <span className="max-w-[160px] truncate rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold">
                {user.full_name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign out
              </Button>
            </div>
          ) : !loading ? (
            <Link href="/login">
              <Button>Sign in</Button>
            </Link>
          ) : null}
        </div>

        <MobileMenu />
      </div>
    </nav>
  );
}
