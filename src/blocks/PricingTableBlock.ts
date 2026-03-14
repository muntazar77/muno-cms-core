import type { Block } from 'payload'

export const PricingTableBlock: Block = {
  slug: 'pricingTable',
  labels: { singular: 'Pricing Table', plural: 'Pricing Table Blocks' },
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
      name: 'plans',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "$29/mo" or "Free"' },
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'features',
          type: 'textarea',
          admin: { description: 'One feature per line' },
        },
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Button Label',
          defaultValue: 'Get Started',
        },
        {
          name: 'ctaLink',
          type: 'text',
          label: 'Button Link',
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          defaultValue: false,
          label: 'Highlight this plan',
        },
      ],
    },
  ],
}
