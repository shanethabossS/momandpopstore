import { NextRequest, NextResponse } from 'next/server';
import { rateCheck, clientIp } from '@/lib/auth-rate-limit';

const FALLBACK_API_BASE = 'https://api.sovdigitalgroup.com';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

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

export async function POST(req: NextRequest) {
  const { allowed, retryAfter } = rateCheck(clientIp(req), 'register');
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter ?? 900) } },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });

  try {
    const upstream = await fetch(`${CENTRAL_API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const raw = await upstream.text();
    let data: Record<string, unknown> = {};
    try { data = raw ? JSON.parse(raw) : {}; } catch { data = { error: raw || upstream.statusText }; }

    if (!upstream.ok) return NextResponse.json(data, { status: upstream.status });

    const res = NextResponse.json(data, { status: upstream.status });

    if (typeof data.token === 'string' && data.token) {
      res.cookies.set('auth_token', data.token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: COOKIE_MAX_AGE, path: '/' });
      res.cookies.set('auth_state', '1', { httpOnly: false, secure: true, sameSite: 'lax', maxAge: COOKIE_MAX_AGE, path: '/' });
      if (typeof data.refresh_token === 'string' && data.refresh_token) {
        res.cookies.set('refresh_token', data.refresh_token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: COOKIE_MAX_AGE * 4, path: '/' });
      }
    }

    return res;
  } catch {
    return NextResponse.json({ error: 'Auth service unavailable' }, { status: 503 });
  }
}
