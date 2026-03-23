'use client'

import type { UIFieldClientComponent } from 'payload'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'

const LABEL_BY_COLLECTION: Record<string, string> = {
  pages: 'Page',
  media: 'Media Item',
  forms: 'Form',
  services: 'Service',
}

const AdminEntityHeaderField: UIFieldClientComponent = () => {
  const { collectionSlug, id } = useDocumentInfo()
  const siteId = useFormFields(([fields]) => String(fields.siteId?.value ?? ''))

  const entityLabel = LABEL_BY_COLLECTION[collectionSlug ?? ''] ?? 'Document'
  const isCreate = !id

  return (
    <div className="pages-settings-card border border-(--cms-border) bg-(--cms-bg-elevated)">
      <div className="pages-settings-card__header">
        <h3 className="pages-settings-card__title">
          {isCreate ? `Create ${entityLabel}` : `Edit ${entityLabel}`}
        </h3>
        <p className="pages-settings-card__description">
          {isCreate
            ? 'Start with core fields. You can refine advanced settings after saving.'
            : 'This form uses native Payload validation, actions, and permissions.'}
        </p>
      </div>

      {siteId ? (
        <div className="mt-3 inline-flex rounded-full border border-(--cms-primary-soft) bg-(--cms-primary-soft) px-3 py-1 text-xs font-semibold text-(--cms-primary-text)">
          Site context: {siteId}
        </div>
      ) : null}
    </div>
  )
}

export default AdminEntityHeaderField
