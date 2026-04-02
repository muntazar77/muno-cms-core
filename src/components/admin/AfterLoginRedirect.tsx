'use client'

import { useEffect, useState } from 'react'
import { useAuth, useConfig } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

export default function AfterLoginRedirect() {
  const { user } = useAuth()
  const { config } = useConfig()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (!user || redirecting) return

    const role = 'role' in user ? String((user as { role?: string }).role ?? '') : ''
    const siteId = 'siteId' in user ? String((user as { siteId?: string }).siteId ?? '') : ''

    if (role === 'super-admin' || !siteId) return

    // Client user: resolve their site doc ID and redirect
    setRedirecting(true)
    const apiRoute = (config?.routes?.api as string | undefined) ?? '/api'

    fetch(`${apiRoute}/sites?where[siteId][equals]=${encodeURIComponent(siteId)}&limit=1&depth=0`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        const doc = data?.docs?.[0]
        if (doc?.id) {
          router.replace(`/admin/collections/sites/${doc.id}/dashboard`)
        }
      })
      .catch(() => {})
      .finally(() => setRedirecting(false))
  }, [user, config?.routes?.api, router, redirecting])

  if (!redirecting) return null

  return (
    <div className="fixed inset-0 z-120 grid place-items-center bg-white/75 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-2xl border border-(--cms-border) bg-(--cms-card-bg) px-5 py-3 shadow-lg">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--cms-primary) border-t-transparent" />
        <p className="text-sm font-medium text-(--cms-text)">Preparing your workspace…</p>
      </div>
    </div>
  )
}
