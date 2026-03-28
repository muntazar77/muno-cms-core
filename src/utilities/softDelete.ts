/**
 * Soft Delete Utilities
 *
 * Provides reusable fields, hooks, and helpers for soft-delete across all collections.
 * Instead of removing documents from DB, sets `isDeleted = true` + metadata.
 *
 * Usage in collection config:
 *   import { softDeleteFields, softDeleteHooks, excludeDeleted } from '@/utilities/softDelete'
 *   fields: [...softDeleteFields, ...otherFields]
 *   hooks: softDeleteHooks
 */

import type {
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
  Field,
  Where,
} from 'payload'

// ─── Fields ──────────────────────────────────────────────────────────

export const softDeleteFields: Field[] = [
  {
    name: 'isDeleted',
    type: 'checkbox',
    defaultValue: false,
    admin: {
      position: 'sidebar',
      readOnly: true,
      hidden: true,
    },
    index: true,
  },
  {
    name: 'deletedAt',
    type: 'date',
    admin: {
      position: 'sidebar',
      readOnly: true,
      hidden: true,
      date: {
        pickerAppearance: 'dayAndTime',
      },
    },
  },
  {
    name: 'deletedBy',
    type: 'relationship',
    relationTo: 'users',
    admin: {
      position: 'sidebar',
      readOnly: true,
      hidden: true,
    },
  },
]

// ─── Hooks ───────────────────────────────────────────────────────────

/**
 * Before change: if isDeleted transitions to true, stamp deletedAt + deletedBy.
 * If restored (isDeleted → false), clear deletedAt + deletedBy.
 */
const beforeChangeSoftDelete: CollectionBeforeChangeHook = ({ data, req, originalDoc }) => {
  if (!data) return data

  // Document being soft-deleted
  if (data.isDeleted === true && originalDoc?.isDeleted !== true) {
    data.deletedAt = new Date().toISOString()
    data.deletedBy = req.user?.id ?? null
  }

  // Document being restored
  if (data.isDeleted === false && originalDoc?.isDeleted === true) {
    data.deletedAt = null
    data.deletedBy = null
  }

  return data
}

/**
 * Before delete: intercept hard deletes.
 * If the item is NOT already soft-deleted, soft-delete it and cancel the hard delete.
 * Only items already in trash (isDeleted=true) can be permanently deleted.
 */
const beforeDeleteSoftDelete: CollectionBeforeDeleteHook = async ({ req, id, collection }) => {
  const collectionSlug = collection.slug

  const doc = await req.payload.findByID({
    collection: collectionSlug as 'pages',
    id,
    depth: 0,
    req,
  })

  if (!doc) return

  const isAlreadyDeleted = (doc as unknown as Record<string, unknown>).isDeleted === true

  if (!isAlreadyDeleted) {
    // Soft-delete instead of hard-delete
    await req.payload.update({
      collection: collectionSlug as 'pages',
      id,
      data: { isDeleted: true } as Record<string, unknown>,
      req,
    })
    const { APIError } = await import('payload')
    throw new APIError('Item moved to trash. Use Trash to permanently delete.', 200)
  }
  // If already soft-deleted, allow the permanent hard delete to proceed
}

export const softDeleteHooks = {
  beforeChange: [beforeChangeSoftDelete],
  beforeDelete: [beforeDeleteSoftDelete],
}

// ─── Query Helpers ───────────────────────────────────────────────────

/** Where clause that excludes soft-deleted items */
export const excludeDeletedWhere: Where = {
  or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }],
}

/** Merge an existing access result with the "exclude deleted" filter */
export function excludeDeleted(accessResult: boolean | Where): boolean | Where {
  // If access denied entirely, keep denied
  if (accessResult === false) return false

  // If full access, just exclude deleted
  if (accessResult === true) {
    return excludeDeletedWhere
  }

  // Merge with existing query constraint
  return {
    and: [accessResult, excludeDeletedWhere],
  }
}

// ─── Soft Delete Collections List ────────────────────────────────────

/**
 * All collection slugs that support soft delete.
 * Used by the global Trash view to query across collections.
 */
export const SOFT_DELETE_COLLECTIONS = [
  'pages',
  'media',
  'forms',
  'form-submissions',
  'services',
  'sites',
] as const

export type SoftDeleteCollection = (typeof SOFT_DELETE_COLLECTIONS)[number]
