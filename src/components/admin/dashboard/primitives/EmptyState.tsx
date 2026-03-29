import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Icon className="mb-3 size-8 text-(--cms-border)" />
      <p className="text-sm font-medium text-(--cms-text-secondary)">{title}</p>
      <p className="mt-1 text-xs text-(--cms-text-muted)">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-2 text-xs font-medium text-(--cms-primary) hover:underline"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
