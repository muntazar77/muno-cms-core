'use client'

import { useEffect, useState } from 'react'
import StatsGrid, { type StatCardData } from '@/components/admin/dashboard/StatsGrid'

export default function StudentCasesListStats() {
  const [stats, setStats] = useState<StatCardData[] | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchStats() {
      try {
        const now = new Date().toISOString()

        const [totalRes, waitingRes, overdueRes, completedRes] = await Promise.all([
          fetch('/api/student-cases?limit=0&depth=0'),
          fetch(
            '/api/student-cases?limit=0&depth=0&where[status][in]=waiting-student,waiting-institution',
          ),
          fetch(
            `/api/student-cases?limit=0&depth=0&where[status][not_equals]=completed&where[nextActionDate][less_than]=${encodeURIComponent(
              now,
            )}`,
          ),
          fetch('/api/student-cases?limit=0&depth=0&where[status][equals]=completed'),
        ])

        const [total, waiting, overdue, completed] = await Promise.all([
          totalRes.json(),
          waitingRes.json(),
          overdueRes.json(),
          completedRes.json(),
        ])

        if (cancelled) return

        setStats([
          {
            label: 'Active Cases',
            value: Number(total?.totalDocs ?? 0),
            icon: 'applications',
            description: 'Total ongoing student cases',
          },
          {
            label: 'Waiting',
            value: Number(waiting?.totalDocs ?? 0),
            icon: 'forms',
            description: 'Blocked by student or institution',
          },
          {
            label: 'Overdue Action',
            value: Number(overdue?.totalDocs ?? 0),
            icon: 'services',
            description: 'Next action date already passed',
          },
          {
            label: 'Completed',
            value: Number(completed?.totalDocs ?? 0),
            icon: 'pages',
            description: 'Cases marked as completed',
          },
        ])
      } catch {
        // Non-critical, list remains usable without stats.
      }
    }

    void fetchStats()

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
