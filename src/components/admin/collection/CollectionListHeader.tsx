'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'

interface CollectionListHeaderProps {
  collectionSlug?: string
  collectionLabel?: string
  hasCreatePermission?: boolean
}

export default function CollectionListHeader({
  collectionSlug,
  collectionLabel,
  hasCreatePermission = true,
}: CollectionListHeaderProps) {
  const label = collectionLabel ?? collectionSlug ?? 'Documents'

  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-(--cms-border-subtle) bg-(--cms-bg)">
      <div>
        <h1 className="text-lg font-semibold text-(--cms-text)">{label}</h1>
        <p className="text-xs text-(--cms-text-secondary) mt-0.5">
          Browse and manage {label.toLowerCase()}
        </p>
      </div>
      {hasCreatePermission && collectionSlug && (
        <Link
          href={`/admin/collections/${collectionSlug}/create`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-(--cms-primary) px-3.5 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-(--cms-primary-hover) transition-colors no-underline"
        >
          <Plus className="size-[14px]" />
          Add New
        </Link>
      )}
    </div>
  )
}
