'use client'

import { useEffect, useState } from 'react'
import StatsGrid, { type StatCardData } from '@/components/admin/dashboard/StatsGrid'

/**
 * BeforeList-style stats panel for the Users collection.
 * Fetches user counts via REST API and renders stats cards
 * using the shared StatsGrid component.
 */
export default function UsersListStats() {
  const [stats, setStats] = useState<StatCardData[] | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchStats() {
      try {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)

        const [totalRes, adminRes, newRes] = await Promise.all([
          fetch('/api/users?limit=0&depth=0'),
          fetch('/api/users?limit=0&depth=0&where[role][equals]=admin'),
          fetch(
            `/api/users?limit=0&depth=0&where[createdAt][greater_than]=${weekAgo.toISOString()}`,
          ),
        ])

        const [total, admins, newThisWeek] = await Promise.all([
          totalRes.json(),
          adminRes.json(),
          newRes.json(),
        ])

        if (cancelled) return

        setStats([
          {
            label: 'Total Users',
            value: total.totalDocs ?? 0,
            icon: 'users',
            description: 'All registered accounts',
          },
          {
            label: 'Admins',
            value: admins.totalDocs ?? 0,
            icon: 'users',
            description: 'Users with admin role',
          },
          {
            label: 'New This Week',
            value: newThisWeek.totalDocs ?? 0,
            icon: 'users',
            trend: {
              value: newThisWeek.totalDocs ?? 0,
              direction: (newThisWeek.totalDocs ?? 0) > 0 ? ('up' as const) : ('neutral' as const),
            },
            description: 'Joined in the last 7 days',
          },
        ])
      } catch {
        // Non-critical — stats simply don't render
      }
    }

    fetchStats()
    return () => {
      cancelled = true
    }
  }, [])

  if (!stats) return null

  return (
    <div className="mb-6">
      <StatsGrid stats={stats} />
    </div>
  )
}
