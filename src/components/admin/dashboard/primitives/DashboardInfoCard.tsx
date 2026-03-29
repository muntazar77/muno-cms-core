import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardInfoRow } from './types'

interface DashboardInfoCardProps {
  title: string
  icon?: ReactNode
  rows: DashboardInfoRow[]
}

export function DashboardInfoCard({ title, icon, rows }: DashboardInfoCardProps) {
  return (
    <Card className="border-(--cms-card-border)">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-sm font-semibold text-(--cms-text)">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <span className="text-sm text-(--cms-text-secondary)">{row.label}</span>
            <span className="max-w-56 truncate text-right text-sm font-medium text-(--cms-text)">{row.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
