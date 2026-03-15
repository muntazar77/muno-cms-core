'use client'

import type { UIFieldClientComponent } from 'payload'
import { useFormFields } from '@payloadcms/ui'
import { Clock3 } from 'lucide-react'

const LastUpdatedInfoField: UIFieldClientComponent = () => {
  const updatedAt = useFormFields(([fields]) => fields.updatedAt?.value as string | undefined)
  const createdAt = useFormFields(([fields]) => fields.createdAt?.value as string | undefined)

  const effectiveDate = updatedAt || createdAt

  return (
    <div className="pages-settings-card pages-settings-card--subtle">
      <div className="flex items-center gap-2">
        <Clock3 className="h-4 w-4 text-[var(--cms-text-muted)]" />
        <p className="text-sm font-medium text-[var(--cms-text-secondary)]">Last Updated</p>
      </div>
      <p className="mt-2 text-sm text-[var(--cms-text)]">
        {effectiveDate
          ? new Date(effectiveDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Not available yet'}
      </p>
    </div>
  )
}

export default LastUpdatedInfoField
