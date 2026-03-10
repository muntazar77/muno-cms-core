'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  Users,
  Image as ImageIcon,
  FileText,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Minus,
  Briefcase,
  Inbox,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface StatCardData {
  label: string
  value: number | string
  icon: 'users' | 'media' | 'pages' | 'applications' | 'services' | 'forms'
  trend?: { value: number; direction: 'up' | 'down' | 'neutral' }
  description?: string
}

const ICONS = {
  users: Users,
  media: ImageIcon,
  pages: FileText,
  applications: ClipboardList,
  services: Briefcase,
  forms: Inbox,
}

const ICON_COLORS = {
  users: 'bg-blue-50 text-blue-600',
  media: 'bg-violet-50 text-violet-600',
  pages: 'bg-emerald-50 text-emerald-600',
  applications: 'bg-amber-50 text-amber-600',
  services: 'bg-rose-50 text-rose-600',
  forms: 'bg-cyan-50 text-cyan-600',
}

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'tween', duration: 0.35 } },
}

export default function StatsGrid({ stats }: { stats: StatCardData[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = ICONS[stat.icon]
        const iconColor = ICON_COLORS[stat.icon]
        const TrendIcon =
          stat.trend?.direction === 'up'
            ? TrendingUp
            : stat.trend?.direction === 'down'
              ? TrendingDown
              : Minus

        return (
          <motion.div key={stat.label} variants={item}>
            <Card className="group cursor-default transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div
                    className={cn('flex size-9 items-center justify-center rounded-xl', iconColor)}
                  >
                    <Icon className="size-4" />
                  </div>
                  {stat.trend && (
                    <Badge
                      variant={
                        stat.trend.direction === 'up'
                          ? 'success'
                          : stat.trend.direction === 'down'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className="gap-1 text-[11px]"
                    >
                      <TrendIcon className="size-3" />
                      {stat.trend.value > 0 ? '+' : ''}
                      {stat.trend.value}%
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <CardTitle className="mt-0.5 text-xs font-normal text-gray-500">
                  {stat.label}
                </CardTitle>
                {stat.description && (
                  <p className="mt-1 text-[11px] text-gray-400">{stat.description}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
