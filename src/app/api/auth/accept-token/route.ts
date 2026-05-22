import { NextRequest, NextResponse } from 'next/server';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const token = body?.token;

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Token required' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('auth_token', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: COOKIE_MAX_AGE, path: '/' });
  res.cookies.set('auth_state', '1', { httpOnly: false, secure: true, sameSite: 'lax', maxAge: COOKIE_MAX_AGE, path: '/' });
  return res;
}
