import { NextRequest, NextResponse } from 'next/server';

const apiBase = (process.env.API_SERVER_URL || 'https://api.sovdigitalgroup.com').replace(/\/$/, '');

export async function GET(req: NextRequest) {
  // This used to be `next: { revalidate: 60 }`, which put every search response
  // in the Next Data Cache. The cache key includes the query string, so each
  // distinct search became its own entry and each entry was rewritten every
  // 60s - an unbounded number of cache writes driven by whatever anyone (or
  // any crawler) typed. That is what produced the 24 Sep - 27 Sep ISR-write
  // spike: ~73k writes from this one route in four days.
  //
  // Search results are still worth caching, but on the CDN, which is keyed by
  // URL and costs a CDN request instead of a durable cache write. Repeated
  // identical searches are served at the edge without invoking this function
  // at all, so this is also strictly cheaper on CPU than it was.
  const upstream = await fetch(`${apiBase}/api/mompop/search?${req.nextUrl.searchParams}`, {
    cache: 'no-store',
  }).catch(() => null);

  if (!upstream) return NextResponse.json({ error: 'Marketplace service unavailable' }, { status: 503 });

  const headers: Record<string, string> = {
    'content-type': upstream.headers.get('content-type') || 'application/json',
  };

  // Only cache successful results. An error must never be pinned at the edge.
  if (upstream.ok) {
    headers['cache-control'] = 'public, s-maxage=60, stale-while-revalidate=300';
  } else {
    headers['cache-control'] = 'no-store';
  }

  return new NextResponse(await upstream.arrayBuffer(), { status: upstream.status, headers });
}
