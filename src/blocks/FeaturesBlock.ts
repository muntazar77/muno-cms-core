import type { Block } from 'payload'

export const FeaturesBlock: Block = {
  slug: 'features',
  labels: { singular: 'Features', plural: 'Features Blocks' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: 'Cards', value: 'cards' },
        { label: 'List', value: 'list' },
        { label: 'Minimal', value: 'minimal' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'features',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Icon name or identifier',
          },
        },
      ],
    },
  ],
}
