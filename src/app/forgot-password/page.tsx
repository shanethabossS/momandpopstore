'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json().catch(() => ({}))
      setMessage(response.ok ? data.message : data.error || 'Unable to request a reset link.')
    } catch {
      setMessage('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tight">Reset your password</h1>
          <p className="mt-2 text-sm text-muted-foreground">We will send a short-lived reset link if the account is active.</p>
        </div>
        {message && <div className="rounded-lg bg-muted px-4 py-3 text-sm font-medium">{message}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <Button type="submit" className="h-12 w-full" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</Button>
        </form>
        <p className="text-center text-sm"><Link href="/login" className="font-semibold text-primary hover:underline">Back to sign in</Link></p>
      </div>
    </div>
  )
}
