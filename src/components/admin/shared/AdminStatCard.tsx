'use client'

import {
  TrendingDown,
  TrendingUp,
  Minus,
  type LucideIcon,
  Users,
  Image as ImageIcon,
  FileText,
  ClipboardList,
  Briefcase,
  Inbox,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type AdminStatIcon = 'users' | 'media' | 'pages' | 'applications' | 'services' | 'forms'

export interface AdminStatCardProps {
  label: string
  value: number | string
  icon: AdminStatIcon
  trend?: { value: number; direction: 'up' | 'down' | 'neutral' }
  description?: string
  className?: string
}

const ICONS: Record<AdminStatIcon, LucideIcon> = {
  users: Users,
  media: ImageIcon,
  pages: FileText,
  applications: ClipboardList,
  services: Briefcase,
  forms: Inbox,
}

const ICON_COLORS: Record<AdminStatIcon, string> = {
  users: 'bg-[var(--cms-info-soft)] text-[var(--cms-info-text)]',
  media: 'bg-[var(--cms-primary-soft)] text-[var(--cms-primary)]',
  pages: 'bg-[var(--cms-success-soft)] text-[var(--cms-success-text)]',
  applications: 'bg-[var(--cms-warning-soft)] text-[var(--cms-warning-text)]',
  services: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300',
  forms: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
}

export default function AdminStatCard({
  label,
  value,
  icon,
  trend,
  description,
  className,
}: AdminStatCardProps) {
  const Icon = ICONS[icon]
  const iconColor = ICON_COLORS[icon]
  const TrendIcon =
    trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus

  return (
    <Card className={cn('group cursor-default transition-shadow hover:shadow-md', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className={cn('flex size-9 items-center justify-center rounded-xl', iconColor)}>
            <Icon className="size-4" />
          </div>
          {trend && (
            <Badge
              variant={
                trend.direction === 'up'
                  ? 'success'
                  : trend.direction === 'down'
                    ? 'destructive'
                    : 'secondary'
              }
              className="gap-1 text-[11px]"
            >
              <TrendIcon className="size-3" />
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[var(--cms-text)]">{value}</div>
        <CardTitle className="mt-0.5 text-xs font-normal text-[var(--cms-text-muted)]">
          {label}
        </CardTitle>
        {description && <p className="mt-1 text-[11px] text-[var(--cms-text-muted)]">{description}</p>}
      </CardContent>
    </Card>
  )
}
