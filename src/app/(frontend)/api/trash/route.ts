/**
 * Trash API Route
 *
 * GET  /api/trash       — Fetch soft-deleted items (role-scoped)
 * POST /api/trash       — Restore or permanently delete items
 *
 * Role scoping:
 *   super-admin → sees all trash across all collections/sites
 *   client      → sees only trash belonging to their siteId
 *
 * Query params (GET):
 *   ?collection=pages   — Filter by collection slug
 *   ?search=keyword     — Search by title/name/alt
 *   ?page=1&limit=20    — Pagination
 *
 * Body (POST):
 *   { action: 'restore' | 'delete', collection: string, id: string }
 *   { action: 'bulk-restore' | 'bulk-delete', items: Array<{ collection: string, id: string }> }
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'
import { SOFT_DELETE_COLLECTIONS } from '@/utilities/softDelete'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

interface TrashItem {
  id: string
  collection: string
  collectionLabel: string
  title: string
  deletedAt: string | null
  deletedBy: string | null
  deletedByEmail?: string
  siteId: string | null
  createdAt: string
}

interface AuthenticatedUser {
  id: string | number
  role?: string
  siteId?: string
  email?: string
}

function getTitle(doc: Record<string, unknown>, collectionSlug: string): string {
  if (collectionSlug === 'media') {
    return (doc.alt as string) || (doc.filename as string) || String(doc.id)
  }
  return (doc.title as string) || (doc.name as string) || (doc.email as string) || String(doc.id)
}

const COLLECTION_LABELS: Record<string, string> = {
  pages: 'Page',
  media: 'Media',
  forms: 'Form',
  'form-submissions': 'Submission',
  services: 'Service',
  sites: 'Site',
}

/** Authenticate the request and return the user, or null */
async function getAuthUser(): Promise<AuthenticatedUser | null> {
  const payload = await getPayload({ config })
  const headerStore = await headers()

  // Try to extract the JWT from the cookie
  const cookieHeader = headerStore.get('cookie') ?? ''
  const tokenMatch = cookieHeader.match(/payload-token=([^;]+)/)
  const token = tokenMatch?.[1]
  if (!token) return null

  try {
    const result = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
    return (result.user as AuthenticatedUser) ?? null
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isSuperAdmin = user.role === 'super-admin'
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)

    const filterCollection = searchParams.get('collection')
    const search = searchParams.get('search')
    const page = Math.max(1, Number(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') || '50')))

    // Determine which collections to query
    let collections = filterCollection
      ? SOFT_DELETE_COLLECTIONS.filter((c) => c === filterCollection)
      : [...SOFT_DELETE_COLLECTIONS]

    // Clients should not see sites in their trash (they don't manage sites)
    if (!isSuperAdmin) {
      collections = collections.filter((c) => c !== 'sites') as typeof collections
    }

    const allItems: TrashItem[] = []

    for (const slug of collections) {
      try {
        const where: Where = {
          and: [
            { isDeleted: { equals: true } },
            // Client: only see their own site's trash
            ...(!isSuperAdmin && user.siteId
              ? [{ siteId: { equals: user.siteId } }]
              : []),
          ],
        }

        if (search) {
          if (slug === 'media') {
            ;(where.and as Where[]).push({ alt: { contains: search } })
          } else if (slug !== 'form-submissions') {
            ;(where.and as Where[]).push({ title: { contains: search } })
          }
        }

        const result = await payload.find({
          collection: slug,
          where,
          limit: 200,
          sort: '-deletedAt',
          depth: 1,
        })

        for (const doc of result.docs) {
          const d = doc as unknown as Record<string, unknown>
          const deletedByUser = d.deletedBy as Record<string, unknown> | null

          allItems.push({
            id: String(d.id),
            collection: slug,
            collectionLabel: COLLECTION_LABELS[slug] || slug,
            title: getTitle(d, slug),
            deletedAt: (d.deletedAt as string) || null,
            deletedBy: deletedByUser?.id ? String(deletedByUser.id) : null,
            deletedByEmail: deletedByUser?.email ? String(deletedByUser.email) : undefined,
            siteId: (d.siteId as string) || null,
            createdAt: (d.createdAt as string) || '',
          })
        }
      } catch {
        // Collection might not exist yet — skip
      }
    }

    // Sort all items by deletedAt descending
    allItems.sort((a, b) => {
      const da = a.deletedAt ? new Date(a.deletedAt).getTime() : 0
      const db = b.deletedAt ? new Date(b.deletedAt).getTime() : 0
      return db - da
    })

    // Paginate
    const totalDocs = allItems.length
    const totalPages = Math.ceil(totalDocs / limit)
    const startIdx = (page - 1) * limit
    const docs = allItems.slice(startIdx, startIdx + limit)

    return NextResponse.json({
      docs,
      totalDocs,
      totalPages,
      page,
      limit,
    })
  } catch (error) {
    console.error('Trash GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch trash items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const body = await request.json()
    const { action } = body as { action: string }

    // Validate collection slug is in our allow list
    const validCollections = new Set<string>(SOFT_DELETE_COLLECTIONS)

    if (action === 'restore') {
      const { collection, id } = body as { collection: string; id: string }
      if (!validCollections.has(collection)) {
        return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
      }
      await payload.update({
        collection: collection as 'pages',
        id,
        data: { isDeleted: false, deletedAt: null, deletedBy: null } as Record<string, unknown>,
      })
      return NextResponse.json({ success: true, message: 'Item restored' })
    }

    if (action === 'delete') {
      if (user.role !== 'super-admin') {
        return NextResponse.json({ error: 'Only super-admins can permanently delete' }, { status: 403 })
      }
      const { collection, id } = body as { collection: string; id: string }
      if (!validCollections.has(collection)) {
        return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
      }
      await payload.delete({
        collection: collection as 'pages',
        id,
      })
      return NextResponse.json({ success: true, message: 'Item permanently deleted' })
    }

    if (action === 'bulk-restore') {
      const { items } = body as { items: Array<{ collection: string; id: string }> }
      for (const item of items) {
        if (!validCollections.has(item.collection)) continue
        await payload.update({
          collection: item.collection as 'pages',
          id: item.id,
          data: { isDeleted: false, deletedAt: null, deletedBy: null } as Record<string, unknown>,
        })
      }
      return NextResponse.json({ success: true, message: `${items.length} items restored` })
    }

    if (action === 'bulk-delete') {
      if (user.role !== 'super-admin') {
        return NextResponse.json({ error: 'Only super-admins can permanently delete' }, { status: 403 })
      }
      const { items } = body as { items: Array<{ collection: string; id: string }> }
      for (const item of items) {
        if (!validCollections.has(item.collection)) continue
        await payload.delete({
          collection: item.collection as 'pages',
          id: item.id,
        })
      }
      return NextResponse.json({
        success: true,
        message: `${items.length} items permanently deleted`,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Trash POST error:', error)
    return NextResponse.json({ error: 'Failed to process trash action' }, { status: 500 })
  }
}
