import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'
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
  HeroEditorialBlock,
  ServicesBentoBlock,
  SplitContentBlock,
} from '../blocks'
import { access } from '@/access'

export const MarketingPages: CollectionConfig = {
  slug: 'marketing-pages',
  admin: {
    group: 'Platform',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'isHome', 'updatedAt'],
    description: 'Platform marketing pages for monocms.app (super-admin only)',
    components: {
      views: {
        list: {
          Component: '/components/admin/CustomListView',
        },
      },
    },
  },
  versions: {
    drafts: {
      autosave: false,
    },
  },
  access: {
    read: access.adminOnly,
    create: access.adminOnly,
    update: access.adminOnly,
    delete: access.adminOnly,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Strip leading slashes from slug
        if (typeof data?.slug === 'string') {
          data.slug = data.slug.replace(/^\/+/, '').trim()
        }
        // Auto-set publishedAt when transitioning to published
        if (data?.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
    beforeValidate: [
      async ({ data, req, operation, originalDoc }) => {
        if (!data) return data

        // Enforce only one isHome page
        if (data.isHome === true) {
          const existing = await req.payload.find({
            collection: 'marketing-pages',
            where: {
              and: [
                { isHome: { equals: true } },
                ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
              ],
            },
            limit: 1,
            depth: 0,
          })
          if (existing.totalDocs > 0) {
            throw new ValidationError({
              errors: [
                {
                  message:
                    'Another homepage already exists. Uncheck "Is Homepage" on that page first.',
                  path: 'isHome',
                },
              ],
            })
          }
        }

        // Enforce unique slug
        if (data.slug !== undefined) {
          const isCreate = operation === 'create'
          const slugChanged = operation === 'update' && data.slug !== originalDoc?.slug
          if (isCreate || slugChanged) {
            const existing = await req.payload.find({
              collection: 'marketing-pages',
              where: {
                and: [
                  { slug: { equals: data.slug } },
                  ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
                ],
              },
              limit: 1,
              depth: 0,
            })
            if (existing.totalDocs > 0) {
              throw new ValidationError({
                errors: [
                  {
                    message: `A marketing page with slug "${data.slug}" already exists.`,
                    path: 'slug',
                  },
                ],
              })
            }
          }
        }

        return data
      },
    ],
  },
  fields: [
    // ─── Core Fields ──────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { width: '70%' },
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          index: true,
          admin: {
            width: '30%',
            description:
              'Leave empty string for homepage (/). Use "about", "pricing", "contact" etc.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'isHome',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            width: '33%',
            description: 'Marks this as the root domain homepage (/)',
          },
        },
        {
          name: 'publishedAt',
          type: 'date',
          admin: {
            width: '34%',
            description: 'Auto-set when first published',
          },
        },
      ],
    },

    // ─── SEO / Meta ───────────────────────────────────────────────────────────
    {
      name: 'meta',
      type: 'group',
      label: 'SEO & Meta',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'title',
              type: 'text',
              admin: { width: '50%', description: 'Overrides page title in search results' },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: { width: '50%', rows: 2, description: 'Max 160 characters recommended' },
            },
          ],
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Open Graph / social sharing image (1200×630px recommended)' },
        },
      ],
    },

    // ─── Page Blocks ──────────────────────────────────────────────────────────
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        HeroBlock,
        HeroWithImageBlock,
        HeroEditorialBlock,
        TextBlock,
        FeaturesBlock,
        ServicesCardsBlock,
        ServicesBentoBlock,
        StepsTimelineBlock,
        StatisticsBlock,
        TestimonialsBlock,
        LogoCloudBlock,
        PricingTableBlock,
        FAQBlock,
        GalleryBlock,
        FormBlock,
        CTABlock,
        SplitContentBlock,
      ],
      // Hidden from native Payload admin UI — edited via the visual page builder
      admin: {
        condition: () => false,
      },
    },
  ],
}
