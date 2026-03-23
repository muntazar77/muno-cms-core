/**
 * Shared site-scoping field.
 * Added to every content collection so data can be isolated per-site.
 */

import type { Field } from 'payload'

export const siteIdField: Field = {
  name: 'siteId',
  type: 'text',
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Site context is assigned automatically in normal workflows.',
    condition: (data, _siblingData, { user }) => {
      const role =
        user && typeof user === 'object' && 'role' in user ? String(user.role ?? '') : ''

      if (role !== 'admin') return false

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

        if (!value && requestedSiteId) {
          return requestedSiteId
        }

        // Auto-populate from the current user if not set
        if (!value && req.user) {
          const user = req.user as { siteId?: string }
          return user.siteId ?? value
        }
        return value
      },
    ],
  },
}
