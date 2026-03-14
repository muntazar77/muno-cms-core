import type { Block } from 'payload'

export const LogoCloudBlock: Block = {
  slug: 'logoCloud',
  labels: { singular: 'Logo Cloud', plural: 'Logo Cloud Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'logos',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          label: 'Company Name',
        },
      ],
    },
  ],
}
