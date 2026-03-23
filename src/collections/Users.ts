import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'
import { access } from '@/access'
import { APIError } from 'payload'

/**
 * Prevent self-demotion: a super-admin cannot remove their own super-admin role.
 * Also ensures at least one super-admin always exists.
 */
const preventSelfDemotion: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (operation !== 'update') return data
  if (!data || !req.user) return data

  const currentUser = req.user as { id: number | string; role?: string }

  // Only check if role is being changed
  if (data.role === undefined || data.role === originalDoc?.role) return data

  // Prevent any user from demoting themselves
  if (String(originalDoc?.id) === String(currentUser.id) && data.role !== 'super-admin') {
    throw new APIError('You cannot remove your own super-admin role.', 400)
  }

  // If demoting another super-admin, ensure at least one remains
  if (originalDoc?.role === 'super-admin' && data.role !== 'super-admin') {
    const superAdminCount = await req.payload.count({
      collection: 'users',
      where: { role: { equals: 'super-admin' } },
    })
    if (superAdminCount.totalDocs <= 1) {
      throw new APIError('Cannot demote the last super-admin. Promote another user first.', 400)
    }
  }

  return data
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'siteId', 'createdAt', 'updatedAt'],
    components: {
      views: {
        list: {
          Component: '/components/admin/CustomListView',
        },
      },
    },
  },
  auth: true,
  hooks: {
    beforeChange: [preventSelfDemotion],
  },
  access: {
    read: access.anyone,
    create: access.adminOnly,
    update: access.authenticated,
    delete: access.adminOnly,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Client', value: 'client' },
      ],
      defaultValue: 'client',
      required: true,
      saveToJWT: true,
      access: {
        update: access.adminFieldUpdate,
      },
    },
    {
      name: 'siteId',
      type: 'text',
      index: true,
      saveToJWT: true,
      admin: {
        position: 'sidebar',
        description: 'The site this user belongs to.',
      },
      access: {
        update: access.adminFieldUpdate,
      },
    },
  ],
}
