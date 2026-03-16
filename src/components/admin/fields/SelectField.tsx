'use client'

import type { SelectFieldClientComponent } from 'payload'
import { useField, FieldLabel, FieldError } from '@payloadcms/ui'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type OptionObject = { label: string; value: string }

const SelectField: SelectFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError } = useField<string>({ path })
  const options = (field.options ?? []) as (string | OptionObject)[]

  const normalized: OptionObject[] = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt,
  )

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel
        htmlFor={`field-${path}`}
        label={field.label}
        required={'required' in field ? (field.required as boolean) : false}
      />
      <div className="relative">
        <select
          id={`field-${path}`}
          value={value ?? ''}
          onChange={(e) => setValue(e.target.value)}
          className={cn(
            'flex h-10 w-full appearance-none rounded-lg border border-[var(--cms-input-border)] bg-[var(--cms-input-bg)] px-3 pr-9 text-sm text-[var(--cms-text)] transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cms-primary)] focus-visible:border-[var(--cms-primary)]',
            showError && 'border-[var(--cms-danger)] focus-visible:ring-[var(--cms-danger)]',
          )}
        >
          <option value="">Select an option…</option>
          {normalized.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--cms-text-muted)]" />
      </div>
      {showError && <FieldError path={path} />}
    </div>
  )
}

export default SelectField
