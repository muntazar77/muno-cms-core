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
          Component: '/components/admin/CollectionCardList',
        },
      },
    },
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create' && data?.template && (!data.blocks || data.blocks.length === 0)) {
          switch (data.template) {
            case 'landing-page':
              data.blocks = [
                {
                  blockType: 'hero',
                  layout: 'centered',
                  backgroundStyle: 'pattern',
                  heading: 'Welcome to our platform',
                  subheading: 'We help you build faster and better with modern tools.',
                  primaryCTA: { label: 'Get Started', url: '/contact' },
                  secondaryCTA: { label: 'Learn More', url: '/about' },
                },
                {
                  blockType: 'features',
                  heading: 'Why choose us?',
                  subheading: 'Everything you need to succeed in one place.',
                  columns: '3',
                  backgroundStyle: 'light',
                  features: [
                    { title: 'Fast', description: 'Blazing fast load times.', icon: 'lightning' },
                    { title: 'Secure', description: 'Enterprise-grade security.', icon: 'shield' },
                    { title: 'Reliable', description: '99.9% uptime guaranteed.', icon: 'check' },
                  ],
                },
                {
                  blockType: 'cta',
                  headline: 'Ready to get started?',
                  subheadline: 'Join thousands of satisfied customers today.',
                  style: 'default',
                  links: [{ label: 'Sign Up', url: '/register', appearance: 'primary' }],
                },
              ]
              break
            case 'about-page':
              data.blocks = [
                {
                  blockType: 'hero',
                  layout: 'split-left',
                  heading: 'About Us',
                  subheading: 'Learn more about our mission and history.',
                },
                {
                  blockType: 'features',
                  heading: 'Our Core Values',
                  columns: '3',
                  features: [
                    { title: 'Innovation', description: 'We innovate constantly.', icon: 'star' },
                    { title: 'Trust', description: 'We build trust.', icon: 'heart' },
                    { title: 'Community', description: 'We give back.', icon: 'globe' },
                  ],
                },
              ]
              break
            case 'services-page':
              data.blocks = [
                {
                  blockType: 'hero',
                  layout: 'centered',
                  backgroundStyle: 'gradient',
                  heading: 'Our Services',
                  subheading: 'Explore what we have to offer.',
                },
                {
                  blockType: 'services-cards',
                  headline: 'What we provide',
                  services: [
                    { title: 'Consulting', description: 'Expert advice.' },
                    { title: 'Development', description: 'Custom solutions.' },
                    { title: 'Support', description: '24/7 assistance.' },
                  ],
                },
              ]
              break
            case 'contact-page':
              data.blocks = [
                {
                  blockType: 'hero',
                  layout: 'centered',
                  heading: 'Contact Us',
                  subheading: "We'd love to hear from you.",
                },
                {
                  blockType: 'form',
                  form: null, // User will select a form later
                },
              ]
              break
          }
        }
        return data
      },
    ],
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
                { label: 'Landing Page', value: 'landing-page' },
                { label: 'About Page', value: 'about-page' },
                { label: 'Services Page', value: 'services-page' },
                { label: 'Contact Page', value: 'contact-page' },
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
