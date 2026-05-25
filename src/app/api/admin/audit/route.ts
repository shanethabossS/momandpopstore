import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isAdmin, getAdminActions } from '@/lib/db/admin'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const admin = await isAdmin(session.user.id)
  if (!admin) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const storefrontId = searchParams.get('storefrontId') || undefined
  const action = searchParams.get('action') || undefined

  const result = await getAdminActions({ page, storefrontId, action })
  return NextResponse.json(result)
}
