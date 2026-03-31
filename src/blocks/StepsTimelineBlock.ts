import type { Block } from 'payload'

export const StepsTimelineBlock: Block = {
  slug: 'stepsTimeline',
  labels: { singular: 'Steps Timeline', plural: 'Steps Timeline Blocks' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Alt', value: 'alt' },
        { label: 'Timeline', value: 'timeline' },
        { label: 'Cards', value: 'cards' },
      ],
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow Text',
    },
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Legacy Subheading',
      admin: {
        description: 'Legacy field kept for older content. Use Section Description for new pages.',
      },
    },
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'stepLabel',
              type: 'text',
              label: 'Step Label',
              admin: {
                width: '30%',
              },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                width: '45%',
              },
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon',
              admin: {
                width: '25%',
                description: 'Optional emoji or icon label for the step badge.',
              },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'numberOverride',
              type: 'text',
              label: 'Number / Badge Text',
              admin: {
                width: '50%',
                description: 'Optional label shown instead of the auto step number.',
              },
            },
            {
              name: 'isHighlighted',
              type: 'checkbox',
              label: 'Highlighted Step',
              defaultValue: false,
              admin: {
                width: '50%',
              },
            },
          ],
        },
      ],
    },
  ],
}
