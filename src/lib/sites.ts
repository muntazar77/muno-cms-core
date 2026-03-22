import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

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
  headerNav?: unknown[] | null
  footerLinks?: unknown[] | null
  socialLinks?: unknown[] | null
}

function normalizeHost(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/:\d+$/, '')
}

function extractSubdomain(host: string): string | null {
  const normalized = normalizeHost(host)
  if (!normalized) return null
  if (normalized.endsWith('.localhost')) return normalized.replace('.localhost', '')

  const parts = normalized.split('.')
  return parts.length > 2 ? parts[0] : null
}

export function getSiteDomain(site: Pick<SiteLike, 'domain' | 'subdomain'>): string {
  if (site.domain) return site.domain
  if (site.subdomain) return `${site.subdomain}.localhost`
  return 'Unassigned domain'
}

export async function getCurrentSite(depth = 1): Promise<SiteLike | null> {
  const payload = await getPayload({ config })
  const headerStore = await headers()
  const rawHost = headerStore.get('x-forwarded-host') || headerStore.get('host') || ''
  const host = normalizeHost(rawHost)
  const subdomain = extractSubdomain(host)

  if (host) {
    const currentSite = await payload.find({
      collection: 'sites',
      depth,
      limit: 1,
      where: {
        or: [
          { domain: { equals: host } },
          ...(subdomain ? [{ subdomain: { equals: subdomain } }] : []),
        ],
      },
    })

    if (currentSite.docs[0]) {
      return currentSite.docs[0] as SiteLike
    }
  }

  const fallbackSite = await payload.find({
    collection: 'sites',
    depth,
    limit: 1,
    sort: '-updatedAt',
    where: {
      or: [{ status: { equals: 'active' } }, { status: { equals: 'maintenance' } }],
    },
  })

  return (fallbackSite.docs[0] as SiteLike | undefined) ?? null
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
