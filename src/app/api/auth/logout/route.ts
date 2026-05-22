import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('auth_token', '', { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 0, path: '/' });
  res.cookies.set('auth_state', '', { httpOnly: false, secure: true, sameSite: 'lax', maxAge: 0, path: '/' });
  res.cookies.set('refresh_token', '', { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 0, path: '/' });
  return res;
}
