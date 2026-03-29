import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DashboardGridProps {
  children: ReactNode
  className?: string
}

export function DashboardGrid({ children, className }: DashboardGridProps) {
  return <div className={cn('grid gap-6 lg:grid-cols-3', className)}>{children}</div>
}
