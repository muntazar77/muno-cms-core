import type { Block } from 'payload'

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: { singular: 'Gallery', plural: 'Gallery Blocks' },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'images',
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
          name: 'caption',
          type: 'text',
        },
      ],
    },
  ],
}
