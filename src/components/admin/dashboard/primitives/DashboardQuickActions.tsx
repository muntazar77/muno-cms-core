import Link from 'next/link'
import type { DashboardQuickActionItem } from './types'

interface DashboardQuickActionsProps {
  items: DashboardQuickActionItem[]
  columnsClassName?: string
}

export function DashboardQuickActions({ items, columnsClassName }: DashboardQuickActionsProps) {
  return (
    <div className={columnsClassName ?? 'grid grid-cols-1 gap-2 sm:grid-cols-2'}>
      {items.map((action) => {
        const Icon = action.icon
        return (
          <Link key={action.label} href={action.href}>
            <div className="group flex items-start gap-2.5 rounded-xl border border-(--cms-border) bg-(--cms-card-bg) p-3 transition hover:border-(--cms-primary) hover:bg-(--cms-primary-soft)">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-(--cms-bg-elevated) text-(--cms-text-secondary) group-hover:bg-(--cms-primary-soft) group-hover:text-(--cms-primary-text)">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-(--cms-text)">{action.label}</p>
                {action.description && (
                  <p className="mt-0.5 text-xs text-(--cms-text-secondary)">{action.description}</p>
                )}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
