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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL path without leading slash, e.g. "about" not "/about"',
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
      admin: {
        position: 'sidebar',
      },
    },
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
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      admin: {
        position: 'sidebar',
      },
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'OG Image',
        },
      ],
    },
  ],
}
