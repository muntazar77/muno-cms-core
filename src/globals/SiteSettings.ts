import type { GlobalConfig } from 'payload'

const isAdmin = ({ req: { user } }: { req: { user: unknown } }) => {
  const u = user as { role?: string } | null
  return u?.role === 'admin'
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ─── GENERAL ────────────────────────────────────────────────────
        {
          label: 'General',
          description: 'Basic information about your site',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              label: 'Site Name',
              admin: {
                description: 'Displayed in the browser tab and as fallback when no logo is set',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Site Description',
              admin: {
                description: 'A short sentence describing what your site is about',
                rows: 3,
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo',
                  admin: {
                    description:
                      'Shown in the header. SVG or PNG with transparent background recommended.',
                    width: '50%',
                  },
                },
                {
                  name: 'favicon',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Favicon',
                  admin: {
                    description: '32×32 or 64×64 PNG/ICO file',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'contact',
              type: 'group',
              label: 'Contact Information',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'email',
                      type: 'email',
                      label: 'Email',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'phone',
                      type: 'text',
                      label: 'Phone',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'address',
                  type: 'text',
                  label: 'Address',
                },
              ],
            },
          ],
        },

        // ─── BRANDING ───────────────────────────────────────────────────
        {
          label: 'Branding',
          description: 'Colors and typography for your site',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryColor',
                  type: 'text',
                  label: 'Primary Color',
                  defaultValue: '#6366f1',
                  admin: {
                    description: 'Hex color used for buttons, links, and accents. Example: #6366f1',
                    width: '50%',
                  },
                },
                {
                  name: 'accentColor',
                  type: 'text',
                  label: 'Accent Color',
                  defaultValue: '#f59e0b',
                  admin: {
                    description: 'Secondary accent color. Example: #f59e0b',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'fontFamily',
              type: 'select',
              label: 'Font Family',
              defaultValue: 'inter',
              options: [
                { label: 'Inter (Default)', value: 'inter' },
                { label: 'Geist', value: 'geist' },
                { label: 'Poppins', value: 'poppins' },
                { label: 'Outfit', value: 'outfit' },
                { label: 'Plus Jakarta Sans', value: 'plus-jakarta-sans' },
                { label: 'DM Sans', value: 'dm-sans' },
              ],
              admin: {
                description: 'Font loaded from Google Fonts and applied site-wide',
              },
            },
          ],
        },

        // ─── NAVIGATION ─────────────────────────────────────────────────
        {
          label: 'Navigation',
          description: 'Control links shown in your header and footer',
          fields: [
            // Header nav
            {
              name: 'headerNav',
              type: 'array',
              label: 'Header Navigation',
              labels: { singular: 'Link', plural: 'Links' },
              minRows: 0,
              maxRows: 8,
              admin: {
                description: 'Links displayed in the top navigation bar',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Label',
                      required: true,
                      admin: { width: '40%' },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'URL',
                      required: true,
                      admin: {
                        width: '40%',
                        description: 'Use /slug for internal pages or https://... for external',
                      },
                    },
                    {
                      name: 'isButton',
                      type: 'checkbox',
                      label: 'Show as Button',
                      defaultValue: false,
                      admin: { width: '20%' },
                    },
                  ],
                },
              ],
            },

            // Footer nav
            {
              name: 'footerTagline',
              type: 'text',
              label: 'Footer Tagline',
              defaultValue: 'Building the modern web, one block at a time.',
              admin: {
                description: 'Short text shown under the site name in the footer',
              },
            },
            {
              name: 'footerNav',
              type: 'array',
              label: 'Footer Navigation',
              labels: { singular: 'Link', plural: 'Links' },
              minRows: 0,
              maxRows: 12,
              admin: {
                description: 'Links displayed in the footer',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Label',
                      required: true,
                      admin: { width: '40%' },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'URL',
                      required: true,
                      admin: { width: '60%' },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ─── SEO ────────────────────────────────────────────────────────
        {
          label: 'SEO',
          description: 'Default SEO metadata used when pages have no custom SEO set',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              label: 'Default Meta Title',
              admin: {
                description: 'Used as the fallback <title> tag. Keep under 60 characters.',
              },
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              label: 'Default Meta Description',
              admin: {
                description: 'Shown in search engine results. Keep between 150–160 characters.',
                rows: 3,
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Default OG Image',
              admin: {
                description:
                  'Shown when the site is shared on social media. Recommended: 1200×630px',
              },
            },
          ],
        },
      ],
    },
  ],
}
