'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)
  const [message, setMessage] = useState('')

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: params.token, password }),
      })
      const data = await response.json().catch(() => ({}))
      setMessage(response.ok ? data.message : data.error || 'Unable to reset password.')
      setComplete(response.ok)
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
          <h1 className="text-2xl font-black tracking-tight">Choose a new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">Use at least eight characters.</p>
        </div>
        {message && <div className="rounded-lg bg-muted px-4 py-3 text-sm font-medium">{message}</div>}
        {!complete && (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="password">New password</Label><Input id="password" type="password" minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="confirm-password">Confirm password</Label><Input id="confirm-password" type="password" minLength={8} maxLength={128} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></div>
            <Button type="submit" className="h-12 w-full" disabled={loading}>{loading ? 'Updating...' : 'Update password'}</Button>
          </form>
        )}
        <p className="text-center text-sm"><Link href="/login" className="font-semibold text-primary hover:underline">Return to sign in</Link></p>
      </div>
    </div>
  )
}
