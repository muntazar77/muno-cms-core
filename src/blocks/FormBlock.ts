import type { Block } from 'payload'

export const FormBlock: Block = {
  slug: 'form',
  labels: { singular: 'Form', plural: 'Form Blocks' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Split Panel', value: 'split' },
      ],
    },
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
    {
      name: 'leftPanelHeading',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.style === 'split',
      },
    },
    {
      name: 'leftPanelDescription',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData?.style === 'split',
      },
    },
    {
      name: 'contactItems',
      type: 'array',
      admin: {
        condition: (_, siblingData) => siblingData?.style === 'split',
      },
      fields: [
        {
          name: 'icon',
          type: 'text',
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'submitLabel',
      type: 'text',
      label: 'Submit Button Label',
      defaultValue: 'Send My Inquiry',
    },
  ],
}
