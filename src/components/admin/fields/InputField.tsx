'use client'

import type { TextFieldClientComponent } from 'payload'
import { useField, FieldLabel, FieldError } from '@payloadcms/ui'
import { cn } from '@/lib/utils'

const InputField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError } = useField<string>({ path })
  const fieldLabel = field.label as string | undefined

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel
        htmlFor={`field-${path}`}
        label={field.label}
        required={'required' in field ? (field.required as boolean) : false}
      />
      <input
        id={`field-${path}`}
        type="text"
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
        placeholder={
          'placeholder' in field && typeof field.placeholder === 'string'
            ? field.placeholder
            : `Enter ${fieldLabel ?? path}`
        }
        className={cn(
          'flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900',
          'placeholder:text-gray-400 transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500',
          'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500',
          showError && 'border-red-400 focus-visible:ring-red-400',
        )}
      />
      {showError && <FieldError path={path} />}
    </div>
  )
}

export default InputField
