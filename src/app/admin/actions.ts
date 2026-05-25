'use server'

import { auth } from '@/auth'
import { isAdmin, moderateStorefront, moderateReview, logAdminAction } from '@/lib/db/admin'
import type { ModerationAction } from '@/lib/db/admin'
import { moderateSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')
  const admin = await isAdmin(session.user.id)
  if (!admin) throw new Error('Not authorized')
  return session.user.id
}

export async function moderateStorefrontAction(
  storefrontId: string,
  action: ModerationAction,
  reason?: string,
) {
  const adminId = await requireAdmin()

  const parsed = moderateSchema.safeParse({ action, reason })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  try {
    const storefront = await moderateStorefront(storefrontId, adminId, action, reason)
    revalidatePath('/admin')
    revalidatePath('/stores')
    revalidatePath(`/store/${storefront.slug}`)
    return { ok: true, storefront }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Moderation failed' }
  }
}

export async function moderateReviewAction(
  reviewId: string,
  status: 'approved' | 'rejected',
  reason?: string,
) {
  const adminId = await requireAdmin()

  try {
    const review = await moderateReview(reviewId, adminId, status, reason)
    revalidatePath('/admin')
    return { ok: true, review }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Review moderation failed' }
  }
}

export async function logAdminNote(
  storefrontId: string,
  note: string,
) {
  const adminId = await requireAdmin()

  try {
    await logAdminAction({
      adminId,
      storefrontId,
      action: 'note',
      reason: note,
    })
    revalidatePath('/admin')
    return { ok: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to add note' }
  }
}
