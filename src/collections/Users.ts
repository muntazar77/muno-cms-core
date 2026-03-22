import type { CollectionConfig } from 'payload'
import { access } from '@/access'

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
        { label: 'Admin', value: 'admin' },
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
