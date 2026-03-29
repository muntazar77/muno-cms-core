import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DashboardSectionProps {
  title?: string
  description?: string
  aside?: ReactNode
  children: ReactNode
  className?: string
}

export function DashboardSection({
  title,
  description,
  aside,
  children,
  className,
}: DashboardSectionProps) {
  return (
    <section className={cn('space-y-3', className)}>
      {(title || description || aside) && (
        <div className="flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-base font-semibold text-(--cms-text)">{title}</h2>}
            {description && (
              <p className="mt-0.5 text-xs text-(--cms-text-secondary)">{description}</p>
            )}
          </div>
          {aside}
        </div>
      )}
      {children}
    </section>
  )
}
