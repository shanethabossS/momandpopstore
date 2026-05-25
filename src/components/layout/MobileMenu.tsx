'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:text-foreground"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 border-b border-border bg-background shadow-lg">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
            <Link href="/stores" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted">
              Browse stores
            </Link>
            <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted">
              Merchant dashboard
            </Link>

            <div className="my-2 border-t border-border" />

            {!loading && user ? (
              <div className="flex flex-col gap-2 px-3">
                <span className="truncate text-xs font-semibold text-muted-foreground">
                  {user.name || user.email}
                </span>
                <Button variant="outline" size="sm" onClick={() => { setOpen(false); logout(); }}>
                  Sign out
                </Button>
              </div>
            ) : !loading ? (
              <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-bold text-primary-foreground transition hover:bg-primary/90">
                Sign in
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
