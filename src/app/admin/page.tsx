'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

type Stats = { storefronts: number; pending_storefronts: number; active_products: number; pending_reviews: number; new_leads: number };
type PendingStore = { id: string; name: string; location?: string; created_at?: string };

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [stores, setStores] = useState<PendingStore[]>([]);
  const [error, setError] = useState('');

  async function load() {
    const [statsResult, storesResult] = await Promise.all([
      apiFetch<{ stats: Stats }>('/api/mompop/admin/stats'),
      apiFetch<{ storefronts: PendingStore[] }>('/api/mompop/admin/storefronts?status=pending'),
    ]);
    if (statsResult.data) setStats(statsResult.data.stats);
    if (storesResult.data) setStores(storesResult.data.storefronts);
    setError(statsResult.error || storesResult.error || '');
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function decide(id: string, status: 'approved' | 'rejected') {
    const result = await apiFetch(`/api/mompop/admin/storefronts/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    if (result.error) return setError(result.error);
    await load();
  }

  return <main className="container mx-auto px-4 py-10"><h1 className="text-4xl font-black">Mom &amp; Pop administration</h1>{error ? <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-destructive">{error}</p> : null}<div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{stats ? Object.entries(stats).map(([key, value]) => <div key={key} className="rounded-xl border bg-card p-5"><p className="text-3xl font-black">{value}</p><p className="mt-1 text-xs uppercase text-muted-foreground">{key.replaceAll('_', ' ')}</p></div>) : null}</div><section className="mt-10"><h2 className="text-2xl font-black">Pending storefronts</h2><div className="mt-4 space-y-3">{stores.map((store) => <div key={store.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-5"><div><h3 className="font-bold">{store.name}</h3><p className="text-sm text-muted-foreground">{store.location}</p></div><div className="flex gap-2"><button onClick={() => decide(store.id, 'approved')} className="rounded-md bg-primary px-4 py-2 font-bold text-primary-foreground">Approve</button><button onClick={() => decide(store.id, 'rejected')} className="rounded-md border px-4 py-2 font-bold">Reject</button></div></div>)}</div></section></main>;
}
