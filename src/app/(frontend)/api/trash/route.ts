/**
 * Trash API Route
 *
 * GET  /api/trash       — Fetch all soft-deleted items across all collections
 * POST /api/trash       — Restore or permanently delete items
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
}

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)

    const filterCollection = searchParams.get('collection')
    const search = searchParams.get('search')
    const page = Math.max(1, Number(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') || '50')))

    const collections = filterCollection
      ? SOFT_DELETE_COLLECTIONS.filter((c) => c === filterCollection)
      : [...SOFT_DELETE_COLLECTIONS]

    const allItems: TrashItem[] = []

    for (const slug of collections) {
      try {
        const where: Where = {
          isDeleted: { equals: true },
        }

        if (search) {
          if (slug === 'media') {
            where['alt'] = { contains: search }
          } else if (slug === 'form-submissions') {
            // form-submissions don't have a title field — skip text search
          } else {
            where['title'] = { contains: search }
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
    const payload = await getPayload({ config })
    const body = await request.json()

    const { action } = body as { action: string }

    if (action === 'restore') {
      const { collection, id } = body as { collection: string; id: string }
      await payload.update({
        collection: collection as 'pages',
        id,
        data: { isDeleted: false, deletedAt: null, deletedBy: null } as Record<string, unknown>,
      })
      return NextResponse.json({ success: true, message: 'Item restored' })
    }

    if (action === 'delete') {
      const { collection, id } = body as { collection: string; id: string }
      await payload.delete({
        collection: collection as 'pages',
        id,
      })
      return NextResponse.json({ success: true, message: 'Item permanently deleted' })
    }

    if (action === 'bulk-restore') {
      const { items } = body as { items: Array<{ collection: string; id: string }> }
      for (const item of items) {
        await payload.update({
          collection: item.collection as 'pages',
          id: item.id,
          data: { isDeleted: false, deletedAt: null, deletedBy: null } as Record<string, unknown>,
        })
      }
      return NextResponse.json({ success: true, message: `${items.length} items restored` })
    }

    if (action === 'bulk-delete') {
      const { items } = body as { items: Array<{ collection: string; id: string }> }
      for (const item of items) {
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
