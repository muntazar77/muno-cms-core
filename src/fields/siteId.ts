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
    description: 'Site identifier this item belongs to.',
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
