import type { Block } from 'payload'

export const ServicesBentoBlock: Block = {
  slug: 'servicesBento',
  labels: { singular: 'Services Bento', plural: 'Services Bento Blocks' },
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
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'CTA Label',
          admin: { width: '40%' },
        },
        {
          name: 'ctaLink',
          type: 'text',
          label: 'CTA Link',
          admin: { width: '60%' },
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Bento Items',
      minRows: 1,
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
          type: 'textarea',
        },
        {
          name: 'badge',
          type: 'text',
          label: 'Badge Text',
          admin: { description: 'e.g. "POPULAR", "NEW"' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ctaLabel',
              type: 'text',
              admin: { width: '45%' },
            },
            {
              name: 'ctaLink',
              type: 'text',
              admin: { width: '55%' },
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'isFeatured',
          type: 'checkbox',
          label: 'Featured (larger card)',
          defaultValue: false,
        },
        {
          name: 'theme',
          type: 'select',
          defaultValue: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ],
        },
        {
          name: 'iconStyle',
          type: 'select',
          defaultValue: 'primarySoft',
          options: [
            { label: 'Primary Soft', value: 'primarySoft' },
            { label: 'Secondary Soft', value: 'secondarySoft' },
            { label: 'Surface High', value: 'surfaceHigh' },
            { label: 'Dark Glass', value: 'darkGlass' },
          ],
        },
        {
          name: 'details',
          type: 'array',
          label: 'Detail items',
          fields: [
            {
              name: 'detail',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'tags',
          type: 'array',
          label: 'Tags',
          fields: [
            {
              name: 'tag',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
