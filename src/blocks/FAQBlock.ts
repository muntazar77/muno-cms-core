import type { Block } from 'payload'

export const FAQBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQ Blocks' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'accordion',
      options: [
        { label: 'Accordion', value: 'accordion' },
        { label: 'Grid', value: 'grid' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
