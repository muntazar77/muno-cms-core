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
                  admin: {
                    width: '50%',
                    components: {
                      Field: '/components/admin/fields/InputField',
                    },
                  },
                },
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                  index: true,
                  admin: {
                    width: '50%',
                    components: {
                      Field: '/components/admin/fields/InputField',
                    },
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  admin: {
                    width: '33%',
                    components: {
                      Field: '/components/admin/fields/InputField',
                    },
                  },
                },
                {
                  name: 'nationality',
                  type: 'text',
                  admin: {
                    width: '33%',
                    components: {
                      Field: '/components/admin/fields/InputField',
                    },
                  },
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
                  admin: {
                    width: '25%',
                    description: 'Current stage in the student journey lifecycle.',
                    components: {
                      Field: '/components/admin/fields/SelectField',
                    },
                  },
                },
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'new',
                  options: statusOptions,
                  admin: {
                    width: '25%',
                    description: 'Operational status for day-to-day follow-up decisions.',
                    components: {
                      Field: '/components/admin/fields/SelectField',
                    },
                  },
                },
                {
                  name: 'priority',
                  type: 'select',
                  required: true,
                  defaultValue: 'medium',
                  options: priorityOptions,
                  admin: {
                    width: '25%',
                    description: 'Set urgency to help teams triage workload quickly.',
                    components: {
                      Field: '/components/admin/fields/SelectField',
                    },
                  },
                },
                {
                  name: 'assignedTo',
                  type: 'relationship',
                  relationTo: 'users',
                  admin: {
                    width: '25%',
                    description: 'Team member accountable for the next action.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'nextAction',
                  type: 'text',
                  admin: {
                    width: '65%',
                    description: 'Write a clear immediate task (call, follow-up, doc request).',
                    components: {
                      Field: '/components/admin/fields/InputField',
                    },
                  },
                },
                {
                  name: 'nextActionDate',
                  type: 'date',
                  admin: {
                    width: '35%',
                    date: { pickerAppearance: 'dayAndTime' },
                    description: 'Expected completion time for the next action.',
                  },
                },
              ],
            },
            {
              name: 'consultationOutcome',
              type: 'textarea',
              admin: {
                rows: 4,
                description: 'Key notes and decisions from consultation sessions.',
                components: {
                  Field: '/components/admin/fields/TextareaField',
                },
              },
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
                {
                  name: 'targetCity',
                  type: 'text',
                  admin: {
                    width: '25%',
                    components: {
                      Field: '/components/admin/fields/InputField',
                    },
                  },
                },
                {
                  name: 'targetField',
                  type: 'text',
                  admin: {
                    width: '25%',
                    components: {
                      Field: '/components/admin/fields/InputField',
                    },
                  },
                },
                {
                  name: 'educationLevel',
                  type: 'text',
                  admin: {
                    width: '25%',
                    components: {
                      Field: '/components/admin/fields/InputField',
                    },
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'languageLevel',
                  type: 'text',
                  admin: {
                    width: '33%',
                    components: {
                      Field: '/components/admin/fields/InputField',
                    },
                  },
                },
                {
                  name: 'visaType',
                  type: 'text',
                  admin: {
                    width: '33%',
                    components: {
                      Field: '/components/admin/fields/InputField',
                    },
                  },
                },
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
                      admin: {
                        width: '20%',
                        components: {
                          Field: '/components/admin/fields/SelectField',
                        },
                      },
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
              admin: {
                description:
                  'Attach case files and classify each document by type and operational status.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      admin: {
                        width: '30%',
                        components: {
                          Field: '/components/admin/fields/InputField',
                        },
                      },
                    },
                    {
                      name: 'documentType',
                      type: 'select',
                      required: true,
                      defaultValue: 'identity',
                      options: [
                        { label: 'Identity', value: 'identity' },
                        { label: 'Academic', value: 'academic' },
                        { label: 'Financial', value: 'financial' },
                        { label: 'Visa', value: 'visa' },
                        { label: 'Other', value: 'other' },
                      ],
                      admin: {
                        width: '20%',
                        components: {
                          Field: '/components/admin/fields/SelectField',
                        },
                      },
                    },
                    {
                      name: 'status',
                      type: 'select',
                      defaultValue: 'pending',
                      options: [
                        { label: 'Pending', value: 'pending' },
                        { label: 'Received', value: 'received' },
                        { label: 'Verified', value: 'verified' },
                      ],
                      admin: {
                        width: '20%',
                        components: {
                          Field: '/components/admin/fields/SelectField',
                        },
                      },
                    },
                    {
                      name: 'file',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                      admin: {
                        width: '30%',
                        description: 'Upload or select a file from Media library.',
                      },
                    },
                  ],
                },
                {
                  name: 'note',
                  type: 'textarea',
                  admin: {
                    rows: 2,
                    description: 'Optional note for this document item.',
                    components: {
                      Field: '/components/admin/fields/TextareaField',
                    },
                  },
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
                      admin: {
                        width: '70%',
                        rows: 2,
                        components: {
                          Field: '/components/admin/fields/TextareaField',
                        },
                      },
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
