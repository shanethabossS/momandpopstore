import { NextRequest, NextResponse } from 'next/server';

const apiBase = (process.env.API_SERVER_URL || 'https://api.sovdigitalgroup.com').replace(/\/$/, '');

export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  if (token) {
    await fetch(`${apiBase}/api/auth/logout`, {
      method: 'POST',
      // Bearer, not the cookie alone: the deployed middleware reads the Authorization
      // header only, so a cookie-only logout never revoked anything upstream — the local
      // cookies cleared and the central session stayed alive.
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `auth_token=${token}`,
      },
      cache: 'no-store',
    }).catch(() => null);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('auth_token', '', { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 0, path: '/' });
  res.cookies.set('auth_state', '', { httpOnly: false, secure: true, sameSite: 'lax', maxAge: 0, path: '/' });
  res.cookies.set('refresh_token', '', { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 0, path: '/' });
  return res;
}
