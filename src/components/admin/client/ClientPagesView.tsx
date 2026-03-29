import Link from 'next/link'
import type { DocumentViewServerProps } from 'payload'
import {
  FileText,
  Plus,
  Eye,
  PenLine,
  Clock,
  Hammer,
  Sparkles,
  FolderOpen,
  Activity,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import WorkspaceHeader from '@/components/admin/shared/WorkspaceHeader'
import WorkspaceMetricCard from '@/components/admin/shared/WorkspaceMetricCard'
import WorkspaceResourceCard from '@/components/admin/shared/WorkspaceResourceCard'

/* ─── Types ───────────────────────────────────────────────────────── */

interface UserWithSite {
  id?: string | number
  email?: string
  role?: string
  siteId?: string
}

interface SiteDoc {
  id: number | string
  siteId?: string | null
  siteName?: string | null
}

interface PageDoc {
  id: string | number
  title?: string | null
  slug?: string | null
  status?: string | null
  updatedAt?: string | null
  createdAt?: string | null
}

/* ─── Helpers ─────────────────────────────────────────────────────── */

function formatRelativeTime(value?: string | null): string {
  if (!value) return '—'
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days > 7) {
    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

function notDeletedWhere() {
  return { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] }
}

const pageStatusTones: Record<string, 'success' | 'warning' | 'neutral'> = {
  published: 'success',
  draft: 'warning',
}

/* ─── Component ───────────────────────────────────────────────────── */

export default async function ClientPagesView(props: DocumentViewServerProps) {
  const user = props.user as UserWithSite | null
  const site = props.doc as SiteDoc | null

  if (!site) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-(--cms-text-secondary)">
        Site not found.
      </div>
    )
  }

  const siteKey = String(site.siteId ?? '')
  const siteWhere = { and: [{ siteId: { equals: siteKey } }, notDeletedWhere()] }

  // Fetch stats and pages in parallel
  const [totalResult, publishedResult, draftResult, recentResult, allPagesResult] =
    await Promise.all([
      props.payload.find({
        collection: 'pages',
        depth: 0,
        limit: 0,
        user,
        overrideAccess: false,
        where: siteWhere,
      }),
      props.payload.find({
        collection: 'pages',
        depth: 0,
        limit: 0,
        user,
        overrideAccess: false,
        where: {
          and: [
            { siteId: { equals: siteKey } },
            { status: { equals: 'published' } },
            notDeletedWhere(),
          ],
        },
      }),
      props.payload.find({
        collection: 'pages',
        depth: 0,
        limit: 0,
        user,
        overrideAccess: false,
        where: {
          and: [
            { siteId: { equals: siteKey } },
            { status: { equals: 'draft' } },
            notDeletedWhere(),
          ],
        },
      }),
      // Recently updated (last 7 days)
      props.payload.find({
        collection: 'pages',
        depth: 0,
        limit: 0,
        user,
        overrideAccess: false,
        where: {
          and: [
            { siteId: { equals: siteKey } },
            { updatedAt: { greater_than: new Date(Date.now() - 7 * 86400_000).toISOString() } },
            notDeletedWhere(),
          ],
        },
      }),
      // All pages for list
      props.payload.find({
        collection: 'pages',
        depth: 0,
        limit: 100,
        sort: '-updatedAt',
        user,
        overrideAccess: false,
        where: siteWhere,
      }),
    ])

  const summaryStats = [
    {
      label: 'Total Pages',
      value: totalResult.totalDocs,
      icon: FileText,
      tone: 'primary' as const,
      detail: 'All pages currently scoped to this site workspace.',
    },
    {
      label: 'Published',
      value: publishedResult.totalDocs,
      icon: Eye,
      tone: 'success' as const,
      detail: 'Live pages visible to visitors right now.',
    },
    {
      label: 'Draft Pages',
      value: draftResult.totalDocs,
      icon: PenLine,
      tone: 'warning' as const,
      detail: 'Pages still being refined before publishing.',
    },
    {
      label: 'Recently Updated',
      value: recentResult.totalDocs,
      icon: Clock,
      tone: 'info' as const,
      detail: 'Pages touched in the last seven days.',
    },
  ]

  const pages = allPagesResult.docs as unknown as PageDoc[]
  const publishRate = totalResult.totalDocs
    ? Math.round((publishedResult.totalDocs / totalResult.totalDocs) * 100)
    : 0
  const newestPage = pages[0]

  return (
    <div className="min-h-screen bg-(--cms-bg-elevated)">
      <div className="mx-auto w-full max-w-[1680px] space-y-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
        <WorkspaceHeader
          eyebrow={site.siteName || siteKey}
          title="Pages Workspace"
          description="Manage live pages, shape draft content, and jump directly into editing or builder flows from a single premium workspace."
          primaryActionHref={`/admin/collections/pages/create?siteId=${encodeURIComponent(siteKey)}`}
          primaryActionLabel="Create New Page"
          stats={[
            { label: 'Publish Rate', value: `${publishRate}% live` },
            { label: 'This Week', value: `${recentResult.totalDocs} updated` },
            { label: 'Draft Queue', value: `${draftResult.totalDocs} pending` },
          ]}
          aside={
            <Card className="rounded-[24px] border-(--cms-card-border) bg-(--cms-bg)/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-(--cms-text)">
                  <Sparkles className="size-4 text-(--cms-primary)" />
                  <CardTitle className="text-sm font-semibold">Workspace Focus</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                    Current Priority
                  </p>
                  <p className="mt-1 text-sm leading-6 text-(--cms-text-secondary)">
                    {draftResult.totalDocs > 0
                      ? `${draftResult.totalDocs} draft pages are waiting for review before they can go live.`
                      : 'Your draft queue is clear. The next high-value move is expanding or refining live content.'}
                  </p>
                </div>
                <div className="rounded-2xl border border-(--cms-border) bg-(--cms-bg-muted) px-4 py-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                    Latest Activity
                  </p>
                  <p className="mt-1 text-sm font-medium text-(--cms-text)">
                    {newestPage?.title || 'No recent page yet'}
                  </p>
                  <p className="mt-1 text-xs text-(--cms-text-secondary)">
                    {newestPage?.updatedAt
                      ? `Updated ${formatRelativeTime(newestPage.updatedAt)}`
                      : 'Create a page to start building your site structure.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {summaryStats.map((stat) => (
            <WorkspaceMetricCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              detail={stat.detail}
              icon={stat.icon}
              tone={stat.tone}
            />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <Card className="rounded-[28px] border-(--cms-card-border)">
              <CardHeader className="gap-3 border-b border-(--cms-border-subtle) pb-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold tracking-[-0.03em] text-(--cms-text)">
                      Page Library
                    </CardTitle>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-(--cms-text-secondary)">
                      A stronger editorial view of every page in this site, with direct access to
                      edit and builder workflows.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-(--cms-border) bg-(--cms-bg-muted) px-4 py-3 text-sm text-(--cms-text-secondary)">
                    <span className="font-semibold text-(--cms-text)">{pages.length}</span> visible
                    items in this workspace
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                {pages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-(--cms-border) bg-(--cms-bg-muted) px-6 py-16 text-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-(--cms-card-bg) text-(--cms-primary)">
                      <FolderOpen className="size-6" />
                    </div>
                    <p className="mt-5 text-lg font-semibold tracking-[-0.02em] text-(--cms-text)">
                      No pages yet
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-6 text-(--cms-text-secondary)">
                      Start the workspace by creating a page. It will appear here with editing and
                      builder actions once saved.
                    </p>
                    <Link
                      href={`/admin/collections/pages/create?siteId=${encodeURIComponent(siteKey)}`}
                      className="mt-6"
                    >
                      <Button className="h-11 gap-2 rounded-2xl bg-(--cms-primary) px-5 text-sm font-semibold text-white hover:bg-(--cms-primary-hover)">
                        <Plus className="size-4" />
                        Create Page
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pages.map((page) => {
                      const status = page.status ?? 'draft'

                      return (
                        <WorkspaceResourceCard
                          key={String(page.id)}
                          title={page.title || 'Untitled'}
                          subtitle={`/${page.slug || ''}`}
                          href={`/admin/collections/pages/${page.id}`}
                          editHref={`/admin/collections/pages/${page.id}`}
                          builderHref={page.id ? `/admin/pages/${page.id}/builder` : undefined}
                          statusLabel={status}
                          statusTone={pageStatusTones[status] ?? 'neutral'}
                          icon={status === 'published' ? Eye : FileText}
                          meta={[
                            {
                              label: 'Updated',
                              value: formatRelativeTime(page.updatedAt),
                            },
                            {
                              label: 'State',
                              value: status.charAt(0).toUpperCase() + status.slice(1),
                            },
                            {
                              label: 'Builder',
                              value: page.id ? 'Ready' : 'Unavailable',
                            },
                          ]}
                        />
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="hidden xl:block">
            <div className="sticky top-6 space-y-4">
              <Card className="rounded-[24px] border-(--cms-card-border)">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-(--cms-text)">
                    <Activity className="size-4 text-(--cms-primary)" />
                    <CardTitle className="text-sm font-semibold">Insights</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl bg-(--cms-bg-muted) px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                      Live Coverage
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-(--cms-text)">
                      {publishRate}%
                    </p>
                    <p className="mt-1 text-sm leading-6 text-(--cms-text-secondary)">
                      {publishedResult.totalDocs} of {totalResult.totalDocs} pages are published.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3 rounded-2xl border border-(--cms-border) px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-(--cms-text)">Draft review queue</p>
                        <p className="mt-1 text-xs leading-5 text-(--cms-text-secondary)">
                          Keep momentum by finishing the next drafts in line.
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-(--cms-text)">
                        {draftResult.totalDocs}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3 rounded-2xl border border-(--cms-border) px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-(--cms-text)">Edited this week</p>
                        <p className="mt-1 text-xs leading-5 text-(--cms-text-secondary)">
                          Useful signal for current content velocity.
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-(--cms-text)">
                        {recentResult.totalDocs}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[24px] border-(--cms-card-border)">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link
                    href={`/admin/collections/pages/create?siteId=${encodeURIComponent(siteKey)}`}
                    className="flex items-center justify-between rounded-2xl border border-(--cms-border) px-4 py-3 text-sm font-medium text-(--cms-text) transition hover:border-(--cms-primary) hover:text-(--cms-primary)"
                  >
                    Create a new page
                    <Plus className="size-4" />
                  </Link>
                  {newestPage?.id ? (
                    <Link
                      href={`/admin/pages/${newestPage.id}/builder`}
                      className="flex items-center justify-between rounded-2xl border border-(--cms-border) px-4 py-3 text-sm font-medium text-(--cms-text) transition hover:border-(--cms-primary) hover:text-(--cms-primary)"
                    >
                      Open latest page in builder
                      <Hammer className="size-4" />
                    </Link>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
