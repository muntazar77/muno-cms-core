import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'gradient',
      options: [
        { label: 'Gradient', value: 'gradient' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Split', value: 'split' },
      ],
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
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Button Label',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'CTA Button Link',
    },
  ],
}
