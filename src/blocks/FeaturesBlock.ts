import type { Block } from 'payload'

export const FeaturesBlock: Block = {
  slug: 'features',
  labels: { singular: 'Features Block', plural: 'Features Blocks' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          defaultValue: '3',
          options: [
            { label: '2 Columns', value: '2' },
            { label: '3 Columns', value: '3' },
            { label: '4 Columns', value: '4' },
          ],
        },
        {
          name: 'backgroundStyle',
          type: 'select',
          defaultValue: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Muted', value: 'muted' },
            { label: 'Dark', value: 'dark' },
          ],
        },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      admin: {
        placeholder: 'e.g. Why choose us?',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Section Subheading',
    },
    {
      name: 'features',
      type: 'array',
      minRows: 1,
      labels: {
        singular: 'Feature',
        plural: 'Features',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'check',
          options: [
            { label: 'Check Circle', value: 'check' },
            { label: 'Lightning', value: 'lightning' },
            { label: 'Shield', value: 'shield' },
            { label: 'Star', value: 'star' },
            { label: 'Heart', value: 'heart' },
            { label: 'Users', value: 'users' },
            { label: 'Settings', value: 'settings' },
            { label: 'Globe', value: 'globe' },
            { label: 'Book', value: 'book' },
          ],
          admin: {
            description: 'Select an icon to display with this feature.',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g. Blazing Fast Speed',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            placeholder: 'e.g. Your website will load in under a second.',
          },
        },
      ],
    },
  ],
}
