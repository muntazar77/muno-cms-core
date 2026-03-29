import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  ClipboardList,
  FileText,
  FolderCog,
  Image as ImageIcon,
  LayoutDashboard,
  Plus,
  User,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DashboardCharts } from './DashboardCharts'
import {
  DashboardActivityList,
  DashboardGrid,
  DashboardHeader,
  DashboardPageShell,
  DashboardQuickActions,
  DashboardSection,
  DashboardStatsRow,
  EmptyState,
  type DashboardActivityItem,
  type DashboardQuickActionItem,
  type DashboardStatItem,
} from './primitives'

interface SiteActivityRow {
  siteId: string
  updates: number
}

function formatRelativeDate(value?: string): string {
  if (!value) return 'Unknown date'
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function DashboardView() {
  const payload = await getPayload({ config })
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    usersResult,
    mediaResult,
    pagesResult,
    servicesResult,
    formsResult,
    submissionsResult,
    sitesResult,
    recentUsers,
    recentMedia,
    recentPages,
    recentSubmissions,
    activePagesWindow,
  ] = await Promise.all([
    payload.find({ collection: 'users', limit: 0, depth: 0 }),
    payload.find({ collection: 'media', limit: 0, depth: 0 }),
    payload.find({ collection: 'pages', limit: 0, depth: 0 }),
    payload.find({ collection: 'services', limit: 0, depth: 0 }),
    payload.find({ collection: 'forms', limit: 0, depth: 0 }),
    payload.find({ collection: 'form-submissions', limit: 0, depth: 0 }),
    payload.find({ collection: 'sites', limit: 0, depth: 0 }),
    payload.find({ collection: 'users', limit: 5, sort: '-createdAt', depth: 0 }),
    payload.find({ collection: 'media', limit: 5, sort: '-createdAt', depth: 0 }),
    payload.find({ collection: 'pages', limit: 5, sort: '-createdAt', depth: 0 }),
    payload.find({ collection: 'form-submissions', limit: 6, sort: '-createdAt', depth: 0 }),
    payload.find({
      collection: 'pages',
      depth: 0,
      limit: 200,
      sort: '-updatedAt',
      where: {
        and: [
          { updatedAt: { greater_than_equal: sevenDaysAgo } },
          {
            or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }],
          },
        ],
      },
    }),
  ])

  const stats: DashboardStatItem[] = [
    {
      label: 'Total Sites',
      value: sitesResult.totalDocs,
      icon: FolderCog,
      tone: 'primary',
      description: 'Active workspaces',
    },
    {
      label: 'Total Users',
      value: usersResult.totalDocs,
      icon: Users,
      tone: 'info',
      description: 'Registered accounts',
    },
    {
      label: 'Total Pages',
      value: pagesResult.totalDocs,
      icon: FileText,
      tone: 'success',
      description: 'Published + draft pages',
    },
    {
      label: 'Total Media',
      value: mediaResult.totalDocs,
      icon: ImageIcon,
      tone: 'warning',
      description: 'Uploaded assets',
    },
    {
      label: 'Total Forms',
      value: formsResult.totalDocs,
      icon: ClipboardList,
      tone: 'neutral',
      description: 'Form templates',
    },
    {
      label: 'Total Submissions',
      value: submissionsResult.totalDocs,
      icon: ClipboardList,
      tone: 'danger',
      description: 'Captured responses',
    },
  ]

  const activityItems: DashboardActivityItem[] = [
    ...recentUsers.docs.map((u) => ({
      id: `user-${String(u.id)}`,
      title: (u as unknown as { email?: string }).email ?? 'User account',
      subtitle: 'New user registered',
      time: (u as unknown as { createdAt?: string }).createdAt ?? new Date().toISOString(),
      icon: User,
      tone: 'info' as const,
      href: '/admin/collections/users',
    })),
    ...recentMedia.docs.map((m) => ({
      id: `media-${String(m.id)}`,
      title: (m as unknown as { filename?: string }).filename ?? 'Uploaded media',
      subtitle: (m as unknown as { mimeType?: string }).mimeType ?? 'Media file',
      time: (m as unknown as { createdAt?: string }).createdAt ?? new Date().toISOString(),
      icon: ImageIcon,
      tone: 'primary' as const,
      href: '/admin/collections/media',
    })),
    ...recentPages.docs.map((p) => ({
      id: `page-${String(p.id)}`,
      title: (p as unknown as { title?: string }).title ?? 'Untitled page',
      subtitle: `Status: ${(p as unknown as { status?: string }).status ?? 'draft'}`,
      time: (p as unknown as { createdAt?: string }).createdAt ?? new Date().toISOString(),
      icon: FileText,
      tone: 'success' as const,
      href: '/admin/collections/pages',
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8)

  const quickActions: DashboardQuickActionItem[] = [
    {
      label: 'Create Site',
      description: 'Provision a new client workspace',
      href: '/admin/collections/sites/create',
      icon: Plus,
    },
    {
      label: 'Review Submissions',
      description: 'Audit incoming form traffic',
      href: '/admin/collections/form-submissions',
      icon: ClipboardList,
    },
    {
      label: 'Manage Users',
      description: 'Roles, invites, and access',
      href: '/admin/collections/users',
      icon: Users,
    },
    {
      label: 'Media Library',
      description: 'Review recent uploads',
      href: '/admin/collections/media',
      icon: ImageIcon,
    },
  ]

  const activeBySiteId = activePagesWindow.docs.reduce<Record<string, number>>((acc, doc) => {
    const siteId = (doc as unknown as { siteId?: string }).siteId
    if (!siteId) return acc
    acc[siteId] = (acc[siteId] ?? 0) + 1
    return acc
  }, {})

  const topSiteIds = Object.entries(activeBySiteId)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id)

  const topSitesLookup =
    topSiteIds.length > 0
      ? await payload.find({
          collection: 'sites',
          depth: 0,
          limit: topSiteIds.length,
          where: { siteId: { in: topSiteIds } },
        })
      : { docs: [] }

  const topSiteRows: SiteActivityRow[] = topSiteIds.map((id) => ({
    siteId: id,
    updates: activeBySiteId[id] ?? 0,
  }))

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <DashboardPageShell>
      <DashboardHeader
        title={`${greeting}, platform operator`}
        subtitle="Your system-wide control center for content operations and tenant activity"
        meta={now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        icon={
          <div
            className="flex size-12 items-center justify-center rounded-2xl text-white shadow-sm"
            style={{
              background: 'linear-gradient(135deg, var(--cms-primary), var(--cms-primary-hover))',
            }}
          >
            <LayoutDashboard className="size-5" />
          </div>
        }
      />

      <div className="space-y-6 p-4 sm:p-6">
        <DashboardSection>
          <DashboardStatsRow items={stats} />
        </DashboardSection>

        <DashboardSection
          title="Platform analytics"
          description="Weekly operational trends across the CMS."
        >
          <DashboardCharts />
        </DashboardSection>

        <DashboardGrid className="grid gap-6 lg:grid-cols-3">
          <DashboardSection
            className="lg:col-span-2"
            title="Recent activity"
            description="Latest user, media, and page updates"
          >
            <Card className="border-(--cms-card-border)">
              <CardContent className="pt-6">
                <DashboardActivityList items={activityItems} />
              </CardContent>
            </Card>
          </DashboardSection>

          <DashboardSection title="Quick admin actions" description="Common platform tasks">
            <DashboardQuickActions items={quickActions} columnsClassName="grid grid-cols-1 gap-2" />
          </DashboardSection>
        </DashboardGrid>

        <DashboardGrid className="grid gap-6 lg:grid-cols-3">
          <DashboardSection
            className="lg:col-span-2"
            title="Latest form submissions"
            description="Most recent entries from all sites"
            aside={
              <Link
                href="/admin/collections/form-submissions"
                className="text-xs font-medium text-(--cms-primary) hover:underline"
              >
                View all
              </Link>
            }
          >
            <Card className="border-(--cms-card-border)">
              <CardContent className="pt-6">
                {recentSubmissions.docs.length === 0 ? (
                  <EmptyState
                    icon={ClipboardList}
                    title="No submissions yet"
                    description="Form submissions will appear here once users start sending responses."
                  />
                ) : (
                  <div className="space-y-2">
                    {recentSubmissions.docs.map((submission) => {
                      const row = submission as unknown as {
                        id: string | number
                        form?: string | { title?: string }
                        createdAt?: string
                        siteId?: string
                      }
                      const formTitle =
                        typeof row.form === 'object' && row.form?.title
                          ? row.form.title
                          : typeof row.form === 'string'
                            ? row.form
                            : 'Form submission'

                      return (
                        <Link
                          key={String(row.id)}
                          href={`/admin/collections/form-submissions/${row.id}`}
                          className="flex items-center justify-between rounded-lg border border-(--cms-border-subtle) bg-(--cms-bg) px-3 py-2.5 transition hover:border-(--cms-border) hover:bg-(--cms-bg-muted)"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-(--cms-text)">
                              {formTitle}
                            </p>
                            <p className="truncate text-xs text-(--cms-text-secondary)">
                              Site: {row.siteId ?? 'unknown'}
                            </p>
                          </div>
                          <span className="shrink-0 text-[11px] text-(--cms-text-muted)">
                            {formatRelativeDate(row.createdAt)}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </DashboardSection>

          <DashboardSection
            title="Top active sites"
            description="Most page updates in the last 7 days"
          >
            <Card className="border-(--cms-card-border)">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-(--cms-text)">
                  Content velocity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {topSiteRows.length === 0 ? (
                  <EmptyState
                    icon={FolderCog}
                    title="No active sites"
                    description="Site activity appears after pages are updated."
                  />
                ) : (
                  topSiteRows.map((site) => {
                    const match = topSitesLookup.docs.find(
                      (doc) => (doc as unknown as { siteId?: string }).siteId === site.siteId,
                    ) as unknown as
                      | { id?: string | number; siteName?: string; siteId?: string }
                      | undefined

                    return (
                      <Link
                        key={site.siteId}
                        href={
                          match?.id
                            ? `/admin/collections/sites/${match.id}/dashboard`
                            : '/admin/collections/sites'
                        }
                        className="flex items-center justify-between rounded-lg border border-(--cms-border-subtle) bg-(--cms-bg) px-3 py-2 transition hover:border-(--cms-border) hover:bg-(--cms-bg-muted)"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-(--cms-text)">
                            {match?.siteName ?? site.siteId}
                          </p>
                          <p className="text-xs text-(--cms-text-muted)">{site.siteId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-(--cms-text)">{site.updates}</p>
                          <p className="text-[11px] text-(--cms-text-muted)">updates</p>
                        </div>
                      </Link>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </DashboardSection>
        </DashboardGrid>

        <div className="flex flex-wrap gap-2">
          <Link href="/admin/collections/sites/create">
            <Button className="gap-2">
              <Plus className="size-4" />
              Add site
            </Button>
          </Link>
          <Link href="/admin/collections/users">
            <Button variant="outline" className="gap-2">
              <Users className="size-4" />
              Manage users
            </Button>
          </Link>
          <Link href="/admin/collections/sites">
            <Button variant="outline" className="gap-2">
              <FolderCog className="size-4" />
              Review sites
            </Button>
          </Link>
        </div>
      </div>
    </DashboardPageShell>
  )
}
