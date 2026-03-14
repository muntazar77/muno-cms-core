import type { Block } from 'payload'

export const HeroWithImageBlock: Block = {
  slug: 'heroWithImage',
  labels: { singular: 'Hero with Image', plural: 'Hero with Image Blocks' },
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
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'primaryCtaLabel',
      type: 'text',
      label: 'Primary CTA Label',
    },
    {
      name: 'primaryCtaLink',
      type: 'text',
      label: 'Primary CTA Link',
    },
    {
      name: 'secondaryCtaLabel',
      type: 'text',
      label: 'Secondary CTA Label',
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
}
