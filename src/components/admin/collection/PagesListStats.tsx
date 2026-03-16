'use client'

import { useEffect, useState } from 'react'
import StatsGrid, { type StatCardData } from '@/components/admin/dashboard/StatsGrid'

/**
 * Collection list stats example for Pages.
 * Demonstrates reusable AdminStatCard usage through StatsGrid.d fd
 */ 
export default function PagesListStats() {
  const [stats, setStats] = useState<StatCardData[] | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchStats() {
      try {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)

        const [totalRes, publishedRes, draftRes, newRes] = await Promise.all([
          fetch('/api/pages?limit=0&depth=0'),
          fetch('/api/pages?limit=0&depth=0&where[status][equals]=published'),
          fetch('/api/pages?limit=0&depth=0&where[status][equals]=draft'),
          fetch(
            `/api/pages?limit=0&depth=0&where[createdAt][greater_than]=${weekAgo.toISOString()}`,
          ),
        ])

        const [total, published, drafts, newThisWeek] = await Promise.all([
          totalRes.json(),
          publishedRes.json(),
          draftRes.json(),
          newRes.json(),
        ])

        if (cancelled) return

        const newCount = Number(newThisWeek?.totalDocs ?? 0)

        setStats([
          {
            label: 'Total Pages',
            value: total.totalDocs ?? 0,
            icon: 'pages',
            description: 'All active pages',
          },
          {
            label: 'Published',
            value: published.totalDocs ?? 0,
            icon: 'pages',
            description: 'Live pages',
          },
          {
            label: 'Drafts',
            value: drafts.totalDocs ?? 0,
            icon: 'pages',
            description: 'Work in progress',
          },
          {
            label: 'New This Week',
            value: newCount,
            icon: 'pages',
            trend: {
              value: newCount,
              direction: newCount > 0 ? 'up' : 'neutral',
            },
            description: 'Created in last 7 days',
          },
        ])
      } catch {
        // Non-critical; list still renders without stats.
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
