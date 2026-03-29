import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
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
import { access } from '@/access'
import { softDeleteFields, softDeleteHooks } from '@/utilities/softDelete'
import { siteIdField } from '@/fields/siteId'

const isSavedDocument = (data: unknown): boolean => {
  if (!data || typeof data !== 'object') return false
  return Boolean((data as { id?: number | string }).id)
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt', 'createdAt'],
    hidden: ({ user }) => (user?.role as string | undefined) !== 'super-admin',
    components: {
      views: {
        list: {
          Component: '/components/admin/CustomListView',
        },
      },
    },
  },
  hooks: {
    ...softDeleteHooks,
    beforeChange: [
      ...softDeleteHooks.beforeChange,
      ({ data }) => {
        if (data?.slug) {
          data.slug = data.slug.replace(/^\/+/, '')
        }
        return data
      },
    ],
    beforeValidate: [
      async ({ data, req, operation, originalDoc }) => {
        if (!data?.slug || !data?.siteId) return data
        const isCreate = operation === 'create'
        const slugChanged = operation === 'update' && data.slug !== originalDoc?.slug
        if (!isCreate && !slugChanged) return data
        const existing = await req.payload.find({
          collection: 'pages',
          where: {
            and: [
              { slug: { equals: data.slug } },
              { siteId: { equals: data.siteId } },
              ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
            ],
          },
          limit: 1,
          depth: 0,
        })
        if (existing.totalDocs > 0) {
          throw new APIError(`A page with slug "${data.slug}" already exists for this site.`, 400)
        }
        return data
      },
    ],
    beforeDelete: [...softDeleteHooks.beforeDelete],
  },
  access: {
    read: access.publicOrSiteScoped,
    create: access.siteScoped,
    update: access.siteScoped,
    delete: access.softDeleteSiteScoped,
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
              name: 'siteContextResolver',
              type: 'ui',
              admin: {
                components: {
                  Field: '/components/admin/shared/SiteContextResolverField',
                },
              },
            },
            {
              name: 'adminEntityHeader',
              type: 'ui',
              admin: {
                components: {
                  Field: '/components/admin/shared/AdminEntityHeaderField',
                },
              },
            },
            {
              name: 'builderLink',
              type: 'ui',
              admin: {
                condition: (data) => isSavedDocument(data),
                components: {
                  Field: '/components/admin/builder/BuilderLink',
                },
              },
            },
            {
              name: 'pageContextHelper',
              type: 'ui',
              admin: {
                components: {
                  Field: '/components/admin/page-settings/PageContextHelperField',
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
              index: true,
              admin: {
                description:
                  'URL path without leading slash, e.g. "about" not "/about". Unique per site.',
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
              admin: {
                condition: (data) => isSavedDocument(data),
              },
            },
          ],
        },
        {
          label: 'Site Identity',
          admin: {
            condition: (data) => isSavedDocument(data),
          },
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
          admin: {
            condition: (data) => isSavedDocument(data),
          },
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
          admin: {
            condition: (data) => isSavedDocument(data),
          },
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
          admin: {
            condition: (data) => isSavedDocument(data),
          },
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
    siteIdField,
    ...softDeleteFields,
  ],
}
