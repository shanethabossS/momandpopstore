'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { momPopDepartments } from '@/lib/mompop';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/96 backdrop-blur-xl">
      <div className="flex h-7 items-center justify-between bg-black px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/65 lg:px-8">
        <span>SOV Digital / Marketplace</span>
        <span className="hidden sm:inline">Independent stores. Exceptional finds.</span>
      </div>
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 lg:px-8">
        <Link href="/" className="shrink-0 text-[1.25rem] font-black tracking-[-0.06em]">
          MOM<span className="text-black/28">&amp;</span>POP
        </Link>
        <form action="/stores" className="mx-auto hidden h-11 max-w-xl flex-1 items-center rounded-full border border-black/15 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition focus-within:border-black md:flex">
          <input name="q" aria-label="Search stores" placeholder="Search stores, products and services" className="min-w-0 flex-1 bg-transparent px-5 text-sm outline-none" />
          <button aria-label="Search" className="mr-1.5 grid size-8 place-items-center rounded-full bg-black text-white"><Search className="size-4" /></button>
        </form>
        <div className="ml-auto hidden items-center gap-1 text-sm font-semibold md:flex">
          <Link href="/stores" className="rounded-full px-3 py-2 hover:bg-black/5">Discover</Link>
          <Link href="/dashboard" className="rounded-full px-3 py-2 hover:bg-black/5">Merchant</Link>
          {!loading && user ? (
            <button onClick={logout} className="ml-1 rounded-full border border-black/15 px-4 py-2 hover:border-black">Sign out</button>
          ) : !loading ? (
            <Link href="/login" className="ml-1 rounded-full bg-black px-4 py-2 text-white transition hover:bg-[#ff385c]">Sign in</Link>
          ) : null}
        </div>
        <MobileMenu />
      </div>
      <div className="border-t border-black/8">
        <div className="mx-auto flex h-11 max-w-[1600px] items-center gap-6 overflow-x-auto px-4 text-xs font-bold uppercase tracking-[0.08em] [scrollbar-width:none] lg:px-8 [&::-webkit-scrollbar]:hidden">
          <Link href="/stores" className="shrink-0 text-[#ff385c]">All stores</Link>
          {momPopDepartments.slice(0, 12).map((department) => <Link key={department.label} href={department.href} className="shrink-0 text-black/58 transition hover:text-black">{department.label}</Link>)}
        </div>
      </div>
    </nav>
  );
}
