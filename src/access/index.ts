/**
 * Centralized Access Control
 *
 * Two roles:
 *   - super-admin → full access to everything
 *   - client      → can only access data that belongs to their siteId
 *
 * Usage in collections:
 *   import { access } from '@/access'
 *   access: {
 *     read: access.siteScoped,
 *     create: access.authenticated,
 *     update: access.siteScoped,
 *     delete: access.softDeleteOnly,
 *   }
 */

import type { Access, FieldAccess, Where } from 'payload'

// ─── Helpers ─────────────────────────────────────────────────────────

interface UserWithRole {
  id: string
  role?: string
  siteId?: string
}

function getUser(req: { user?: unknown }): UserWithRole | null {
  return (req.user as UserWithRole) ?? null
}

function isAdmin(user: UserWithRole | null): boolean {
  return user?.role === 'super-admin'
}

function notDeletedConstraint(): Where {
  return {
    or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }],
  }
}

// ─── Collection-Level Access ─────────────────────────────────────────

/** Anyone (public) */
const anyone: Access = () => true

/** Authenticated users only */
const authenticated: Access = ({ req }) => Boolean(getUser(req))

/** Admin only */
const adminOnly: Access = ({ req }) => {
  const user = getUser(req)
  return isAdmin(user)
}

/** Admin only, excluding soft-deleted docs */
const adminOnlyNotDeleted: Access = ({ req }) => {
  const user = getUser(req)
  if (!isAdmin(user)) return false
  return notDeletedConstraint()
}

/**
 * Admin → full access (excluding deleted)
 * Client → only items matching their siteId (excluding deleted)
 * Anonymous → no access
 */
const siteScoped: Access = ({ req }) => {
  const user = getUser(req)
  if (!user) return false
  if (isAdmin(user)) return notDeletedConstraint()
  if (!user.siteId) return false
  return {
    and: [{ siteId: { equals: user.siteId } }, notDeletedConstraint()],
  }
}

/**
 * Public read OR site-scoped:
 * Admin → all (excluding deleted)
 * Client → own site only (excluding deleted)
 * Anonymous → only published items (excluding deleted)
 */
const publicOrSiteScoped: Access = ({ req }) => {
  const user = getUser(req)
  if (!user) {
    const where: Where = {
      and: [{ status: { equals: 'published' } }, notDeletedConstraint()],
    }
    return where
  }
  if (isAdmin(user)) return notDeletedConstraint()
  if (!user.siteId) return false
  const where: Where = {
    and: [{ siteId: { equals: user.siteId } }, notDeletedConstraint()],
  }
  return where
}

/**
 * Public read with site scope (no status check):
 * Admin → all (excluding deleted)
 * Client → own site only (excluding deleted)
 * Anonymous → all (public, excluding deleted)
 */
const publicReadSiteScoped: Access = ({ req }) => {
  const user = getUser(req)
  if (!user) return notDeletedConstraint()
  if (isAdmin(user)) return notDeletedConstraint()
  if (!user.siteId) return false
  return {
    and: [{ siteId: { equals: user.siteId } }, notDeletedConstraint()],
  }
}

/**
 * Permanent delete access for soft-deletable collections.
 * Only super-admins can permanently delete, and only items already in trash.
 */
const softDeleteOnly: Access = ({ req }) => {
  const user = getUser(req)
  if (!user) return false
  if (isAdmin(user)) return { isDeleted: { equals: true } } as Where
  return false
}

/**
 * Permanent delete for site-scoped content.
 * Super-admin → can permanently delete items in trash
 * Client → can permanently delete their own trashed items
 */
const softDeleteSiteScoped: Access = ({ req }) => {
  const user = getUser(req)
  if (!user) return false
  if (isAdmin(user)) return { isDeleted: { equals: true } } as Where
  if (!user.siteId) return false
  const where: Where = {
    and: [{ siteId: { equals: user.siteId } }, { isDeleted: { equals: true } }],
  }
  return where
}

// ─── Field-Level Access ──────────────────────────────────────────────

/** Only admins can update this field */
const adminFieldUpdate: FieldAccess = ({ req }) => {
  const user = getUser(req)
  return isAdmin(user)
}

// ─── Sites Access ────────────────────────────────────────────────────

/**
 * Super-admin → all non-deleted sites
 * Client → only sites matching their siteId
 * Anonymous → no access
 */
const siteOwnerOrAdmin: Access = ({ req }) => {
  const user = getUser(req)
  if (!user) return false
  if (isAdmin(user)) return notDeletedConstraint()
  if (!user.siteId) return false
  return {
    and: [{ siteId: { equals: user.siteId } }, notDeletedConstraint()],
  }
}

// ─── Globals Access ──────────────────────────────────────────────────

/** Read global: anyone. Update global: admin only. */
const globalReadPublic: Access = () => true
const globalUpdateAdmin: Access = ({ req }) => {
  const user = getUser(req)
  return isAdmin(user)
}

// ─── Exports ─────────────────────────────────────────────────────────

export const access = {
  anyone,
  authenticated,
  adminOnly,
  adminOnlyNotDeleted,
  siteScoped,
  siteOwnerOrAdmin,
  publicOrSiteScoped,
  publicReadSiteScoped,
  softDeleteOnly,
  softDeleteSiteScoped,
  adminFieldUpdate,
  globalReadPublic,
  globalUpdateAdmin,
}

export type { UserWithRole }
