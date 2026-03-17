import type { Block } from 'payload'

export const StatisticsBlock: Block = {
  slug: 'statistics',
  labels: { singular: 'Statistics', plural: 'Statistics Blocks' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Dark', value: 'dark' },
        { label: 'Light', value: 'light' },
        { label: 'Branded', value: 'branded' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "99%", "10k+", "$2M"' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
