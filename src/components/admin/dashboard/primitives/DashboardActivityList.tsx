import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { EmptyState } from './EmptyState'
import type { DashboardActivityItem } from './types'
import { Clock } from 'lucide-react'

function timeAgo(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

const toneClass = {
  primary: 'bg-(--cms-primary-soft) text-(--cms-primary-text)',
  success: 'bg-(--cms-success-soft) text-(--cms-success-text)',
  warning: 'bg-(--cms-warning-soft) text-(--cms-warning-text)',
  danger: 'bg-(--cms-danger-soft) text-(--cms-danger-text)',
  info: 'bg-(--cms-info-soft) text-(--cms-info-text)',
  neutral: 'bg-(--cms-bg-muted) text-(--cms-text-secondary)',
} as const

interface DashboardActivityListProps {
  items: DashboardActivityItem[]
  emptyTitle?: string
  emptyDescription?: string
}

export function DashboardActivityList({
  items,
  emptyTitle = 'No recent activity',
  emptyDescription = 'Activity will appear here as your team works.',
}: DashboardActivityListProps) {
  if (items.length === 0) {
    return <EmptyState icon={Clock} title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="flex flex-col divide-y divide-(--cms-border-subtle)">
      {items.map((item, index) => {
        const Icon = item.icon
        const row = (
          <div
            className={cn(
              'flex items-start gap-3 rounded-lg px-1 py-3 transition-colors hover:bg-(--cms-bg-muted)',
              index === 0 && 'pt-0',
            )}
          >
            <div
              className={cn(
                'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
                toneClass[item.tone ?? 'neutral'],
              )}
            >
              <Icon className="size-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-(--cms-text)">{item.title}</p>
              <p className="mt-0.5 text-xs text-(--cms-text-secondary)">{item.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px]">
                {timeAgo(item.time)}
              </Badge>
            </div>
          </div>
        )

        if (item.href) {
          return (
            <Link key={item.id} href={item.href}>
              {row}
            </Link>
          )
        }

        return <div key={item.id}>{row}</div>
      })}
    </div>
  )
}
