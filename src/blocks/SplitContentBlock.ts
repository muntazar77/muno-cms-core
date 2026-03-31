import type { Block } from 'payload'

export const SplitContentBlock: Block = {
  slug: 'splitContent',
  labels: { singular: 'Split Content', plural: 'Split Content Blocks' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow Text',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'brand',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Brand (Dark)', value: 'brand' },
      ],
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'calloutText',
      type: 'textarea',
      label: 'Callout Card Text',
    },
    {
      name: 'showSkewAccent',
      type: 'checkbox',
      label: 'Show right skew accent',
      defaultValue: true,
    },
    {
      name: 'features',
      type: 'array',
      label: 'Feature List',
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'text',
          admin: { description: 'Emoji or icon name' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      maxRows: 4,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
  ],
}
