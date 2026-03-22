import { getPayload } from 'payload'
import config from '@payload-config'
import type { Page } from '@/payload-types'

/**
 * Fetch a published page by slug from Payload CMS.
 * Caching is handled at route level via `export const revalidate = 60`.
 * Avoids caching null results so newly-published pages appear immediately.
 */
export async function getPage(slug: string): Promise<Page | null> {
  const payload = await getPayload({ config })
  const normalizedSlug = slug.replace(/^\/+/, '')
  const result = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { status: { equals: 'published' } },
        { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] },
        {
          or: [{ slug: { equals: normalizedSlug } }, { slug: { equals: `/${normalizedSlug}` } }],
        },
      ],
    },
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
  const result = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { status: { equals: 'published' } },
        { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] },
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
