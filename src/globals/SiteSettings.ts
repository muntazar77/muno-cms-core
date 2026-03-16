import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => {
      const u = user as { role?: string } | null
      return u?.role === 'admin'
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General Site Info',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              label: 'Site Name',
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Site Description',
            },
            {
              name: 'siteUrl',
              type: 'text',
              label: 'Site URL',
              admin: {
                placeholder: 'https://www.example.com',
                description: 'The main URL of the website. Used for SEO and absolute links.',
              },
            },
          ],
        },
        {
          label: 'Branding',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Primary Logo',
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon',
              admin: {
                description: 'Recommended size: 32x32 or 64x64 pixels.',
              },
            },
          ],
        },
        {
          label: 'SEO Defaults',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: 'Global SEO Fallbacks',
              admin: {
                description: 'These will be used if a specific page does not have its own SEO data defined.',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Default Meta Title',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Default Meta Description',
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Default OpenGraph Image',
                },
              ],
            },
          ],
        },
        {
          label: 'Social Profiles',
          fields: [
            {
              name: 'socialLinks',
              type: 'group',
              label: 'Social Links',
              fields: [
                { name: 'twitter', type: 'text', label: 'Twitter / X URL' },
                { name: 'facebook', type: 'text', label: 'Facebook URL' },
                { name: 'instagram', type: 'text', label: 'Instagram URL' },
                { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
                { name: 'github', type: 'text', label: 'GitHub URL' },
                { name: 'youtube', type: 'text', label: 'YouTube URL' },
              ],
            },
          ],
        },
        {
          label: 'Links & Contact',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: 'Contact Information',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                },
                {
                  name: 'phone',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
