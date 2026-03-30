import Link from 'next/link'
import type { DocumentViewServerProps } from 'payload'
import {
  Briefcase,
  Plus,
  Image as ImageIcon,
  Clock,
  FolderOpen,
  Activity,
  Sparkles,
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

interface ServiceDoc {
  id: string | number
  title?: string | null
  slug?: string | null
  featuredImage?: number | { id?: number | string } | null
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

/* ─── Component ───────────────────────────────────────────────────── */

export default async function ClientServicesView(props: DocumentViewServerProps) {
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
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400_000).toISOString()

  const [totalResult, withImageResult, recentResult, newThisWeekResult, allResult] =
    await Promise.all([
      props.payload.find({
        collection: 'services',
        depth: 0,
        limit: 0,
        user,
        overrideAccess: false,
        where: siteWhere,
      }),
      props.payload.find({
        collection: 'services',
        depth: 0,
        limit: 0,
        user,
        overrideAccess: false,
        where: {
          and: [
            { siteId: { equals: siteKey } },
            { featuredImage: { exists: true } },
            notDeletedWhere(),
          ],
        },
      }),
      props.payload.find({
        collection: 'services',
        depth: 0,
        limit: 0,
        user,
        overrideAccess: false,
        where: {
          and: [
            { siteId: { equals: siteKey } },
            { updatedAt: { greater_than: sevenDaysAgo } },
            notDeletedWhere(),
          ],
        },
      }),
      props.payload.find({
        collection: 'services',
        depth: 0,
        limit: 0,
        user,
        overrideAccess: false,
        where: {
          and: [
            { siteId: { equals: siteKey } },
            { createdAt: { greater_than: sevenDaysAgo } },
            notDeletedWhere(),
          ],
        },
      }),
      props.payload.find({
        collection: 'services',
        depth: 0,
        limit: 100,
        sort: '-updatedAt',
        user,
        overrideAccess: false,
        where: siteWhere,
      }),
    ])

  const services = allResult.docs as unknown as ServiceDoc[]
  const newestService = services[0]

  const summaryStats = [
    {
      label: 'Total Services',
      value: totalResult.totalDocs,
      icon: Briefcase,
      tone: 'primary' as const,
      detail: 'All service catalog entries in this site.',
    },
    {
      label: 'With Images',
      value: withImageResult.totalDocs,
      icon: ImageIcon,
      tone: 'success' as const,
      detail: 'Services with a featured image attached.',
    },
    {
      label: 'Updated This Week',
      value: recentResult.totalDocs,
      icon: Clock,
      tone: 'info' as const,
      detail: 'Services modified in the last seven days.',
    },
    {
      label: 'New This Week',
      value: newThisWeekResult.totalDocs,
      icon: Activity,
      tone: 'warning' as const,
      detail: 'New services added in the last seven days.',
    },
  ]

  return (
    <div className="min-h-screen bg-(--cms-bg-elevated)">
      <div className="mx-auto w-full max-w-[1680px] space-y-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
        <WorkspaceHeader
          eyebrow={site.siteName || siteKey}
          title="Services Workspace"
          description="Manage and curate your service catalog. Each entry represents a distinct offering tied to this site."
          primaryActionHref={`/admin/collections/services/create?siteId=${encodeURIComponent(siteKey)}`}
          primaryActionLabel="Add Service"
          stats={[
            { label: 'Total', value: `${totalResult.totalDocs} services` },
            { label: 'This Week', value: `${recentResult.totalDocs} updated` },
            { label: 'New Entries', value: `${newThisWeekResult.totalDocs} added` },
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
                    Catalog Health
                  </p>
                  <p className="mt-1 text-sm leading-6 text-(--cms-text-secondary)">
                    {withImageResult.totalDocs < totalResult.totalDocs
                      ? `${totalResult.totalDocs - withImageResult.totalDocs} service${totalResult.totalDocs - withImageResult.totalDocs === 1 ? '' : 's'} missing a featured image. Adding visuals improves presentation quality.`
                      : 'All services have a featured image. Your catalog looks complete.'}
                  </p>
                </div>
                <div className="rounded-2xl border border-(--cms-border) bg-(--cms-bg-muted) px-4 py-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                    Latest Entry
                  </p>
                  <p className="mt-1 text-sm font-medium text-(--cms-text)">
                    {newestService?.title || 'No services yet'}
                  </p>
                  <p className="mt-1 text-xs text-(--cms-text-secondary)">
                    {newestService?.updatedAt
                      ? `Updated ${formatRelativeTime(newestService.updatedAt)}`
                      : 'Create a service to start building your catalog.'}
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
                      Service Catalog
                    </CardTitle>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-(--cms-text-secondary)">
                      All service entries for this site workspace, sorted by most recently updated.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-(--cms-border) bg-(--cms-bg-muted) px-4 py-3 text-sm text-(--cms-text-secondary)">
                    <span className="font-semibold text-(--cms-text)">{services.length}</span>{' '}
                    visible items
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                {services.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-(--cms-border) bg-(--cms-bg-muted) px-6 py-16 text-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-(--cms-card-bg) text-(--cms-primary)">
                      <FolderOpen className="size-6" />
                    </div>
                    <p className="mt-5 text-lg font-semibold tracking-[-0.02em] text-(--cms-text)">
                      No services yet
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-6 text-(--cms-text-secondary)">
                      Add your first service to start building the catalog for this site.
                    </p>
                    <Link
                      href={`/admin/collections/services/create?siteId=${encodeURIComponent(siteKey)}`}
                      className="mt-6"
                    >
                      <Button className="h-11 gap-2 rounded-2xl bg-(--cms-primary) px-5 text-sm font-semibold text-white hover:bg-(--cms-primary-hover)">
                        <Plus className="size-4" />
                        Add Service
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <WorkspaceResourceCard
                        key={String(service.id)}
                        title={service.title || 'Untitled'}
                        subtitle={service.slug ? `/${service.slug}` : '—'}
                        href={`/admin/collections/services/${service.id}`}
                        editHref={`/admin/collections/services/${service.id}`}
                        statusLabel="Service"
                        statusTone="neutral"
                        icon={Briefcase}
                        deleteCollection="services"
                        deleteDocId={String(service.id)}
                        meta={[
                          {
                            label: 'Updated',
                            value: formatRelativeTime(service.updatedAt),
                          },
                          {
                            label: 'Created',
                            value: formatRelativeTime(service.createdAt),
                          },
                          {
                            label: 'Image',
                            value: service.featuredImage ? 'Attached' : 'None',
                          },
                        ]}
                      />
                    ))}
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
                    <CardTitle className="text-sm font-semibold">Catalog Insights</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-(--cms-border) bg-(--cms-bg-muted) px-4 py-3.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                      Image Coverage
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-[-0.02em] text-(--cms-text)">
                      {totalResult.totalDocs > 0
                        ? `${Math.round((withImageResult.totalDocs / totalResult.totalDocs) * 100)}%`
                        : '—'}
                    </p>
                    <p className="mt-1 text-xs text-(--cms-text-secondary)">
                      of services have a featured image
                    </p>
                  </div>
                  <div className="rounded-2xl border border-(--cms-border) bg-(--cms-bg-muted) px-4 py-3.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                      Weekly Velocity
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-[-0.02em] text-(--cms-text)">
                      {recentResult.totalDocs}
                    </p>
                    <p className="mt-1 text-xs text-(--cms-text-secondary)">
                      services updated in the last 7 days
                    </p>
                  </div>
                  {/* <Link
                    href={`/admin/collections/services/create?siteId=${encodeURIComponent(siteKey)}`}
                  >
                    <Button className="mt-2 h-10 w-full gap-2 rounded-2xl bg-(--cms-primary) text-sm font-semibold text-white hover:bg-(--cms-primary-hover)">
                      <Plus className="size-4" />
                      Add Service
                    </Button>
                  </Link> */}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
