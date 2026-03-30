import type { CollectionConfig, CollectionAfterChangeHook, Field } from 'payload'
import { access } from '@/access'
import { softDeleteFields, softDeleteHooks } from '@/utilities/softDelete'

/**
 * After a site is saved, keep the owner's user.siteId in sync.
 *
 * Handles three cases:
 *  - create with owner   → set owner.siteId = site.siteId
 *  - update, owner swapped A→B → clear A.siteId (if no other site), set B.siteId
 *  - update, owner removed A→null → clear A.siteId (if no other site)
 *
 * Uses `context.skipOwnerSync` to guard against infinite loops.
 * Passes `req` to all nested operations so they share the same DB transaction.
 */
const syncOwnerSiteId: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
  context,
}) => {
  if (context.skipOwnerSync) return doc

  // Relationship fields come back as a numeric id (depth 0) or an object (depth > 0).
  // Normalise both to a plain number so comparisons are safe.
  const toNumericId = (v: unknown): number | null => {
    if (v === null || v === undefined || v === '') return null
    if (typeof v === 'object' && 'id' in (v as object)) return Number((v as { id: unknown }).id)
    const n = Number(v)
    return isNaN(n) ? null : n
  }

  const newOwnerId = toNumericId(doc.owner)
  // On create, previousDoc is undefined — treat old owner as null
  const oldOwnerId = operation === 'update' ? toNumericId(previousDoc?.owner) : null
  const siteSiteId: string = typeof doc.siteId === 'string' ? doc.siteId : ''

  // Nothing to sync if there is no slug yet (should not happen after beforeValidate)
  if (!siteSiteId) return doc

  // Nothing changed on owner field — skip all user writes
  if (operation === 'update' && newOwnerId === oldOwnerId) return doc

  // ── 1. Clear the old owner if they no longer own any active site ──────────
  if (oldOwnerId !== null && oldOwnerId !== newOwnerId) {
    const otherActiveSites = await req.payload.find({
      collection: 'sites',
      where: {
        and: [
          { owner: { equals: oldOwnerId } },
          { id: { not_equals: doc.id } },
          { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] },
        ],
      },
      limit: 1,
      depth: 0,
      req,
    })

    if (otherActiveSites.totalDocs === 0) {
      await req.payload.update({
        collection: 'users',
        id: oldOwnerId,
        data: { siteId: '' },
        context: { skipOwnerSync: true },
        req,
      })
    }
  }

  // ── 2. Assign the new owner ───────────────────────────────────────────────
  if (newOwnerId !== null) {
    await req.payload.update({
      collection: 'users',
      id: newOwnerId,
      data: { siteId: siteSiteId },
      context: { skipOwnerSync: true },
      req,
    })
  }

  return doc
}

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
    useAsTitle: 'siteName',
    defaultColumns: ['siteName', 'siteId', 'domain', 'status', 'updatedAt'],
    components: {
      views: {
        list: {
          Component: '/components/admin/sites/SiteAdminView#SitesListView',
        },
        edit: {
          dashboard: {
            path: '/dashboard',
            Component: '/components/admin/client/ClientDashboardView',
          },
          pages: {
            path: '/pages',
            Component: '/components/admin/client/ClientPagesView',
          },
          media: {
            path: '/media',
            Component: '/components/admin/client/ClientMediaView',
          },
          forms: {
            path: '/forms',
            Component: '/components/admin/client/ClientFormsView',
          },
          services: {
            path: '/services',
            Component: '/components/admin/client/ClientServicesView',
          },
          settings: {
            path: '/settings',
            Component: '/components/admin/sites/SiteAdminView#SiteWorkspaceView',
          },
        },
      },
    },
  },
  access: {
    read: access.siteOwnerOrAdmin,
    create: access.adminOnly,
    update: access.siteOwnerOrAdmin,
    delete: access.softDeleteOnly,
  },
  hooks: {
    ...softDeleteHooks,
    afterChange: [syncOwnerSiteId],
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
            {
              name: 'owner',
              type: 'relationship',
              relationTo: 'users',
              filterOptions: {
                role: { equals: 'client' },
              },
              admin: {
                description:
                  'The client user who manages this site. Only client-role users are shown.',
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
    ...softDeleteFields,
  ],
}
