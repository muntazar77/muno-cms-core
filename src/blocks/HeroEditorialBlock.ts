import type { Block } from 'payload'

export const HeroEditorialBlock: Block = {
  slug: 'heroEditorial',
  labels: { singular: 'Hero Editorial', plural: 'Hero Editorial Blocks' },
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
      name: 'highlightedWord',
      type: 'text',
      label: 'Highlighted Word',
      admin: {
        description: 'Highlighted emphasis word shown inline in heading.',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'badgeLabel',
      type: 'text',
      label: 'Top Badge Label',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'primaryCtaLabel',
          type: 'text',
          label: 'Primary CTA Label',
          admin: { width: '50%' },
        },
        {
          name: 'primaryCtaLink',
          type: 'text',
          label: 'Primary CTA Link',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'secondaryCtaLabel',
          type: 'text',
          label: 'Secondary CTA Label',
          admin: { width: '50%' },
        },
        {
          name: 'secondaryCtaLink',
          type: 'text',
          label: 'Secondary CTA Link',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Statistics',
      maxRows: 4,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "98%", "15K+"' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'blue',
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
            { label: 'Purple', value: 'purple' },
            { label: 'Amber', value: 'amber' },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Main Image',
    },
    {
      name: 'sideImages',
      type: 'array',
      label: 'Side Images',
      maxRows: 2,
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
    {
      name: 'topOverlayCard',
      type: 'group',
      label: 'Top Right Overlay Card',
      fields: [
        {
          name: 'cardLabel',
          type: 'text',
          label: 'Card Label',
        },
        {
          name: 'cardText',
          type: 'text',
          label: 'Card Text',
        },
      ],
    },
    {
      name: 'bottomOverlayCard',
      type: 'group',
      label: 'Bottom Left Overlay Card',
      fields: [
        {
          name: 'cardLabel',
          type: 'text',
        },
        {
          name: 'itemTitle',
          type: 'text',
        },
        {
          name: 'itemDescription',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'featureHighlights',
      type: 'array',
      label: 'Feature Highlights (Right Dark Card)',
      maxRows: 4,
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
  ],
}
