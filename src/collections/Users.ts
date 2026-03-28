import type {
  CollectionConfig,
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
} from 'payload'
import { access } from '@/access'
import { APIError } from 'payload'
import { softDeleteFields, softDeleteHooks } from '@/utilities/softDelete'

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

/**
 * Prevent deletion of super-admin users.
 * Client users can be deleted normally.
 */
const preventSuperAdminDelete: CollectionBeforeDeleteHook = async ({ req, id }) => {
  const user = await req.payload.findByID({
    collection: 'users',
    id,
    depth: 0,
    req,
  })
  if (!user) return

  const role = (user as unknown as Record<string, unknown>).role
  if (role === 'super-admin') {
    throw new APIError('Super-admin users cannot be deleted.', 403)
  }
}

/**
 * Prevent deletion of users who are assigned as owners of one or more sites.
 * The user must be unassigned from all sites before they can be deleted.
 */
const preventDeleteIfHasSites: CollectionBeforeDeleteHook = async ({ req, id }) => {
  const sites = await req.payload.find({
    collection: 'sites',
    depth: 0,
    limit: 1,
    where: {
      and: [
        { owner: { equals: id } },
        { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] },
      ],
    },
    req,
  })

  if (sites.totalDocs > 0) {
    throw new APIError(
      'This user is assigned as the owner of one or more sites. Remove them as owner before deleting.',
      400,
    )
  }
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
    beforeDelete: [preventSuperAdminDelete, preventDeleteIfHasSites, ...softDeleteHooks.beforeDelete],
  },
  access: {
    read: access.adminOnlyNotDeleted,
    create: access.adminOnly,
    update: access.authenticated,
    delete: access.softDeleteOnly,
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
    ...softDeleteFields,
  ],
}
