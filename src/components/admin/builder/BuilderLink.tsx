'use client'

import Link from 'next/link'
import { useDocumentInfo } from '@payloadcms/ui'
import { Paintbrush } from 'lucide-react'

export default function BuilderLink() {
  const { id } = useDocumentInfo()

  if (!id) {
    return (
      <div className="pages-settings-card pages-settings-card--subtle">
        <h3 className="pages-settings-card__title">Open Page Builder</h3>
        <p className="text-sm text-[var(--cms-text-muted)]">
          Save this page first to access the visual page builder.
        </p>
      </div>
    )
  }

  return (
    <div className="pages-settings-cta">
      <div>
        <h3 className="pages-settings-card__title">Open Page Builder</h3>
        <p className="mt-1 text-sm text-[var(--cms-text-muted)]">
          Launch the visual builder to design this page with drag-and-drop blocks.
        </p>
      </div>
      <Link
        href={`/admin/pages/${id}/builder`}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-md no-underline"
      >
        <Paintbrush className="h-4 w-4" />
        Open Page Builder
      </Link>
    </div>
  )
}
