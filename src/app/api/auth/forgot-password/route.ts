import { NextRequest, NextResponse } from 'next/server';
import { clientIp, rateCheck } from '@/lib/auth-rate-limit';

const apiBase = (process.env.API_SERVER_URL || 'https://api.sovdigitalgroup.com').replace(/\/$/, '');

export async function POST(req: NextRequest) {
  const { allowed, retryAfter } = rateCheck(clientIp(req), 'forgot-password');
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter ?? 900) } },
    );
  }

  const body = await req.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  if (!email || email.length > 320) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });

  const upstream = await fetch(`${apiBase}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, site: 'mompop' }),
    cache: 'no-store',
  }).catch(() => null);

  if (!upstream) return NextResponse.json({ error: 'Auth service unavailable' }, { status: 503 });
  return NextResponse.json(
    { message: 'If an active account matches that email, a reset link will be sent.' },
    { status: upstream.status },
  );
}
