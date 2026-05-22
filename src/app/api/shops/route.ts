import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_API_BASE = 'https://api.sovdigitalgroup.com';

function getApiBase(): string {
  const raw = String(process.env.API_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/$/, '');
  if (!raw) return FALLBACK_API_BASE;
  try {
    const parsed = new URL(raw);
    if (process.env.NODE_ENV === 'production' && (/^(localhost|127\.0\.0\.1)$/i.test(parsed.hostname) || parsed.protocol !== 'https:')) {
      return FALLBACK_API_BASE;
    }
  } catch {
    return FALLBACK_API_BASE;
  }
  return raw;
}

const CENTRAL_API = getApiBase();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const endpoint = id ? `/api/shop868/shops/${id}` : '/api/shop868/shops';

  try {
    const upstream = await fetch(`${CENTRAL_API}${endpoint}`, { cache: 'no-store' });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  try {
    const upstream = await fetch(`${CENTRAL_API}/api/shop868/shops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
