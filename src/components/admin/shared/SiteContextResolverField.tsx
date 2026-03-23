'use client'

import { useEffect } from 'react'
import type { UIFieldClientComponent } from 'payload'
import { useField } from '@payloadcms/ui'
import { useSearchParams } from 'next/navigation'

function readStoredSiteId(): string {
  if (typeof window === 'undefined') return ''
  return window.sessionStorage.getItem('active-site-id') ?? ''
}

const SiteContextResolverField: UIFieldClientComponent = () => {
  const searchParams = useSearchParams()
  const { value, setValue } = useField<string>({ path: 'siteId' })

  useEffect(() => {
    const fromQuery = searchParams?.get('siteId')?.trim() ?? ''
    const fromStorage = readStoredSiteId().trim()
    const nextSiteId = fromQuery || fromStorage

    if (!nextSiteId) return
    if (value === nextSiteId) return

    setValue(nextSiteId)
  }, [searchParams, setValue, value])

  return null
}

export default SiteContextResolverField
