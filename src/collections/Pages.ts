import type { CollectionConfig } from 'payload'
import {
  HeroBlock,
  TextBlock,
  FeaturesBlock,
  GalleryBlock,
  CTABlock,
  FormBlock,
  HeroWithImageBlock,
  ServicesCardsBlock,
  StepsTimelineBlock,
  StatisticsBlock,
  TestimonialsBlock,
  LogoCloudBlock,
  PricingTableBlock,
  FAQBlock,
} from '../blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  trash: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt', 'createdAt'],
    components: {
      views: {
        list: {
          Component: '/components/admin/CustomListView',
        },
      },
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.slug) {
          data.slug = data.slug.replace(/^\/+/, '')
        }
        return data
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => {
      const u = user as { role?: string } | null
      return u?.role === 'admin'
    },
  },
  fields: [
    {
      type: 'tabs',
      admin: {
        className: 'pages-settings-tabs',
      },
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'builderLink',
              type: 'ui',
              admin: {
                components: {
                  Field: '/components/admin/builder/BuilderLink',
                },
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Page Title',
              required: true,
              admin: {
                description: 'Primary page title shown in admin and page headers.',
              },
            },
            {
              name: 'slug',
              type: 'text',
              label: 'Slug',
              required: true,
              unique: true,
              index: true,
              admin: {
                description: 'URL path without leading slash, e.g. "about" not "/about".',
              },
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'draft',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
              ],
              required: true,
            },
            {
              name: 'pageType',
              type: 'select',
              options: [
                { label: 'Landing', value: 'landing' },
                { label: 'Blog', value: 'blog' },
                { label: 'About', value: 'about' },
                { label: 'Contact', value: 'contact' },
                { label: 'Custom', value: 'custom' },
              ],
            },
            {
              name: 'template',
              type: 'select',
              options: [
                { label: 'Default', value: 'default' },
                { label: 'Full Width', value: 'full-width' },
                { label: 'Sidebar Left', value: 'sidebar-left' },
                { label: 'Sidebar Right', value: 'sidebar-right' },
              ],
            },
            {
              name: 'parentPage',
              type: 'relationship',
              relationTo: 'pages',
            },
          ],
        },
        {
          label: 'Site Identity',
          fields: [
            {
              name: 'pageName',
              type: 'text',
            },
            {
              name: 'shortDescription',
              type: 'textarea',
            },
            {
              name: 'author',
              type: 'text',
            },
            {
              name: 'lastUpdatedInfo',
              type: 'ui',
              admin: {
                components: {
                  Field: '/components/admin/page-settings/LastUpdatedInfoField',
                },
              },
            },
          ],
        },
        {
          label: 'Branding',
          fields: [
            {
              name: 'branding',
              type: 'group',
              fields: [
                { name: 'logoUrl', type: 'text', label: 'Logo URL' },
                { name: 'faviconUrl', type: 'text', label: 'Favicon URL' },
                {
                  name: 'headerVariant',
                  type: 'select',
                  label: 'Header Variant',
                  options: [
                    { label: 'Default', value: 'default' },
                    { label: 'Centered', value: 'centered' },
                    { label: 'Minimal', value: 'minimal' },
                    { label: 'Transparent', value: 'transparent' },
                  ],
                },
                {
                  name: 'footerVariant',
                  type: 'select',
                  label: 'Footer Variant',
                  options: [
                    { label: 'Default', value: 'default' },
                    { label: 'Centered', value: 'centered' },
                    { label: 'Minimal', value: 'minimal' },
                    { label: 'Columns', value: 'columns' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO & Meta',
          fields: [
            {
              name: 'meta',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Meta Title',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Meta Description',
                },
                {
                  name: 'canonicalUrl',
                  type: 'text',
                  label: 'Canonical URL',
                },
                {
                  name: 'robotsIndex',
                  type: 'checkbox',
                  label: 'Allow Search Engine Indexing',
                  defaultValue: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'OG Image',
                },
                {
                  name: 'twitterImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Twitter Image',
                },
              ],
            },
            {
              name: 'searchPreview',
              type: 'ui',
              admin: {
                components: {
                  Field: '/components/admin/page-settings/SearchEnginePreviewField',
                },
              },
            },
          ],
        },
        {
          label: 'Publishing',
          fields: [
            {
              name: 'statusPublishing',
              type: 'ui',
              admin: {
                components: {
                  Field: '/components/admin/page-settings/StatusMirrorField',
                },
              },
            },
            {
              name: 'publishDate',
              type: 'date',
            },
            {
              name: 'visibility',
              type: 'select',
              defaultValue: 'public',
              options: [
                { label: 'Public', value: 'public' },
                { label: 'Private', value: 'private' },
                { label: 'Password Protected', value: 'password-protected' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        HeroBlock,
        TextBlock,
        FeaturesBlock,
        GalleryBlock,
        CTABlock,
        FormBlock,
        HeroWithImageBlock,
        ServicesCardsBlock,
        StepsTimelineBlock,
        StatisticsBlock,
        TestimonialsBlock,
        LogoCloudBlock,
        PricingTableBlock,
        FAQBlock,
      ],
      admin: {
        condition: () => false,
      },
    },
  ],
}
