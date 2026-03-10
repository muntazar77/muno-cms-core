import type { Block } from 'payload'

export const FormBlock: Block = {
  slug: 'form',
  labels: { singular: 'Form', plural: 'Form Blocks' },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
