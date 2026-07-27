import { NextRequest, NextResponse } from 'next/server';
import { clientIp, rateCheck } from '@/lib/auth-rate-limit';

const apiBase = (process.env.API_SERVER_URL || 'https://api.sovdigitalgroup.com').replace(/\/$/, '');

export async function POST(req: NextRequest) {
  const { allowed, retryAfter } = rateCheck(clientIp(req), 'reset-password');
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter ?? 900) } },
    );
  }

  const body = await req.json().catch(() => null);
  const token = typeof body?.token === 'string' ? body.token.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!/^[a-f0-9]{64}$/i.test(token) || password.length < 8 || password.length > 128) {
    return NextResponse.json({ error: 'Invalid or expired reset request' }, { status: 400 });
  }

  const upstream = await fetch(`${apiBase}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
    cache: 'no-store',
  }).catch(() => null);
  if (!upstream) return NextResponse.json({ error: 'Auth service unavailable' }, { status: 503 });

  const data = await upstream.json().catch(() => ({ error: 'Unable to reset password' }));
  return NextResponse.json(data, { status: upstream.status });
}
