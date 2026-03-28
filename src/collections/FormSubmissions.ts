import type { CollectionConfig } from 'payload'
import { access } from '@/access'
import { softDeleteFields, softDeleteHooks } from '@/utilities/softDelete'
import { siteIdField } from '@/fields/siteId'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['form', 'createdAt'],
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
    read: access.siteScoped,
    create: access.anyone,
    update: access.adminOnly,
    delete: access.softDeleteOnly,
  },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'data',
      type: 'json',
      required: true,
      admin: {
        description: 'Submitted form data',
      },
    },
    siteIdField,
    ...softDeleteFields,
  ],
}
