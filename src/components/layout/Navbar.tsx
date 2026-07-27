'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { momPopDepartments } from '@/lib/mompop';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 lg:px-8">
        <Link href="/" className="shrink-0 text-[1.25rem] font-black tracking-[-0.06em]">
          MOM<span className="text-brand">&amp;</span>POP
        </Link>
        <form action="/stores" className="mx-auto hidden h-11 max-w-xl flex-1 items-center rounded-full border border-border bg-card shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition focus-within:border-brand md:flex">
          <input name="q" aria-label="Search stores" placeholder="Search stores, products and services" className="min-w-0 flex-1 bg-transparent px-5 text-sm outline-none" />
          <button aria-label="Search" className="mkt-btn-brand mr-1.5 grid size-8 place-items-center rounded-full"><Search className="size-4" /></button>
        </form>
        <div className="ml-auto hidden items-center gap-1 text-sm font-semibold md:flex">
          <Link href="/stores" className="rounded-full px-3 py-2 hover:bg-muted">Discover</Link>
          <Link href="/dashboard" className="rounded-full px-3 py-2 hover:bg-muted">Merchant</Link>
          {!loading && user ? (
            <button onClick={logout} className="ml-1 rounded-full border border-border px-4 py-2 hover:border-foreground">Sign out</button>
          ) : !loading ? (
            <Link href="/login" className="ml-1 rounded-full bg-foreground px-4 py-2 text-background transition hover:bg-brand hover:text-brand-contrast">Sign in</Link>
          ) : null}
          <ThemeToggle className="ml-1" />
        </div>
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex h-11 max-w-[1600px] items-center gap-6 overflow-x-auto px-4 text-xs font-bold uppercase tracking-[0.08em] [scrollbar-width:none] lg:px-8 [&::-webkit-scrollbar]:hidden">
          <Link href="/stores" className="shrink-0 text-brand">All stores</Link>
          {momPopDepartments.slice(0, 12).map((department) => <Link key={department.label} href={department.href} className="shrink-0 text-muted-foreground transition hover:text-foreground">{department.label}</Link>)}
        </div>
      </div>
    </nav>
  );
}
