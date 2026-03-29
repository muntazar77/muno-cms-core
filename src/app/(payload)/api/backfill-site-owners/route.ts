import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers as nextHeaders } from 'next/headers'

/**
 * POST /api/backfill-site-owners
 *
 * One-time utility: for every non-deleted site that has an owner set,
 * ensures the owner's user.siteId matches site.siteId.
 *
 * Run once after deploying the syncOwnerSiteId hook to fix existing data.
 * Requires an active super-admin session (cookie auth).
 *
 * Example:
 *   curl -X POST https://your-cms.com/api/backfill-site-owners \
 *     -H "Cookie: payload-token=..."
 */
export async function POST() {
  const payload = await getPayload({ config: configPromise })

  // Authenticate via the incoming request cookies
  const headersList = await nextHeaders()
  const { user } = await payload.auth({ headers: headersList })

  if (!user || (user as unknown as { role?: string }).role !== 'super-admin') {
    return Response.json({ error: 'Unauthorized — super-admin required.' }, { status: 401 })
  }

  // Fetch all non-deleted sites that have an owner assigned
  const sites = await payload.find({
    collection: 'sites',
    where: {
      and: [
        { owner: { exists: true } },
        { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] },
      ],
    },
    depth: 0,
    limit: 0, // return all
    pagination: false,
  })

  let updated = 0
  const errors: string[] = []

  for (const rawSite of sites.docs) {
    const site = rawSite as unknown as {
      id: number
      siteId?: string
      siteName?: string
      owner?: number | { id: number }
    }

    const ownerId =
      typeof site.owner === 'object' && site.owner !== null ? site.owner.id : site.owner
    const siteSlug = site.siteId ?? ''

    if (!ownerId || !siteSlug) continue

    try {
      const ownerUser = await payload.findByID({
        collection: 'users',
        id: ownerId,
        depth: 0,
      })

      const currentSiteId = (ownerUser as unknown as { siteId?: string }).siteId ?? ''

      if (currentSiteId !== siteSlug) {
        await payload.update({
          collection: 'users',
          id: ownerId,
          data: { siteId: siteSlug },
          context: { skipOwnerSync: true },
        })
        updated++
      }
    } catch (err) {
      errors.push(
        `site "${site.siteName ?? site.id}": ${err instanceof Error ? err.message : String(err)}`,
      )
    }
  }

  return Response.json({
    ok: true,
    scanned: sites.totalDocs,
    updated,
    ...(errors.length > 0 && { errors }),
  })
}
