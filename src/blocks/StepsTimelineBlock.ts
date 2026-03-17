import type { Block } from 'payload'

export const StepsTimelineBlock: Block = {
  slug: 'stepsTimeline',
  labels: { singular: 'Steps Timeline', plural: 'Steps Timeline Blocks' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'timeline',
      options: [
        { label: 'Timeline', value: 'timeline' },
        { label: 'Cards', value: 'cards' },
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
      name: 'steps',
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
      ],
    },
  ],
}
