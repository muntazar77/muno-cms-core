import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'
import type { Page } from '@/payload-types'
import { getCurrentSite } from '@/lib/sites'

/**
 * Fetch a published page by slug from Payload CMS.
 * Caching is handled at route level via `export const revalidate = 60`.
 * Avoids caching null results so newly-published pages appear immediately.
 */
export async function getPage(slug: string, overrideSiteId?: string): Promise<Page | null> {
  const payload = await getPayload({ config })
  const siteId = overrideSiteId ?? (await getCurrentSite(0))?.siteId
  const normalizedSlug = slug.replace(/^\/+/, '')
  const where: Where = {
    and: [
      { status: { equals: 'published' } },
      { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] },
      {
        or: [{ slug: { equals: normalizedSlug } }, { slug: { equals: `/${normalizedSlug}` } }],
      },
      ...(siteId ? [{ siteId: { equals: siteId } }] : []),
    ],
  }
  const result = await payload.find({
    collection: 'pages',
    where,
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ?? null
}

/**
 * Get all published page slugs for static generation.
 */
export async function getAllPageSlugs(): Promise<string[]> {
  const payload = await getPayload({ config })
  const currentSite = await getCurrentSite(0)
  const result = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { status: { equals: 'published' } },
        { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] },
        ...(currentSite?.siteId ? [{ siteId: { equals: currentSite.siteId } }] : []),
      ],
    },
    limit: 1000,
    depth: 0,
    select: { slug: true },
  })
  return result.docs
    .map((doc) => (typeof doc.slug === 'string' ? doc.slug.replace(/^\/+/, '') : null))
    .filter((slug): slug is string => Boolean(slug))
}
