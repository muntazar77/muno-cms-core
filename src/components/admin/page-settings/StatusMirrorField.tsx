'use client'

import type { UIFieldClientComponent } from 'payload'
import { FieldLabel, useField } from '@payloadcms/ui'

const selectClasses =
  'flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:border-blue-400 transition-colors'

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
