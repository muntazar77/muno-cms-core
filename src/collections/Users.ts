import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  trash: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'createdAt', 'updatedAt'],
    components: {
      views: {
        list: {
          Component: '/components/admin/CustomListView',
        },
      },
    },
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) => {
          const u = user as { role?: string } | null
          return u?.role === 'admin'
        },
      },
    },
  ],
}
