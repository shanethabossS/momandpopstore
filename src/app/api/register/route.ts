import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import { rateCheck, clientIp } from '@/lib/auth-rate-limit'

export async function POST(req: NextRequest) {
  const { allowed, retryAfter } = rateCheck(clientIp(req), 'register')
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter ?? 900) } },
    )
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { name, email, phone, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
  }

  const apiBase = process.env.API_SERVER_URL || 'https://api.sovdigitalgroup.com'
  const upstreamRes = await fetch(`${apiBase}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name: name, email, phone, password }),
  }).catch(() => null)

  if (!upstreamRes || !upstreamRes.ok) {
    const errData = upstreamRes ? await upstreamRes.json().catch(() => ({})) : {}
    return NextResponse.json(
      { error: (errData as Record<string, string>).error || 'Registration failed' },
      { status: upstreamRes?.status || 503 },
    )
  }

  await prisma.user.create({
    data: { name, email, phone },
  })

  return NextResponse.json({ ok: true })
}
