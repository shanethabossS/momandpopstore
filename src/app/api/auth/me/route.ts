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
  const token = req.cookies.get('auth_token')?.value;
  const fallbackHeader = req.headers.get('authorization');
  const authHeader = token ? `Bearer ${token}` : fallbackHeader;

  if (!authHeader) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const upstream = await fetch(`${CENTRAL_API}/api/auth/me`, {
      method: 'GET',
      headers: { Authorization: authHeader },
      cache: 'no-store',
    });

    const raw = await upstream.text();
    let data: Record<string, unknown> = {};
    try { data = raw ? JSON.parse(raw) : {}; } catch { data = { error: raw || upstream.statusText }; }

    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: 'Auth service unavailable' }, { status: 503 });
  }
}
