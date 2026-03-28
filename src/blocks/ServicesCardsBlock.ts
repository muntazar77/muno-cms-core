import type { Block } from 'payload'

export const ServicesCardsBlock: Block = {
  slug: 'servicesCards',
  labels: { singular: 'Services Cards', plural: 'Services Cards Blocks' },
  fields: [
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Manual — define services inline', value: 'manual' },
        { label: 'Dynamic — pull from Services collection', value: 'dynamic' },
      ],
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: 'Cards', value: 'cards' },
        { label: 'List', value: 'list' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 12,
      min: 1,
      max: 50,
      admin: {
        description: 'Max services to display in dynamic mode.',
        condition: (_, siblingData) => siblingData?.mode === 'dynamic',
      },
    },
    {
      name: 'services',
      type: 'array',
      minRows: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.mode !== 'dynamic',
      },
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
