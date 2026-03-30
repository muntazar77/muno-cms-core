import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

interface AuthUser {
  id: string | number
  role?: string
  siteId?: string
}

async function getAuthUser(): Promise<AuthUser | null> {
  const payload = await getPayload({ config })
  const headerStore = await headers()
  const cookieHeader = headerStore.get('cookie') ?? ''
  const tokenMatch = cookieHeader.match(/payload-token=([^;]+)/)
  const token = tokenMatch?.[1]
  if (!token) return null

  try {
    const result = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
    return (result.user as AuthUser) ?? null
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const authUser = await getAuthUser()
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await getPayload({ config })
    const user = await payload.findByID({
      collection: 'users',
      id: String(authUser.id),
      depth: 1,
      overrideAccess: true,
    })

    const avatarValue = user.avatar as number | string | { id?: number | string; url?: string | null } | null
    const avatarId =
      avatarValue && typeof avatarValue === 'object' ? String(avatarValue.id ?? '') : String(avatarValue ?? '')
    const avatarUrl = avatarValue && typeof avatarValue === 'object' ? (avatarValue.url ?? null) : null

    return NextResponse.json({
      id: String(user.id),
      email: user.email,
      fullName: (user as { fullName?: string | null }).fullName ?? '',
      timezone: (user as { timezone?: string | null }).timezone ?? 'UTC',
      language: (user as { language?: string | null }).language ?? 'en',
      avatar: avatarId || null,
      avatarUrl,
      siteId: (user as { siteId?: string | null }).siteId ?? null,
      role: (user as { role?: string | null }).role ?? null,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load account profile' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const authUser = await getAuthUser()
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = (await request.json()) as {
      fullName?: string
      timezone?: string
      language?: string
      avatar?: string | null
    }

    const parsedAvatar =
      typeof body.avatar === 'string' && body.avatar.trim()
        ? Number.parseInt(body.avatar, 10)
        : body.avatar === null
          ? null
          : undefined

    const language: 'en' | 'ar' | undefined =
      body.language === 'en' || body.language === 'ar' ? body.language : undefined

    const payload = await getPayload({ config })

    const updated = await payload.update({
      collection: 'users',
      id: String(authUser.id),
      overrideAccess: true,
      data: {
        fullName: typeof body.fullName === 'string' ? body.fullName.trim() : undefined,
        timezone: typeof body.timezone === 'string' ? body.timezone.trim() : undefined,
        language,
        avatar: Number.isNaN(parsedAvatar as number) ? undefined : parsedAvatar,
      },
    })

    const avatarValue = updated.avatar as number | string | { id?: number | string; url?: string | null } | null
    const avatarId =
      avatarValue && typeof avatarValue === 'object'
        ? String(avatarValue.id ?? '')
        : String(avatarValue ?? '')
    const avatarUrl = avatarValue && typeof avatarValue === 'object' ? (avatarValue.url ?? null) : null

    return NextResponse.json({
      success: true,
      profile: {
        id: String(updated.id),
        email: updated.email,
        fullName: (updated as { fullName?: string | null }).fullName ?? '',
        timezone: (updated as { timezone?: string | null }).timezone ?? 'UTC',
        language: (updated as { language?: string | null }).language ?? 'en',
        avatar: avatarId || null,
        avatarUrl,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to update account profile' }, { status: 500 })
  }
}
