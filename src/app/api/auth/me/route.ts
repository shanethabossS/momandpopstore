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
  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const upstream = await fetch(`${CENTRAL_API}/api/auth/me`, {
      method: 'GET',
      // Bearer is what the DEPLOYED middleware reads — it takes the token from the
      // Authorization header only. Forwarding the cookie alone was byte-identical to
      // sending no credentials at all ("No token provided"), so a signed-in visitor
      // always came back as null and the whole signed-in side of the app stayed dark.
      // The cookie goes too, so this keeps working against the newer middleware that
      // reads it, which is staged but not released.
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `auth_token=${token}`,
      },
      cache: 'no-store',
    });

    const raw = await upstream.text();
    let data: Record<string, unknown> = {};
    try { data = raw ? JSON.parse(raw) : {}; } catch { data = { error: raw || upstream.statusText }; }

    if (upstream.status === 401) return NextResponse.json({ user: null });
    return NextResponse.json(data, {
      status: upstream.status,
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Auth service unavailable' }, { status: 503 });
  }
}
