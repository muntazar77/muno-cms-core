'use client'

import { useEffect, useMemo, useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'

export interface BuilderField {
  name: string
  type: string
  label?: string
  required?: boolean
  options?: Array<{ label: string; value: string }>
  fields?: BuilderField[]
  relationTo?: string
  defaultValue?: unknown
  description?: string
}

interface FieldRendererProps {
  field: BuilderField
  value: unknown
  onChange: (value: unknown) => void
}

const selectClasses =
  'flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:border-blue-400 transition-colors'

const textareaClasses =
  'flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:border-blue-400 transition-colors resize-y'

export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const label = field.label || formatLabel(field.name)

  switch (field.type) {
    case 'text':
      return (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--cms-text-secondary)]">{label}</label>
          <Input
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={label}
          />
          {field.description && (
            <p className="text-[11px] text-[var(--cms-text-muted)]">{field.description}</p>
          )}
        </div>
      )

    case 'textarea':
      return (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--cms-text-secondary)]">{label}</label>
          <textarea
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={label}
            rows={3}
            className={textareaClasses}
          />
        </div>
      )

    case 'richText':
      return (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--cms-text-secondary)]">{label}</label>
          <textarea
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter content..."
            rows={5}
            className={`${textareaClasses} font-mono`}
          />
          <p className="text-[11px] text-[var(--cms-text-muted)]">
            Plain text in builder — full rich text via page editor
          </p>
        </div>
      )

    case 'select':
      return (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--cms-text-secondary)]">{label}</label>
          <select
            value={(value as string) || (field.defaultValue as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            className={selectClasses}
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )

    case 'number':
      return (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--cms-text-secondary)]">{label}</label>
          <Input
            type="number"
            value={(value as number) ?? ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="0"
          />
        </div>
      )

    case 'checkbox':
      return (
        <label className="flex items-center gap-2.5 py-1 cursor-pointer group">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          />
          <span className="text-sm text-[var(--cms-text)]">{label}</span>
        </label>
      )

    case 'upload':
      return <RelationFieldRenderer field={field} value={value} onChange={onChange} />

    case 'relationship':
      return <RelationFieldRenderer field={field} value={value} onChange={onChange} />

    case 'array':
      return <ArrayFieldRenderer field={field} value={value} onChange={onChange} />

    case 'group':
      return <GroupFieldRenderer field={field} value={value} onChange={onChange} />

    default:
      return (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--cms-text-secondary)]">{label}</label>
          <p className="text-[11px] text-[var(--cms-text-muted)] italic">
            Field type &quot;{field.type}&quot; not editable in builder
          </p>
        </div>
      )
  }
}

interface RelationOption {
  id: string
  label: string
}

function RelationFieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const [options, setOptions] = useState<RelationOption[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const relationTo = field.relationTo || 'media'
  const label = field.label || formatLabel(field.name)
  const selectedId = useMemo(() => {
    if (typeof value === 'number' || typeof value === 'string') {
      return String(value)
    }
    if (value && typeof value === 'object' && 'id' in (value as Record<string, unknown>)) {
      return String((value as { id: string | number }).id)
    }
    return ''
  }, [value])

  useEffect(() => {
    let isMounted = true

    async function fetchOptions() {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/${relationTo}?limit=100&depth=0`, {
          credentials: 'include',
        })
        if (!response.ok) return

        const json = (await response.json()) as { docs?: Array<Record<string, unknown>> }
        const docs = json?.docs ?? []

        const mapped = docs.map((doc) => {
          const id = String(doc.id ?? '')
          const labelText =
            relationTo === 'media'
              ? String(doc.title || doc.alt || doc.filename || `Media #${id}`)
              : String(doc.title || doc.name || doc.label || `Document #${id}`)

          return { id, label: labelText }
        })

        if (isMounted) {
          setOptions(mapped)
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void fetchOptions()

    return () => {
      isMounted = false
    }
  }, [relationTo])

  const handleChange = (next: string) => {
    if (!next) {
      onChange(undefined)
      return
    }

    onChange(/^\d+$/.test(next) ? Number(next) : next)
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[var(--cms-text-secondary)]">{label}</label>
      <select
        value={selectedId}
        onChange={(e) => handleChange(e.target.value)}
        className={selectClasses}
      >
        <option value="">
          {isLoading ? `Loading ${relationTo}...` : `Select ${relationTo}...`}
        </option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
      <p className="text-[11px] text-[var(--cms-text-muted)]">
        {options.length > 0
          ? `Showing ${options.length} available ${relationTo} entries.`
          : `No ${relationTo} entries found yet.`}
      </p>
    </div>
  )
}

function ArrayFieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const items = (Array.isArray(value) ? value : []) as Record<string, unknown>[]
  const subFields = field.fields || []
  const label = field.label || formatLabel(field.name)

  const addItem = () => {
    const newItem: Record<string, unknown> = {
      id: Math.random().toString(36).substring(2, 10),
    }
    onChange([...items, newItem])
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, fieldName: string, fieldValue: unknown) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [fieldName]: fieldValue } : item,
    )
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-[var(--cms-text-secondary)]">{label}</label>
        <button
          onClick={addItem}
          type="button"
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={(item.id as string) || index}
            className="border border-[var(--cms-border)] rounded-lg p-3 space-y-3 bg-[var(--cms-bg-elevated)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--cms-text-muted)]">
                Item {index + 1}
              </span>
              <button
                onClick={() => removeItem(index)}
                type="button"
                className="text-[var(--cms-text-muted)] hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            {subFields.map((subField) => (
              <FieldRenderer
                key={subField.name}
                field={subField}
                value={item[subField.name]}
                onChange={(val) => updateItem(index, subField.name, val)}
              />
            ))}
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-[11px] text-[var(--cms-text-muted)] text-center py-2">No items yet</p>
      )}
    </div>
  )
}

function GroupFieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const data = (value as Record<string, unknown>) || {}
  const subFields = field.fields || []
  const label = field.label || formatLabel(field.name)

  const updateField = (fieldName: string, fieldValue: unknown) => {
    onChange({ ...data, [fieldName]: fieldValue })
  }

  return (
    <div className="space-y-3">
      <label className="text-xs font-medium text-[var(--cms-text-secondary)]">{label}</label>
      <div className="border-l-2 border-[var(--cms-border)] pl-3 space-y-3">
        {subFields.map((subField) => (
          <FieldRenderer
            key={subField.name}
            field={subField}
            value={data[subField.name]}
            onChange={(val) => updateField(subField.name, val)}
          />
        ))}
      </div>
    </div>
  )
}

function formatLabel(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}
