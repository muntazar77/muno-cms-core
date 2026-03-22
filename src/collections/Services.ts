import type { CollectionConfig } from 'payload'
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
  hooks: softDeleteHooks,
  access: {
    read: access.publicReadSiteScoped,
    create: access.siteScoped,
    update: access.siteScoped,
    delete: access.siteScoped,
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
