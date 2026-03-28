import type { CollectionConfig } from 'payload'
import { access } from '@/access'
import { softDeleteFields, softDeleteHooks } from '@/utilities/softDelete'
import { siteIdField } from '@/fields/siteId'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mimeType', 'createdAt'],
    components: {
      views: {
        list: {
          Component: '/components/admin/CustomListView',
        },
      },
    },
  },
  hooks: softDeleteHooks,
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
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    siteIdField,
    ...softDeleteFields,
  ],
  upload: {
    mimeTypes: [
      'image/*',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
}
