'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import AdminStatCard, { type AdminStatIcon } from '@/components/admin/shared/AdminStatCard'

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

export default function StatsGrid({ stats }: { stats: StatCardData[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => {
        return (
          <motion.div key={stat.label} variants={item}>
            <AdminStatCard {...stat} />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
