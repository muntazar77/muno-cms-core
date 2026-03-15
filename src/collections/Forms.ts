import type { CollectionConfig } from 'payload'

export const Forms: CollectionConfig = {
  slug: 'forms',
  trash: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'createdAt'],
    components: {
      views: {
        list: {
          Component: '/components/admin/CustomListView',
        },
      },
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => {
      const u = user as { role?: string } | null
      return u?.role === 'admin'
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'fields',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Field', plural: 'Fields' },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Machine-friendly field name (e.g. "first_name")',
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Email', value: 'email' },
            { label: 'Textarea', value: 'textarea' },
            { label: 'Select', value: 'select' },
            { label: 'File Upload', value: 'file' },
          ],
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'options',
          type: 'array',
          label: 'Select Options',
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'select',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'confirmationMessage',
      type: 'textarea',
      label: 'Confirmation Message',
      defaultValue: 'Thank you for your submission.',
    },
  ],
}
