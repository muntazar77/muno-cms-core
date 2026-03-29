'use client'

import type { UIFieldClientComponent } from 'payload'
import { FieldLabel, useField } from '@payloadcms/ui'

const selectClasses =
  'flex h-10 w-full rounded-lg border border-(--cms-input-border) bg-(--cms-input-bg) px-3 py-1.5 text-sm text-(--cms-text) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--cms-primary) focus-visible:ring-offset-0 focus-visible:border-(--cms-primary) transition-colors'

const StatusMirrorField: UIFieldClientComponent = () => {
  const { value, setValue } = useField<string>({ path: 'status' })

  return (
    <div className="pages-settings-card">
      <div className="pages-settings-card__header">
        <h3 className="pages-settings-card__title">Publishing Status</h3>
        <p className="pages-settings-card__description">
          Keep draft while editing and switch to published when ready.
        </p>
      </div>
      <div className="space-y-1.5">
        <FieldLabel htmlFor="field-status-mirror" label="Status" required />
        <select
          id="field-status-mirror"
          value={value ?? 'draft'}
          onChange={(e) => setValue(e.target.value)}
          className={selectClasses}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
    </div>
  )
}

export default StatusMirrorField
