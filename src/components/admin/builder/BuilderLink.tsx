'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { Paintbrush } from 'lucide-react'

export default function BuilderLink() {
  const { id } = useDocumentInfo()

  if (!id) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/50 p-4 text-center">
        <p className="text-sm text-gray-500">
          Save this page first, then use the builder to add content blocks.
        </p>
      </div>
    )
  }

  return (
    <a
      href={`/admin/builder/${id}`}
      className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
    >
      <Paintbrush className="h-4 w-4" />
      Open Page Builder
    </a>
  )
}
