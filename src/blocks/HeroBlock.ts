import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'centered',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Split Left', value: 'split-left' },
        { label: 'Split Right', value: 'split-right' },
      ],
      admin: {
        description: 'Choose the layout style for the hero section.',
      },
    },
    {
      name: 'backgroundStyle',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Subtle Pattern', value: 'pattern' },
        { label: 'Gradient', value: 'gradient' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'e.g. Build faster with our modern CMS',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      admin: {
        placeholder: 'e.g. Empower your team to build faster and deliver better results.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Image displayed alongside or below the hero text based on layout.',
      },
    },
    {
      name: 'primaryCTA',
      type: 'group',
      label: 'Primary Call to Action',
      fields: [
        { name: 'label', type: 'text', label: 'Button Label' },
        { name: 'url', type: 'text', label: 'URL' },
      ],
    },
    {
      name: 'secondaryCTA',
      type: 'group',
      label: 'Secondary Call to Action',
      fields: [
        { name: 'label', type: 'text', label: 'Button Label' },
        { name: 'url', type: 'text', label: 'URL' },
      ],
    },
  ],
}
