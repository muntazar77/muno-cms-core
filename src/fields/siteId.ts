/**
 * Shared site-scoping field.
 * Added to every content collection so data can be isolated per-site.
 */

import type { Field } from 'payload'

function getSiteIdFromReferer(req: unknown): string | undefined {
  try {
    const headers =
      req && typeof req === 'object' && 'headers' in req
        ? (req as { headers?: Headers | Record<string, string> }).headers
        : undefined

    if (!headers) return undefined

    const referer =
      typeof (headers as Headers).get === 'function'
        ? (headers as Headers).get('referer')
        : (headers as Record<string, string>).referer

    if (!referer) return undefined

    const url = new URL(referer)
    const candidate = url.searchParams.get('siteId')?.trim()
    return candidate || undefined
  } catch {
    return undefined
  }
}

export const siteIdField: Field = {
  name: 'siteId',
  type: 'text',
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Site context is assigned automatically in normal workflows.',
    condition: (data, _siblingData, { user }) => {
      const role = user && typeof user === 'object' && 'role' in user ? String(user.role ?? '') : ''

      if (role !== 'super-admin') return false

      // Expose only for admin edge-case edits, not during first create step.
      return Boolean(data && typeof data === 'object' && 'id' in data && data.id)
    },
  },
  hooks: {
    beforeValidate: [
      ({ value, req }) => {
        const requestedSiteId =
          typeof req?.query?.siteId === 'string'
            ? req.query.siteId
            : Array.isArray(req?.query?.siteId)
              ? req.query.siteId[0]
              : undefined
        const refererSiteId = getSiteIdFromReferer(req)

        if (!value && requestedSiteId) {
          return requestedSiteId
        }

        if (!value && refererSiteId) {
          return refererSiteId
        }

        // For client users, keep assigned site as fallback.
        // Avoid forcing admin fallback (e.g. default-site) when explicit context is missing.
        if (!value && req.user) {
          const user = req.user as { role?: string; siteId?: string }
          if (user.role !== 'super-admin') {
            return user.siteId ?? value
          }
        }
        return value
      },
    ],
  },
}
