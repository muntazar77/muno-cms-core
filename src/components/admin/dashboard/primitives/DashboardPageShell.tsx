import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DashboardPageShellProps {
  children: ReactNode
  className?: string
}

export function DashboardPageShell({ children, className }: DashboardPageShellProps) {
  return <div className={cn('min-h-screen bg-(--cms-bg-elevated)', className)}>{children}</div>
}
