'use client'

import type { TextareaFieldClientComponent } from 'payload'
import { FieldError, FieldLabel, useField } from '@payloadcms/ui'
import { cn } from '@/lib/utils'

const TextareaField: TextareaFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError } = useField<string>({ path })
  const fieldLabel = field.label as string | undefined

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel
        htmlFor={`field-${path}`}
        label={field.label}
        required={'required' in field ? (field.required as boolean) : false}
      />

      <textarea
        id={`field-${path}`}
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
        rows={('admin' in field && field.admin?.rows) || 4}
        placeholder={
          'placeholder' in field && typeof field.placeholder === 'string'
            ? field.placeholder
            : `Enter ${fieldLabel ?? path}`
        }
        className={cn(
          'w-full resize-y rounded-lg border border-(--cms-input-border) bg-(--cms-input-bg) px-3 py-2.5 text-sm text-(--cms-text)',
          'placeholder:text-(--cms-text-muted) transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--cms-primary) focus-visible:border-(--cms-primary)',
          showError && 'border-(--cms-danger) focus-visible:ring-(--cms-danger)',
        )}
      />

      {showError && <FieldError path={path} />}
    </div>
  )
}

export default TextareaField
