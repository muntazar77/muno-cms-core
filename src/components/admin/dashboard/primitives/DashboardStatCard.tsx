import { Minus, TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { DashboardStatItem } from './types'

const toneClass: Record<NonNullable<DashboardStatItem['tone']>, string> = {
  primary: 'bg-(--cms-primary-soft) text-(--cms-primary-text)',
  success: 'bg-(--cms-success-soft) text-(--cms-success-text)',
  warning: 'bg-(--cms-warning-soft) text-(--cms-warning-text)',
  danger: 'bg-(--cms-danger-soft) text-(--cms-danger-text)',
  info: 'bg-(--cms-info-soft) text-(--cms-info-text)',
  neutral: 'bg-(--cms-bg-muted) text-(--cms-text-secondary)',
}

function trendIcon(direction: 'up' | 'down' | 'neutral'): LucideIcon {
  if (direction === 'up') return TrendingUp
  if (direction === 'down') return TrendingDown
  return Minus
}

interface DashboardStatCardProps {
  item: DashboardStatItem
  className?: string
}

export function DashboardStatCard({ item, className }: DashboardStatCardProps) {
  const Icon = item.icon
  const tone = toneClass[item.tone ?? 'neutral']
  const TrendIcon = item.trend ? trendIcon(item.trend.direction) : null

  return (
    <Card className={cn('border-(--cms-card-border) transition-shadow hover:shadow-md', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className={cn('flex size-9 items-center justify-center rounded-xl', tone)}>
            <Icon className="size-4" />
          </div>
          {item.trend && TrendIcon && (
            <Badge
              variant={
                item.trend.direction === 'up'
                  ? 'success'
                  : item.trend.direction === 'down'
                    ? 'destructive'
                    : 'secondary'
              }
              className="gap-1 text-[11px]"
            >
              <TrendIcon className="size-3" />
              {item.trend.value > 0 ? '+' : ''}
              {item.trend.value}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold leading-tight text-(--cms-text)">{item.value}</div>
        <CardTitle className="mt-0.5 text-xs font-normal text-(--cms-text-muted)">
          {item.label}
        </CardTitle>
        {item.description && (
          <p className="mt-1 text-[11px] text-(--cms-text-muted)">{item.description}</p>
        )}
      </CardContent>
    </Card>
  )
}
