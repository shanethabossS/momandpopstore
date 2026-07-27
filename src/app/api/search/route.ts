import { NextRequest, NextResponse } from 'next/server';

const apiBase = (process.env.API_SERVER_URL || 'https://api.sovdigitalgroup.com').replace(/\/$/, '');

export async function GET(req: NextRequest) {
  const upstream = await fetch(`${apiBase}/api/mompop/search?${req.nextUrl.searchParams}`, { next: { revalidate: 60 } }).catch(() => null);
  if (!upstream) return NextResponse.json({ error: 'Marketplace service unavailable' }, { status: 503 });
  return new NextResponse(await upstream.arrayBuffer(), { status: upstream.status, headers: { 'content-type': upstream.headers.get('content-type') || 'application/json' } });
}
