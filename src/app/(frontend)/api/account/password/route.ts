import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

interface AuthUser {
  id: string | number
  email?: string
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

export async function PATCH(request: Request) {
  try {
    const authUser = await getAuthUser()
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { currentPassword, newPassword, confirmPassword } = (await request.json()) as {
      currentPassword?: string
      newPassword?: string
      confirmPassword?: string
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'All password fields are required.' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters.' },
        { status: 400 },
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Password confirmation does not match.' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const user = await payload.findByID({
      collection: 'users',
      id: String(authUser.id),
      depth: 0,
      overrideAccess: true,
    })

    await payload.login({
      collection: 'users',
      data: {
        email: user.email,
        password: currentPassword,
      },
    })

    await payload.update({
      collection: 'users',
      id: String(authUser.id),
      overrideAccess: true,
      data: {
        password: newPassword,
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
  }
}
