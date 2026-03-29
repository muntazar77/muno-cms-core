import type { LucideIcon } from 'lucide-react'

export interface DashboardStatItem {
  label: string
  value: number | string
  icon: LucideIcon
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  description?: string
  trend?: { value: number; direction: 'up' | 'down' | 'neutral' }
}

export interface DashboardActivityItem {
  id: string
  title: string
  subtitle: string
  time: string | Date
  icon: LucideIcon
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  href?: string
}

export interface DashboardQuickActionItem {
  label: string
  description?: string
  href: string
  icon: LucideIcon
}

export interface DashboardInfoRow {
  label: string
  value: string
}

export interface DashboardChecklistItem {
  id: string
  label: string
  done: boolean
  actionLabel?: string
  actionHref?: string
}
