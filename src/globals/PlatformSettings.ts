import type { GlobalConfig } from 'payload'
import { access } from '@/access'

export const PlatformSettings: GlobalConfig = {
  slug: 'platform-settings',
  label: 'Platform Settings',
  admin: {
    description: 'Global settings for the monocms.app platform marketing site.',
    group: 'Platform',
  },
  access: {
    read: access.globalReadPublic,
    update: access.globalUpdateAdmin,
  },
  fields: [
    // ─── Identity ─────────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'productName',
          type: 'text',
          defaultValue: 'MonoCMS',
          admin: { width: '50%' },
        },
        {
          name: 'tagline',
          type: 'text',
          defaultValue: 'Build & manage multiple websites from one dashboard.',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          admin: { width: '50%', description: 'Primary logo (SVG or PNG, transparent bg)' },
        },
        {
          name: 'favicon',
          type: 'upload',
          relationTo: 'media',
          admin: { width: '50%', description: 'Favicon (32×32 or 64×64 PNG)' },
        },
      ],
    },

    // ─── Navigation ───────────────────────────────────────────────────────────
    {
      name: 'navLinks',
      type: 'array',
      label: 'Navigation Links',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { width: '35%' },
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
              admin: { width: '15%' },
            },
          ],
        },
      ],
    },
    {
      name: 'navCta',
      type: 'group',
      label: 'Navigation CTA Button',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              defaultValue: 'Get Started',
              admin: { width: '35%' },
            },
            {
              name: 'url',
              type: 'text',
              defaultValue: '/admin',
              admin: { width: '50%' },
            },
            {
              name: 'variant',
              type: 'select',
              defaultValue: 'primary',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Ghost', value: 'ghost' },
                { label: 'Outline', value: 'outline' },
              ],
              admin: { width: '15%' },
            },
          ],
        },
      ],
    },

    // ─── Footer ───────────────────────────────────────────────────────────────
    {
      name: 'footerColumns',
      type: 'array',
      label: 'Footer Link Columns',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: { width: '40%' },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: { width: '60%' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'footerLegalLinks',
      type: 'array',
      label: 'Footer Legal Links',
      admin: { description: 'Privacy Policy, Terms of Service, etc.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: { width: '60%' },
            },
          ],
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      admin: {
        description: 'Footer copyright line. Use {year} as a placeholder for the current year.',
      },
      defaultValue: '© {year} MonoCMS. All rights reserved.',
    },

    // ─── Social Links ─────────────────────────────────────────────────────────
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: [
                { label: 'Twitter / X', value: 'twitter' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'GitHub', value: 'github' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'YouTube', value: 'youtube' },
              ],
              admin: { width: '35%' },
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: { width: '65%' },
            },
          ],
        },
      ],
    },

    // ─── SEO Defaults ─────────────────────────────────────────────────────────
    {
      name: 'defaultSeoTitle',
      type: 'text',
      label: 'Default SEO Title',
      defaultValue: 'MonoCMS — Multi-Site Website Builder',
      admin: {
        description: 'Used when a marketing page has no custom meta title.',
      },
    },
    {
      name: 'defaultSeoDescription',
      type: 'textarea',
      label: 'Default SEO Description',
      defaultValue:
        'Build and manage multiple client websites from one powerful dashboard. Page builder, forms, media, and more.',
      admin: { rows: 2 },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Default OG Image',
      admin: { description: 'Fallback social sharing image (1200×630px)' },
    },

    // ─── Contact ──────────────────────────────────────────────────────────────
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Public Contact Email',
    },

    // ─── Announcement Bar ─────────────────────────────────────────────────────
    {
      name: 'announcementBar',
      type: 'group',
      label: 'Announcement Bar',
      admin: { description: 'Optional banner shown at the top of the marketing site.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: false,
              admin: { width: '20%' },
            },
            {
              name: 'variant',
              type: 'select',
              defaultValue: 'info',
              options: [
                { label: 'Info', value: 'info' },
                { label: 'Success', value: 'success' },
                { label: 'Warning', value: 'warning' },
              ],
              admin: { width: '20%' },
            },
            {
              name: 'message',
              type: 'text',
              admin: { width: '60%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'linkLabel',
              type: 'text',
              admin: { width: '30%' },
            },
            {
              name: 'linkUrl',
              type: 'text',
              admin: { width: '70%' },
            },
          ],
        },
      ],
    },
  ],
}
