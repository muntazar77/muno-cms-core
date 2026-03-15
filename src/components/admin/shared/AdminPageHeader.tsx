'use client'

import Link from 'next/link'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminPageHeaderProps {
  title: string
  description?: string
  isTrashView?: boolean
  primaryActionLabel?: string
  primaryActionHref?: string
  trashActionHref?: string
  totalDocs?: number
}

export default function AdminPageHeader({
  title,
  description,
  isTrashView = false,
  primaryActionLabel,
  primaryActionHref,
  trashActionHref,
  totalDocs,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-[var(--cms-text)]">{title}</h1>
        {description && (
          <p className="mt-1 text-[13px] text-[var(--cms-text-muted)]">
            {description}
            {typeof totalDocs === 'number' ? ` • ${totalDocs.toLocaleString()} total` : ''}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {trashActionHref && (
          <Link href={trashActionHref}>
            <Button
              variant="outline"
              className="rounded-xl border-[var(--cms-border)] text-[var(--cms-text-secondary)]"
            >
              {isTrashView ? (
                <>
                  <ArrowLeft className="mr-1.5 size-4" />
                  Back to Active
                </>
              ) : (
                <>
                  <Trash2 className="mr-1.5 size-4" />
                  View Trash
                </>
              )}
            </Button>
          </Link>
        )}

        {primaryActionLabel && primaryActionHref && (
          <Link href={primaryActionHref}>
            <Button className="rounded-xl bg-[var(--cms-primary)] px-4 text-white shadow-sm transition-colors hover:bg-[var(--cms-primary-hover)]">
              <Plus className="mr-1.5 size-4" />
              {primaryActionLabel}
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
