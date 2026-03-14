import type { Block } from 'payload'

export const ServicesCardsBlock: Block = {
  slug: 'servicesCards',
  labels: { singular: 'Services Cards', plural: 'Services Cards Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'services',
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
          admin: { description: 'Icon name or emoji' },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL',
        },
      ],
    },
  ],
}
