'use client'

import type { UIFieldClientComponent } from 'payload'
import { useFormFields } from '@payloadcms/ui'

const SearchEnginePreviewField: UIFieldClientComponent = () => {
  const title = useFormFields(([fields]) => fields['meta.title']?.value as string | undefined)
  const description = useFormFields(
    ([fields]) => fields['meta.description']?.value as string | undefined,
  )
  const slug = useFormFields(([fields]) => fields.slug?.value as string | undefined)

  const previewTitle = title?.trim() || 'Page Title'
  const previewSlug = slug?.trim() || 'page-slug'
  const previewDescription =
    description?.trim() ||
    'Add a meta description to control how this page appears in search engine results.'

  return (
    <div className="pages-settings-card">
      <div className="pages-settings-card__header">
        <h3 className="pages-settings-card__title">Search Engine Preview</h3>
        <p className="pages-settings-card__description">
          Preview how this page may appear on Google search results.
        </p>
      </div>

      <div className="rounded-lg border border-[var(--cms-border-subtle)] bg-[var(--cms-bg-elevated)] p-4">
        <p className="truncate text-xs text-[var(--cms-text-muted)]">
          https://example.com/{previewSlug}
        </p>
        <p className="mt-1 truncate text-base font-medium text-blue-600 dark:text-blue-400">
          {previewTitle}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-[var(--cms-text-secondary)]">
          {previewDescription}
        </p>
      </div>
    </div>
  )
}

export default SearchEnginePreviewField
