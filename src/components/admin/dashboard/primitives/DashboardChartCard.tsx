import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardChartCardProps {
  title: string
  description?: string
  children: ReactNode
}

export function DashboardChartCard({ title, description, children }: DashboardChartCardProps) {
  return (
    <Card className="border-(--cms-card-border)">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
