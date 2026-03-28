import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { access } from '@/access'
import { softDeleteFields, softDeleteHooks } from '@/utilities/softDelete'
import { siteIdField } from '@/fields/siteId'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
    beforeValidate: [
      async ({ data, req, operation, originalDoc }) => {
        if (!data?.slug || !data?.siteId) return data
        const isCreate = operation === 'create'
        const slugChanged = operation === 'update' && data.slug !== originalDoc?.slug
        if (!isCreate && !slugChanged) return data
        const existing = await req.payload.find({
          collection: 'services',
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
          throw new APIError(
            `A service with slug "${data.slug}" already exists for this site.`,
            400,
          )
        }
        return data
      },
    ],
    beforeDelete: [...softDeleteHooks.beforeDelete],
  },
  access: {
    read: access.publicReadSiteScoped,
    create: access.siteScoped,
    update: access.siteScoped,
    delete: access.softDeleteSiteScoped,
  },
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL-safe identifier. Unique per site.',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
    },
    siteIdField,
    ...softDeleteFields,
  ],
}
