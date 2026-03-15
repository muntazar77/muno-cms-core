import type { CollectionConfig } from 'payload'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  trash: true,
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['form', 'createdAt'],
    components: {
      views: {
        list: {
          Component: '/components/admin/CustomListView',
        },
      },
    },
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true, // Public can submit forms
    update: ({ req: { user } }) => {
      const u = user as { role?: string } | null
      return u?.role === 'admin'
    },
    delete: ({ req: { user } }) => {
      const u = user as { role?: string } | null
      return u?.role === 'admin'
    },
  },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'data',
      type: 'json',
      required: true,
      admin: {
        description: 'Submitted form data',
      },
    },
  ],
}
