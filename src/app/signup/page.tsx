'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';

const FALLBACK_API = 'https://api.sovdigitalgroup.com';

function getGoogleOAuthUrl(nextPath: string) {
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/$/, '') || FALLBACK_API;
  const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/login?from=google` : '';
  return `${apiBase}/api/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}&next=${encodeURIComponent(nextPath)}`;
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, refresh } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const nextPath = useMemo(() => {
    const raw = searchParams.get('next');
    return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/onboarding';
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && user) router.replace(nextPath);
  }, [authLoading, user, nextPath, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Registration failed');
        return;
      }

      await refresh();
      router.replace(nextPath);
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return null;

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-primary text-lg font-black text-primary-foreground">
            M&P
          </div>
          <h1 className="text-2xl font-black tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join Mom &amp; Pop Store — discover local T&amp;T businesses.
          </p>
        </div>

        {message && (
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" placeholder="John Mohammed" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@business.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone / WhatsApp</Label>
            <Input id="phone" type="tel" placeholder="1-868-XXX-XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>
          <Button type="submit" className="h-12 w-full text-base" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
        </div>

        <a href={getGoogleOAuthUrl(nextPath)}>
          <Button type="button" className="h-12 w-full text-base" variant="outline">
            <svg className="mr-2 size-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>
        </a>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
