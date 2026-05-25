'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { moderateStorefrontAction } from './actions'
import type { ModerationAction } from '@/lib/db/admin'

type QueueStorefront = {
  id: string
  name: string
  slug: string
  status: string
  verifiedTier: string
  isFeatured: boolean
  location: string | null
  categoryName: string | null
  ownerName: string | null
  ownerEmail: string | null
  productCount: number
  createdAt: string
}

export function ModerationQueue({
  storefronts: initial,
  totalPending,
}: {
  storefronts: QueueStorefront[]
  totalPending: number
}) {
  const [storefronts, setStorefronts] = useState(initial)
  const [isPending, startTransition] = useTransition()
  const [reasonInputId, setReasonInputId] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [feedback, setFeedback] = useState<Record<string, { message: string; type: 'success' | 'error' }>>({})

  function handleAction(storefrontId: string, action: ModerationAction) {
    if ((action === 'reject' || action === 'disable') && reasonInputId !== storefrontId) {
      setReasonInputId(storefrontId)
      setReason('')
      return
    }

    startTransition(async () => {
      const result = await moderateStorefrontAction(storefrontId, action, reason || undefined)

      if (result.error) {
        setFeedback((prev) => ({
          ...prev,
          [storefrontId]: { message: result.error!, type: 'error' },
        }))
      } else {
        setFeedback((prev) => ({
          ...prev,
          [storefrontId]: {
            message: `Storefront ${action}${action.endsWith('e') ? 'd' : 'ed'} successfully`,
            type: 'success',
          },
        }))

        if (action === 'approve' || action === 'reject' || action === 'disable') {
          setStorefronts((prev) => prev.filter((s) => s.id !== storefrontId))
        }
      }

      setReasonInputId(null)
      setReason('')
    })
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Merchant verification queue</CardTitle>
          {totalPending > 0 && (
            <Badge className="bg-amber-100 text-amber-800">{totalPending} pending</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {storefronts.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No storefronts pending review.
          </div>
        ) : (
          storefronts.map((store) => (
            <div
              key={store.id}
              className="rounded-lg border border-border p-4 space-y-3"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold">{store.name}</h2>
                    <Badge variant={store.verifiedTier === 'tier2' ? 'default' : 'outline'}>
                      {store.verifiedTier === 'tier2' ? 'Tier 2' : 'Tier 1'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{store.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {store.categoryName || 'Uncategorized'} / {store.location || 'No location'} / {store.productCount} products
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Owner: {store.ownerName || store.ownerEmail || 'Unknown'} &middot; Submitted {new Date(store.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAction(store.id, 'approve')}
                    disabled={isPending}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(store.id, 'reject')}
                    disabled={isPending}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(store.id, 'feature')}
                    disabled={isPending}
                  >
                    Feature
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive"
                    onClick={() => handleAction(store.id, 'disable')}
                    disabled={isPending}
                  >
                    Disable
                  </Button>
                </div>
              </div>

              {reasonInputId === store.id && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Reason for rejection/disable (optional)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      const action = store.status === 'approved' ? 'disable' : 'reject'
                      handleAction(store.id, action as ModerationAction)
                    }}
                    disabled={isPending}
                  >
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReasonInputId(null)
                      setReason('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {feedback[store.id] && (
                <div
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    feedback[store.id].type === 'success'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {feedback[store.id].message}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
