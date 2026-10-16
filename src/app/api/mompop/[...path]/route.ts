import { NextRequest, NextResponse } from 'next/server';

const apiBase = (process.env.API_SERVER_URL || 'https://api.sovdigitalgroup.com').replace(/\/$/, '');

async function forward(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const url = new URL(`${apiBase}/api/mompop/${path.map(encodeURIComponent).join('/')}`);
  req.nextUrl.searchParams.forEach((value, key) => url.searchParams.append(key, value));
  const headers = new Headers();
  const contentType = req.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  const token = req.cookies.get('auth_token')?.value;
  if (token) {
    // Bearer is what the DEPLOYED middleware reads — it takes the token from the
    // Authorization header only, and a cookie-only request is byte-identical to one with
    // no credentials ("No token provided"). Every authenticated action on this site went
    // through here, so onboarding, storefront creation, products, the dashboard, reviews,
    // subscriptions and checkout all 401'd. The cookie is sent as well so this keeps
    // working against the newer middleware that reads it, which is staged but not released.
    headers.set('authorization', `Bearer ${token}`);
    headers.set('cookie', `auth_token=${token}`);
  }
  const upstream = await fetch(url, {
    method: req.method,
    headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.arrayBuffer(),
    cache: 'no-store',
  }).catch(() => null);
  if (!upstream) return NextResponse.json({ error: 'Marketplace service unavailable' }, { status: 503 });
  return new NextResponse(await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') || 'application/json', 'cache-control': 'private, no-store' },
  });
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
