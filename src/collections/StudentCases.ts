import type { CollectionConfig } from 'payload'
import { access } from '@/access'
import { siteIdField } from '@/fields/siteId'
import { softDeleteFields, softDeleteHooks } from '@/utilities/softDelete'

const stageOptions = [
  { label: 'Lead', value: 'lead' },
  { label: 'Consultation', value: 'consultation' },
  { label: 'Application', value: 'application' },
  { label: 'Visa', value: 'visa' },
  { label: 'Enrolled', value: 'enrolled' },
]

const statusOptions = [
  { label: 'New', value: 'new' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Waiting on Student', value: 'waiting-student' },
  { label: 'Waiting on Institution', value: 'waiting-institution' },
  { label: 'Completed', value: 'completed' },
  { label: 'Closed Lost', value: 'closed-lost' },
]

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
]

export const StudentCases: CollectionConfig = {
  slug: 'student-cases',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'currentStage', 'status', 'priority', 'updatedAt'],
    group: 'Operations',
    components: {
      views: {
        list: {
          Component: '/components/admin/CustomListView',
        },
        edit: {
          workspace: {
            path: '/workspace',
            Component: '/components/admin/student-cases/StudentCaseView',
          },
        },
      },
    },
  },
  hooks: {
    ...softDeleteHooks,
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        if (typeof data.fullName === 'string') {
          data.fullName = data.fullName.trim()
        }

        if (typeof data.email === 'string') {
          data.email = data.email.trim().toLowerCase()
        }

        if (typeof data.phone === 'string') {
          data.phone = data.phone.trim()
        }

        if (!data.nextAction) {
          data.nextActionDate = null
        }

        return data
      },
    ],
  },
  access: {
    read: access.siteScoped,
    create: access.siteScoped,
    update: access.siteScoped,
    delete: access.softDeleteSiteScoped,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'fullName',
                  type: 'text',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                  index: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'nationality',
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'dateOfBirth',
                  type: 'date',
                  admin: {
                    width: '34%',
                    date: { pickerAppearance: 'dayOnly' },
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Workflow',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'currentStage',
                  type: 'select',
                  required: true,
                  defaultValue: 'lead',
                  options: stageOptions,
                  admin: { width: '25%' },
                },
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'new',
                  options: statusOptions,
                  admin: { width: '25%' },
                },
                {
                  name: 'priority',
                  type: 'select',
                  required: true,
                  defaultValue: 'medium',
                  options: priorityOptions,
                  admin: { width: '25%' },
                },
                {
                  name: 'assignedTo',
                  type: 'relationship',
                  relationTo: 'users',
                  admin: { width: '25%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'nextAction',
                  type: 'text',
                  admin: { width: '65%' },
                },
                {
                  name: 'nextActionDate',
                  type: 'date',
                  admin: {
                    width: '35%',
                    date: { pickerAppearance: 'dayAndTime' },
                  },
                },
              ],
            },
            {
              name: 'consultationOutcome',
              type: 'textarea',
              admin: { rows: 4 },
            },
          ],
        },
        {
          label: 'Academic Plan',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'targetCountry', type: 'text', admin: { width: '25%' } },
                { name: 'targetCity', type: 'text', admin: { width: '25%' } },
                { name: 'targetField', type: 'text', admin: { width: '25%' } },
                { name: 'educationLevel', type: 'text', admin: { width: '25%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'languageLevel', type: 'text', admin: { width: '33%' } },
                { name: 'visaType', type: 'text', admin: { width: '33%' } },
                {
                  name: 'preferredStartDate',
                  type: 'date',
                  admin: { width: '34%', date: { pickerAppearance: 'dayOnly' } },
                },
              ],
            },
          ],
        },
        {
          label: 'Execution',
          fields: [
            {
              name: 'tasks',
              type: 'array',
              labels: { singular: 'Task', plural: 'Tasks' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'title', type: 'text', required: true, admin: { width: '55%' } },
                    {
                      name: 'status',
                      type: 'select',
                      defaultValue: 'todo',
                      options: [
                        { label: 'To Do', value: 'todo' },
                        { label: 'In Progress', value: 'in-progress' },
                        { label: 'Done', value: 'done' },
                      ],
                      admin: { width: '20%' },
                    },
                    {
                      name: 'dueDate',
                      type: 'date',
                      admin: { width: '25%', date: { pickerAppearance: 'dayOnly' } },
                    },
                  ],
                },
              ],
            },
            {
              name: 'documents',
              type: 'array',
              labels: { singular: 'Document', plural: 'Documents' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, admin: { width: '40%' } },
                    {
                      name: 'status',
                      type: 'select',
                      defaultValue: 'pending',
                      options: [
                        { label: 'Pending', value: 'pending' },
                        { label: 'Received', value: 'received' },
                        { label: 'Verified', value: 'verified' },
                      ],
                      admin: { width: '25%' },
                    },
                    { name: 'file', type: 'upload', relationTo: 'media', admin: { width: '35%' } },
                  ],
                },
              ],
            },
            {
              name: 'timeline',
              type: 'array',
              labels: { singular: 'Event', plural: 'Timeline' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'at',
                      type: 'date',
                      required: true,
                      admin: { width: '30%', date: { pickerAppearance: 'dayAndTime' } },
                    },
                    { name: 'title', type: 'text', required: true, admin: { width: '30%' } },
                    { name: 'note', type: 'text', admin: { width: '40%' } },
                  ],
                },
              ],
            },
            {
              name: 'internalNotes',
              type: 'array',
              labels: { singular: 'Note', plural: 'Notes' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'note',
                      type: 'textarea',
                      required: true,
                      admin: { width: '70%', rows: 2 },
                    },
                    {
                      name: 'createdAt',
                      type: 'date',
                      defaultValue: () => new Date().toISOString(),
                      admin: { width: '30%', date: { pickerAppearance: 'dayAndTime' } },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'sourceSubmission',
      type: 'relationship',
      relationTo: 'form-submissions',
      index: true,
      admin: {
        description: 'Linked form submission that created this case.',
      },
    },
    {
      name: 'sourceChannel',
      type: 'select',
      defaultValue: 'form',
      options: [
        { label: 'Form', value: 'form' },
        { label: 'Manual', value: 'manual' },
        { label: 'Import', value: 'import' },
      ],
    },
    siteIdField,
    ...softDeleteFields,
  ],
}
