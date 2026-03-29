import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DashboardHeaderProps {
  icon?: ReactNode
  title: string
  subtitle?: string
  meta?: string
  actions?: ReactNode
  className?: string
}

export function DashboardHeader({
  icon,
  title,
  subtitle,
  meta,
  actions,
  className,
}: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        'border-b border-(--cms-border-subtle) bg-(--cms-card-bg) px-4 py-5 sm:px-6 sm:py-6',
        className,
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          {icon && <div className="pt-0.5">{icon}</div>}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-(--cms-text)">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-(--cms-text-secondary)">{subtitle}</p>}
            {meta && <p className="mt-1 text-xs text-(--cms-text-muted)">{meta}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
