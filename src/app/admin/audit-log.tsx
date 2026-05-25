'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type AuditAction = {
  id: string
  action: string
  reason: string | null
  adminName: string
  storefrontName: string | null
  createdAt: string
}

const ACTION_COLORS: Record<string, string> = {
  approve: 'bg-emerald-100 text-emerald-800',
  reject: 'bg-red-100 text-red-800',
  disable: 'bg-red-100 text-red-800',
  feature: 'bg-amber-100 text-amber-800',
  unfeature: 'bg-gray-100 text-gray-800',
  review_approved: 'bg-emerald-100 text-emerald-800',
  review_rejected: 'bg-red-100 text-red-800',
  note: 'bg-blue-100 text-blue-800',
}

function formatAction(action: string): string {
  return action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(date).toLocaleDateString()
}

export function AuditLog({ actions }: { actions: AuditAction[] }) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Recent admin actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No admin actions recorded yet.
          </div>
        ) : (
          actions.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 rounded-lg border border-border px-3 py-2.5"
            >
              <Badge className={`shrink-0 text-xs ${ACTION_COLORS[entry.action] || 'bg-gray-100 text-gray-800'}`}>
                {formatAction(entry.action)}
              </Badge>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{entry.adminName}</span>
                  {entry.storefrontName && (
                    <span className="text-muted-foreground">
                      {' '}&rarr; {entry.storefrontName}
                    </span>
                  )}
                </p>
                {entry.reason && (
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">{entry.reason}</p>
                )}
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {timeAgo(entry.createdAt)}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
