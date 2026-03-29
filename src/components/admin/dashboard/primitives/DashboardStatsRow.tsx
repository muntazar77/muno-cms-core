import { cn } from '@/lib/utils'
import { DashboardStatCard } from './DashboardStatCard'
import type { DashboardStatItem } from './types'

interface DashboardStatsRowProps {
  items: DashboardStatItem[]
  className?: string
}

export function DashboardStatsRow({ items, className }: DashboardStatsRowProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6',
        className,
      )}
    >
      {items.map((item) => (
        <DashboardStatCard key={item.label} item={item} />
      ))}
    </div>
  )
}
