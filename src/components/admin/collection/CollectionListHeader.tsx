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
    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{label}</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Browse and manage {label.toLowerCase()}
        </p>
      </div>
      {hasCreatePermission && collectionSlug && (
        <Link
          href={`/admin/collections/${collectionSlug}/create`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-blue-700 transition-colors no-underline"
        >
          <Plus className="size-[14px]" />
          Add New
        </Link>
      )}
    </div>
  )
}
