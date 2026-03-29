'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  DashboardStatCard,
  type DashboardStatItem,
  type DashboardStatItem as DashboardPrimitiveStatItem,
} from './primitives'
import type { AdminStatIcon } from '@/components/admin/shared/AdminStatCard'
import { Briefcase, ClipboardList, FileText, Image as ImageIcon, Inbox, Users } from 'lucide-react'

export interface StatCardData {
  label: string
  value: number | string
  icon: AdminStatIcon
  trend?: { value: number; direction: 'up' | 'down' | 'neutral' }
  description?: string
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

const iconMap: Record<AdminStatIcon, DashboardPrimitiveStatItem['icon']> = {
  users: Users,
  media: ImageIcon,
  pages: FileText,
  applications: ClipboardList,
  services: Briefcase,
  forms: Inbox,
}

const toneMap: Record<AdminStatIcon, NonNullable<DashboardStatItem['tone']>> = {
  users: 'info',
  media: 'primary',
  pages: 'success',
  applications: 'warning',
  services: 'danger',
  forms: 'neutral',
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
        const itemData: DashboardStatItem = {
          label: stat.label,
          value: stat.value,
          icon: iconMap[stat.icon],
          tone: toneMap[stat.icon],
          trend: stat.trend,
          description: stat.description,
        }

        return (
          <motion.div key={stat.label} variants={item}>
            <DashboardStatCard item={itemData} />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
