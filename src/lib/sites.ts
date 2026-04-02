import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  extractPathModeSiteSlug,
  extractSubdomainFromHost,
  isPlatformHost,
  normalizeHost,
} from '@/lib/routing'

interface SiteLike {
  id: number | string
  siteId?: string | null
  siteName?: string | null
  domain?: string | null
  subdomain?: string | null
  status?: string | null
  allowIndexing?: boolean | null
  primaryColor?: string | null
  secondaryColor?: string | null
  fontFamily?: string | null
  logo?: unknown
  ctaLabel?: string | null
  ctaUrl?: string | null
  showSiteTitle?: boolean | null
  showLanguageSwitcher?: boolean | null
  showThemeToggle?: boolean | null
  stickyHeader?: boolean | null
  defaultMetaTitle?: string | null
  defaultMetaDescription?: string | null
  siteDescription?: string | null
  publicEmail?: string | null
  phone?: string | null
  footerTagline?: string | null
  footerNote?: string | null
  copyrightText?: string | null
  footerShowCtaBanner?: boolean | null
  footerCtaHeading?: string | null
  footerCtaDescription?: string | null
  footerCtaButtonLabel?: string | null
  footerCtaButtonUrl?: string | null
  headerNav?: unknown[] | null
  footerLinks?: unknown[] | null
  socialLinks?: unknown[] | null
}

export function getSiteDomain(site: Pick<SiteLike, 'domain' | 'subdomain'>): string {
  if (site.domain) return site.domain
  if (site.subdomain) return `${site.subdomain}.localhost`
  return 'Unassigned domain'
}

function publicSiteStatusConstraint() {
  return {
    and: [
      { or: [{ status: { equals: 'active' } }, { status: { equals: 'maintenance' } }] },
      { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] },
    ],
  }
}

export async function resolveSiteByHost(host: string, depth = 1): Promise<SiteLike | null> {
  const normalizedHost = normalizeHost(host)
  if (!normalizedHost || isPlatformHost(normalizedHost)) return null

  const payload = await getPayload({ config })
  const subdomain = extractSubdomainFromHost(normalizedHost)

  const result = await payload.find({
    collection: 'sites',
    depth,
    limit: 1,
    where: {
      and: [
        publicSiteStatusConstraint(),
        {
          or: [
            { domain: { equals: normalizedHost } },
            ...(subdomain ? [{ subdomain: { equals: subdomain } }] : []),
          ],
        },
      ],
    },
  })

  return (result.docs[0] as SiteLike | undefined) ?? null
}

export async function resolveSiteBySiteSlug(siteSlug: string, depth = 1): Promise<SiteLike | null> {
  const normalizedSlug = siteSlug.trim().toLowerCase()
  if (!normalizedSlug) return null

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'sites',
    depth,
    limit: 1,
    where: {
      and: [
        publicSiteStatusConstraint(),
        {
          siteId: { equals: normalizedSlug },
        },
      ],
    },
  })

  return (result.docs[0] as SiteLike | undefined) ?? null
}

export async function getCurrentSite(depth = 1): Promise<SiteLike | null> {
  const headerStore = await headers()
  const pathname = headerStore.get('x-pathname') || headerStore.get('next-url') || ''
  const pathSiteSlug = pathname ? extractPathModeSiteSlug(pathname) : null

  if (pathSiteSlug) {
    return resolveSiteBySiteSlug(pathSiteSlug, depth)
  }

  const rawHost = headerStore.get('x-forwarded-host') || headerStore.get('host') || ''
  return resolveSiteByHost(rawHost, depth)
}

export async function getSiteBySiteId(siteId: string, depth = 1): Promise<SiteLike | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'sites',
    depth,
    limit: 1,
    where: {
      siteId: { equals: siteId },
    },
  })

  return (result.docs[0] as SiteLike | undefined) ?? null
}
