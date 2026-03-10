import { getPayload } from 'payload'
import config from '@payload-config'
import { LayoutDashboard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatsGrid, { type StatCardData } from './StatsGrid'
import { ActivityFeed } from './ActivityFeed'
import { DashboardCharts } from './DashboardCharts'

export default async function DashboardView() {
  const payload = await getPayload({ config })

  // Fetch real counts
  const [usersResult, mediaResult, pagesResult, servicesResult, formsResult, submissionsResult] =
    await Promise.all([
      payload.find({ collection: 'users', limit: 0, depth: 0 }),
      payload.find({ collection: 'media', limit: 0, depth: 0 }),
      payload.find({ collection: 'pages', limit: 0, depth: 0 }),
      payload.find({ collection: 'services', limit: 0, depth: 0 }),
      payload.find({ collection: 'forms', limit: 0, depth: 0 }),
      payload.find({ collection: 'form-submissions', limit: 0, depth: 0 }),
    ])

  const totalUsers = usersResult.totalDocs
  const totalMedia = mediaResult.totalDocs
  const totalPages = pagesResult.totalDocs
  const totalServices = servicesResult.totalDocs
  const totalForms = formsResult.totalDocs
  const totalSubmissions = submissionsResult.totalDocs

  // Fetch recent activity
  const [recentUsers, recentMedia, recentPages] = await Promise.all([
    payload.find({ collection: 'users', limit: 5, sort: '-createdAt', depth: 0 }),
    payload.find({ collection: 'media', limit: 5, sort: '-createdAt', depth: 0 }),
    payload.find({ collection: 'pages', limit: 5, sort: '-createdAt', depth: 0 }),
  ])

  // Build stats
  const stats: StatCardData[] = [
    {
      label: 'Total Users',
      value: totalUsers,
      icon: 'users',
      trend: { value: 12, direction: 'up' },
      description: 'Registered accounts',
    },
    {
      label: 'Pages',
      value: totalPages,
      icon: 'pages',
      description: 'Content pages',
    },
    {
      label: 'Media Files',
      value: totalMedia,
      icon: 'media',
      description: 'Assets uploaded',
    },
    {
      label: 'Services',
      value: totalServices,
      icon: 'services',
      description: 'Service listings',
    },
    {
      label: 'Forms',
      value: totalForms,
      icon: 'forms',
      description: 'Form templates',
    },
    {
      label: 'Submissions',
      value: totalSubmissions,
      icon: 'applications',
      description: 'Form responses',
    },
  ]

  // Build activity feed
  const activityItems = [
    ...recentUsers.docs.map((u) => ({
      id: String(u.id),
      type: 'user' as const,
      label: (u as unknown as { email?: string }).email ?? 'User',
      sublabel: 'Joined',
      time: (u as unknown as { createdAt: string }).createdAt,
    })),
    ...recentMedia.docs.map((m) => ({
      id: String(m.id),
      type: 'media' as const,
      label: (m as unknown as { filename?: string }).filename ?? 'File',
      sublabel: (m as unknown as { mimeType?: string }).mimeType ?? 'Unknown type',
      time: (m as unknown as { createdAt: string }).createdAt,
    })),
    ...recentPages.docs.map((p) => ({
      id: String(p.id),
      type: 'page' as const,
      label: (p as unknown as { title?: string }).title ?? 'Page',
      sublabel: (p as unknown as { status?: string }).status ?? 'draft',
      time: (p as unknown as { createdAt: string }).createdAt,
    })),
  ]
    .filter((item) => item.time)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8)

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      {/* Page Header */}
      <div className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <LayoutDashboard className="size-4" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900 dark:text-gray-50">
              {greeting} 👋
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Stats */}
        <section>
          <StatsGrid stats={stats} />
        </section>

        {/* Charts */}
        <section>
          <DashboardCharts />
        </section>

        {/* Activity Feed */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-gray-900">
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest changes across your content</CardDescription>
                </div>
                <span className="text-[11px] font-medium text-blue-600 cursor-pointer hover:underline">
                  View all
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ActivityFeed items={activityItems} />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
