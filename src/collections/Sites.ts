import type { CollectionConfig, Field } from 'payload'
import { access } from '@/access'

const fontFamilyOptions = [
  { label: 'Inter', value: 'inter' },
  { label: 'Geist', value: 'geist' },
  { label: 'Poppins', value: 'poppins' },
  { label: 'Outfit', value: 'outfit' },
  { label: 'Plus Jakarta Sans', value: 'plus-jakarta-sans' },
  { label: 'DM Sans', value: 'dm-sans' },
] as const

const navLinkFields: Field[] = [
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
        admin: { width: '65%' },
      },
    ],
  },
]

const socialLinkFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'platform',
        type: 'text',
        required: true,
        admin: { width: '35%' },
      },
      {
        name: 'label',
        type: 'text',
        admin: { width: '25%' },
      },
      {
        name: 'url',
        type: 'text',
        required: true,
        admin: { width: '40%' },
      },
    ],
  },
]

export const Sites: CollectionConfig = {
  slug: 'sites',
  admin: {
    hidden: true,
    useAsTitle: 'siteName',
    defaultColumns: ['siteName', 'siteId', 'domain', 'status', 'updatedAt'],
  },
  access: {
    read: access.siteScoped,
    create: access.adminOnly,
    update: access.siteScoped,
    delete: access.adminOnly,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        if (typeof data.siteId === 'string') {
          data.siteId = data.siteId.trim().toLowerCase().replace(/\s+/g, '-')
        }

        if (typeof data.domain === 'string') {
          data.domain = data.domain
            .trim()
            .toLowerCase()
            .replace(/^https?:\/\//, '')
            .replace(/\/$/, '')
        }

        if (typeof data.subdomain === 'string') {
          data.subdomain = data.subdomain.trim().toLowerCase()
        }

        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          description: 'Core site identity and publishing context.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'siteName',
                  type: 'text',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'siteId',
                  type: 'text',
                  required: true,
                  unique: true,
                  index: true,
                  admin: {
                    width: '50%',
                    description: 'Stable site key used for permissions and content scoping.',
                  },
                },
              ],
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              admin: { rows: 3 },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'domain',
                  type: 'text',
                  unique: true,
                  admin: {
                    width: '40%',
                    description: 'Primary domain, for example acme.com or acme.localhost.',
                  },
                },
                {
                  name: 'subdomain',
                  type: 'text',
                  admin: {
                    width: '20%',
                    description: 'Optional short subdomain used for matching preview hosts.',
                  },
                },
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'active',
                  options: [
                    { label: 'Active', value: 'active' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Maintenance', value: 'maintenance' },
                  ],
                  admin: { width: '20%' },
                },
                {
                  name: 'defaultLanguage',
                  type: 'text',
                  defaultValue: 'en',
                  admin: { width: '20%' },
                },
              ],
            },
            {
              name: 'timezone',
              type: 'text',
              defaultValue: 'UTC',
              admin: {
                description: 'IANA timezone string such as Europe/Paris or America/New_York.',
              },
            },
          ],
        },
        {
          label: 'Branding',
          description: 'Brand assets, palette, and typography.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%' },
                },
                {
                  name: 'favicon',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryColor',
                  type: 'text',
                  defaultValue: '#2563eb',
                  admin: { width: '50%' },
                },
                {
                  name: 'secondaryColor',
                  type: 'text',
                  defaultValue: '#0f172a',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'fontFamily',
              type: 'select',
              defaultValue: 'inter',
              options: [...fontFamilyOptions],
            },
          ],
        },
        {
          label: 'Navigation',
          description: 'Header and footer navigation tied to this site only.',
          fields: [
            {
              type: 'collapsible',
              label: 'Header Navigation',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'headerNav',
                  type: 'array',
                  labels: { singular: 'Link', plural: 'Links' },
                  fields: navLinkFields,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'ctaLabel',
                      type: 'text',
                      admin: { width: '30%' },
                    },
                    {
                      name: 'ctaUrl',
                      type: 'text',
                      admin: { width: '70%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'showSiteTitle',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: { width: '25%' },
                    },
                    {
                      name: 'showLanguageSwitcher',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { width: '25%' },
                    },
                    {
                      name: 'showThemeToggle',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { width: '25%' },
                    },
                    {
                      name: 'stickyHeader',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: { width: '25%' },
                    },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Footer Navigation',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'footerLinks',
                  type: 'array',
                  labels: { singular: 'Link', plural: 'Links' },
                  fields: navLinkFields,
                },
                {
                  name: 'socialLinks',
                  type: 'array',
                  labels: { singular: 'Social Link', plural: 'Social Links' },
                  fields: socialLinkFields,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'showNewsletterSignup',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { width: '25%' },
                    },
                    {
                      name: 'footerTagline',
                      type: 'text',
                      admin: { width: '75%' },
                    },
                  ],
                },
                {
                  name: 'footerNote',
                  type: 'textarea',
                  admin: { rows: 2 },
                },
                {
                  name: 'copyrightText',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          description: 'Default metadata and social sharing assets.',
          fields: [
            {
              name: 'defaultMetaTitle',
              type: 'text',
            },
            {
              name: 'defaultMetaDescription',
              type: 'textarea',
              admin: { rows: 3 },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%' },
                },
                {
                  name: 'twitterImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'allowIndexing',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          label: 'Contact',
          description: 'Public business contact information for this site.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'publicEmail',
                  type: 'email',
                  admin: { width: '50%' },
                },
                {
                  name: 'phone',
                  type: 'text',
                  admin: { width: '25%' },
                },
                {
                  name: 'whatsapp',
                  type: 'text',
                  admin: { width: '25%' },
                },
              ],
            },
            {
              name: 'address',
              type: 'textarea',
              admin: { rows: 3 },
            },
          ],
        },
      ],
    },
  ],
}
