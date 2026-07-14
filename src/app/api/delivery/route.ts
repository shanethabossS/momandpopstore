import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/db/admin'
import { createShop868DeliveryRequest } from '@/lib/delivery'
import { deliveryRequestSchema } from '@/lib/validations'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!(await isAdmin(session.user.id))) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  const parsed = deliveryRequestSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'Invalid delivery request' }, { status: 400 })

  try {
    const delivery = await createShop868DeliveryRequest(parsed.data)
    return NextResponse.json(delivery, { status: delivery.duplicate ? 200 : 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Delivery integration is not configured') {
      return NextResponse.json({ error: 'Delivery integration is unavailable' }, { status: 503 })
    }
    return NextResponse.json({ error: 'Unable to create delivery request' }, { status: 502 })
  }
}
