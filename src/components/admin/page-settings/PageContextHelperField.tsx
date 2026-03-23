'use client'

import Link from 'next/link'
import type { UIFieldClientComponent } from 'payload'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { useSearchParams } from 'next/navigation'
import { ArrowUpRight, ExternalLink, FileText, Layers3, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const PageContextHelperField: UIFieldClientComponent = () => {
  const { id } = useDocumentInfo()
  const searchParams = useSearchParams()

  const title = useFormFields(([fields]) => String(fields.title?.value ?? ''))
  const slug = useFormFields(([fields]) => String(fields.slug?.value ?? ''))
  const status = useFormFields(([fields]) => String(fields.status?.value ?? 'draft'))
  const siteIdFieldValue = useFormFields(([fields]) => String(fields.siteId?.value ?? ''))
  const siteId = siteIdFieldValue || searchParams?.get('siteId')?.trim() || ''

  const effectiveSlug = slug || toSlug(title)
  const previewHref = effectiveSlug ? `/${effectiveSlug}` : '/'
  const isCreate = !id

  return (
    <div className="pages-settings-card border border-(--cms-border) bg-(--cms-bg-elevated)">
      <div className="pages-settings-card__header">
        <h3 className="pages-settings-card__title">Page Context</h3>
        <p className="pages-settings-card__description">
          {isCreate
            ? 'Start simple. Layout and SEO can be configured after first save.'
            : 'Use this context panel for quick page actions and verification.'}
        </p>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between rounded-lg border border-(--cms-border-subtle) bg-(--cms-bg) px-3 py-2">
          <span className="text-(--cms-text-muted)">Site</span>
          <span className="font-medium text-(--cms-text)">{siteId || 'Will be auto-assigned'}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-(--cms-border-subtle) bg-(--cms-bg) px-3 py-2">
          <span className="text-(--cms-text-muted)">Slug Preview</span>
          <span className="max-w-[62%] truncate font-medium text-(--cms-text)">
            /{effectiveSlug || 'page-slug'}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-(--cms-border-subtle) bg-(--cms-bg) px-3 py-2">
          <span className="text-(--cms-text-muted)">Status</span>
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em]',
              status === 'published'
                ? 'border border-(--cms-success-soft) bg-(--cms-success-soft) text-(--cms-success-text)'
                : 'border border-(--cms-warning-soft) bg-(--cms-warning-soft) text-(--cms-warning-text)',
            )}
          >
            {status || 'draft'}
          </span>
        </div>
      </div>

      {isCreate ? (
        <div className="mt-4 rounded-lg border border-(--cms-primary-soft) bg-(--cms-primary-soft) p-3 text-xs text-(--cms-primary-text)">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 size-3.5" />
            <p>
              Save once to unlock full editing tabs, builder flow, and advanced SEO/publishing controls.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Link
            href={`/admin/pages/${String(id)}/builder`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-(--cms-border) bg-(--cms-bg) px-3 text-sm font-medium text-(--cms-text) no-underline transition hover:border-(--cms-primary) hover:text-(--cms-primary)"
          >
            <Layers3 className="size-4" />
            Open Builder
          </Link>
          <a
            href={previewHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-(--cms-border) bg-(--cms-bg) px-3 text-sm font-medium text-(--cms-text) no-underline transition hover:border-(--cms-primary) hover:text-(--cms-primary)"
          >
            <ExternalLink className="size-4" />
            Preview Page
          </a>
          <div className="sm:col-span-2 rounded-lg border border-(--cms-border-subtle) bg-(--cms-bg) px-3 py-2 text-xs text-(--cms-text-secondary)">
            <div className="inline-flex items-center gap-1.5">
              <FileText className="size-3.5" />
              Use the native Save / Publish actions in the top bar.
              <ArrowUpRight className="size-3.5" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PageContextHelperField
