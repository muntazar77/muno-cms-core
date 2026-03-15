'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { Paintbrush } from 'lucide-react'

export default function BuilderLink() {
  const { id } = useDocumentInfo()

  if (!id) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--cms-border)] bg-[var(--cms-bg-elevated)] p-4 text-center">
        <p className="text-sm text-[var(--cms-text-muted)]">
          Save this page first to access the visual page builder.
        </p>
      </div>
    )
  }

  return (
    <a
      href={`/admin/pages/${id}/builder`}
      className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 no-underline"
    >
      <Paintbrush className="h-4 w-4" />
      Open Page Builder
    </a>
  )
}
