import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type WorkspaceMetricTone = 'primary' | 'success' | 'warning' | 'info'

interface WorkspaceMetricCardProps {
  label: string
  value: number | string
  detail: string
  icon: LucideIcon
  tone: WorkspaceMetricTone
}

const toneStyles: Record<WorkspaceMetricTone, { chip: string; accent: string }> = {
  primary: {
    chip: 'bg-(--cms-primary-soft) text-(--cms-primary)',
    accent: 'from-(--cms-primary-soft) to-transparent',
  },
  success: {
    chip: 'bg-(--cms-success-soft) text-(--cms-success-text)',
    accent: 'from-(--cms-success-soft) to-transparent',
  },
  warning: {
    chip: 'bg-(--cms-warning-soft) text-(--cms-warning-text)',
    accent: 'from-(--cms-warning-soft) to-transparent',
  },
  info: {
    chip: 'bg-(--cms-info-soft) text-(--cms-info-text)',
    accent: 'from-(--cms-info-soft) to-transparent',
  },
}

export default function WorkspaceMetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: WorkspaceMetricCardProps) {
  const styles = toneStyles[tone]

  return (
    <Card className="relative overflow-hidden rounded-[24px] border-(--cms-card-border) bg-(--cms-card-bg)">
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br opacity-80',
          styles.accent,
        )}
      />
      <CardContent className="relative flex min-h-[176px] flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
              {label}
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-(--cms-text) sm:text-[2.6rem] sm:leading-none">
              {value}
            </p>
          </div>
          <div
            className={cn(
              'flex size-12 shrink-0 items-center justify-center rounded-2xl',
              styles.chip,
            )}
          >
            <Icon className="size-5" />
          </div>
        </div>

        <p className="max-w-[24ch] text-sm leading-6 text-(--cms-text-secondary)">{detail}</p>
      </CardContent>
    </Card>
  )
}
