import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { DashboardChecklistItem } from './types'

interface DashboardChecklistCardProps {
  title: string
  items: DashboardChecklistItem[]
}

export function DashboardChecklistCard({ title, items }: DashboardChecklistCardProps) {
  return (
    <Card className="border-(--cms-card-border)">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-(--cms-text)">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'rounded-xl border p-4 transition',
                item.done
                  ? 'border-(--cms-success-soft) bg-(--cms-success-soft)'
                  : 'border-(--cms-border) bg-(--cms-card-bg)',
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex size-5 items-center justify-center rounded-full text-xs font-bold',
                    item.done ? 'bg-(--cms-success) text-white' : 'border-2 border-(--cms-border)',
                  )}
                >
                  {item.done && '✓'}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium',
                    item.done ? 'text-(--cms-success-text)' : 'text-(--cms-text)',
                  )}
                >
                  {item.label}
                </span>
              </div>
              {!item.done && item.actionLabel && item.actionHref && (
                <Link
                  href={item.actionHref}
                  className="mt-2 inline-block text-xs font-medium text-(--cms-primary) hover:underline"
                >
                  {item.actionLabel}
                </Link>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
