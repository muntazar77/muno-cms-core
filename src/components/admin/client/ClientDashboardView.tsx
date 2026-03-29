import Link from 'next/link'
import type { DocumentViewServerProps } from 'payload'
import {
  FileText,
  Image as ImageIcon,
  Mail,
  Briefcase,
  Plus,
  Upload,
  Settings2,
  Eye,
  PenLine,
  Inbox,
  ArrowRight,
  Globe,
  Calendar,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getSiteDomain } from '@/lib/sites'

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
  siteDescription?: string | null
  domain?: string | null
  subdomain?: string | null
  status?: string | null
  updatedAt?: string | null
  createdAt?: string | null
}

/* ─── Helpers ─────────────────────────────────────────────────────── */

function formatDate(value?: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

const statusStyles: Record<string, string> = {
  active: 'bg-(--cms-success-soft) text-(--cms-success-text) border-(--cms-success-soft)',
  draft: 'bg-(--cms-warning-soft) text-(--cms-warning-text) border-(--cms-warning-soft)',
  maintenance: 'bg-(--cms-danger-soft) text-(--cms-danger-text) border-(--cms-danger-soft)',
}

const pageStatusStyles: Record<string, string> = {
  published: 'bg-(--cms-success-soft) text-(--cms-success-text)',
  draft: 'bg-(--cms-warning-soft) text-(--cms-warning-text)',
}

function notDeletedWhere() {
  return { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] }
}

/* ─── Component ───────────────────────────────────────────────────── */

export default async function ClientDashboardView(props: DocumentViewServerProps) {
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
  const siteDocId = String(site.id)
  const previewUrl = `/preview/${encodeURIComponent(siteKey)}`
  const siteWhere = { and: [{ siteId: { equals: siteKey } }, notDeletedWhere()] }

  // Fetch all stats in parallel
  const [
    pagesResult,
    publishedResult,
    draftResult,
    formsResult,
    submissionsResult,
    servicesResult,
    mediaResult,
    recentPagesResult,
  ] = await Promise.all([
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
        and: [{ siteId: { equals: siteKey } }, { status: { equals: 'draft' } }, notDeletedWhere()],
      },
    }),
    props.payload.find({
      collection: 'forms',
      depth: 0,
      limit: 0,
      user,
      overrideAccess: false,
      where: siteWhere,
    }),
    props.payload.find({
      collection: 'form-submissions',
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
      where: siteWhere,
    }),
    props.payload.find({
      collection: 'media',
      depth: 0,
      limit: 0,
      user,
      overrideAccess: false,
      where: siteWhere,
    }),
    props.payload.find({
      collection: 'pages',
      depth: 0,
      limit: 5,
      sort: '-updatedAt',
      user,
      overrideAccess: false,
      where: siteWhere,
    }),
  ])

  const stats = [
    {
      label: 'Total Pages',
      value: pagesResult.totalDocs,
      icon: FileText,
      color: 'bg-(--cms-primary-soft) text-(--cms-primary)',
    },
    {
      label: 'Published',
      value: publishedResult.totalDocs,
      icon: Eye,
      color: 'bg-(--cms-success-soft) text-(--cms-success-text)',
    },
    {
      label: 'Drafts',
      value: draftResult.totalDocs,
      icon: PenLine,
      color: 'bg-(--cms-warning-soft) text-(--cms-warning-text)',
    },
    {
      label: 'Forms',
      value: formsResult.totalDocs,
      icon: Mail,
      color: 'bg-(--cms-info-soft) text-(--cms-info-text)',
    },
    {
      label: 'Submissions',
      value: submissionsResult.totalDocs,
      icon: Inbox,
      color: 'bg-violet-50 text-violet-600',
    },
    {
      label: 'Services',
      value: servicesResult.totalDocs,
      icon: Briefcase,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Media',
      value: mediaResult.totalDocs,
      icon: ImageIcon,
      color: 'bg-rose-50 text-rose-600',
    },
  ]

  const recentPages = recentPagesResult.docs as unknown as Array<{
    id: string | number
    title?: string
    slug?: string
    status?: string
    updatedAt?: string
  }>

  const domain = getSiteDomain(site as Parameters<typeof getSiteDomain>[0])
  const siteStatus = site.status ?? 'draft'

  return (
    <div className="min-h-screen bg-(--cms-bg-elevated)">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="border-b border-(--cms-border-subtle) bg-(--cms-card-bg) px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-(--cms-text)">Dashboard</h1>
            <p className="mt-0.5 text-sm text-(--cms-text-secondary)">
              Overview of your website content and activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={previewUrl} target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="size-3.5" />
                Preview Site
              </Button>
            </Link>
            <Link href={`/admin/collections/sites/${siteDocId}/settings`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings2 className="size-3.5" />
                Site Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="space-y-6 p-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-(--cms-card-border)">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-lg',
                      stat.color,
                    )}
                  >
                    <stat.icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold leading-tight text-(--cms-text)">
                      {stat.value}
                    </p>
                    <p className="truncate text-xs text-(--cms-text-muted)">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Three-column cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Site Info ──────────────────────────────────────── */}
          <Card className="border-(--cms-card-border)">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-(--cms-text-muted)" />
                <CardTitle className="text-sm font-semibold text-(--cms-text)">Site Info</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-(--cms-text-secondary)">Name</span>
                <span className="text-sm font-medium text-(--cms-text)">
                  {site.siteName || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-(--cms-text-secondary)">Status</span>
                <Badge
                  className={cn(
                    'text-[11px] font-semibold',
                    statusStyles[siteStatus] ?? 'bg-(--cms-bg-muted) text-(--cms-text-secondary)',
                  )}
                >
                  {siteStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-(--cms-text-secondary)">Domain</span>
                <span className="max-w-45 truncate text-sm font-medium text-(--cms-text)">
                  {domain}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-(--cms-text-secondary)">Last Updated</span>
                <span className="text-xs text-(--cms-text-muted)">
                  {formatDate(site.updatedAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* ── Quick Actions ──────────────────────────────────── */}
          <Card className="border-(--cms-card-border)">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-(--cms-text)">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                {
                  label: 'New Page',
                  href: `/admin/collections/pages/create?siteId=${encodeURIComponent(siteKey)}`,
                  icon: Plus,
                },
                {
                  label: 'Upload Media',
                  href: `/admin/collections/media/create?siteId=${encodeURIComponent(siteKey)}`,
                  icon: Upload,
                },
                {
                  label: 'Edit Settings',
                  href: `/admin/collections/sites/${siteDocId}/settings`,
                  icon: Settings2,
                },
                {
                  label: 'View Forms',
                  href: `/admin/collections/sites/${siteDocId}/forms`,
                  icon: Inbox,
                },
              ].map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className="flex items-center gap-2.5 rounded-xl border border-(--cms-border) p-3 text-[13px] font-medium text-(--cms-text) transition hover:border-(--cms-primary) hover:bg-(--cms-primary-soft) hover:text-(--cms-primary-text)">
                    <action.icon className="size-4 shrink-0" />
                    <span className="truncate">{action.label}</span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* ── Recent Pages ───────────────────────────────────── */}
          <Card className="border-(--cms-card-border)">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-(--cms-text)">
                  Recent Pages
                </CardTitle>
                <Link
                  href={`/admin/collections/sites/${siteDocId}/pages`}
                  className="text-xs font-medium text-(--cms-primary) hover:underline"
                >
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentPages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="mb-2 size-8 text-(--cms-border)" />
                  <p className="text-sm text-(--cms-text-muted)">No pages yet</p>
                  <Link
                    href={`/admin/collections/pages/create?siteId=${encodeURIComponent(siteKey)}`}
                    className="mt-2 text-xs font-medium text-(--cms-primary) hover:underline"
                  >
                    Create your first page
                  </Link>
                </div>
              ) : (
                <div className="-mx-1 space-y-0.5">
                  {recentPages.map((page) => (
                    <Link
                      key={String(page.id)}
                      href={`/admin/collections/pages/${page.id}`}
                      className="flex items-center justify-between rounded-lg px-2 py-2.5 transition hover:bg-(--cms-bg-muted)"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-(--cms-text)">
                          {page.title || 'Untitled'}
                        </p>
                        <p className="text-xs text-(--cms-text-muted)">
                          /{page.slug || ''}{' '}
                          {page.updatedAt && (
                            <span className="ml-1 text-(--cms-text-muted)">
                              · {timeAgo(page.updatedAt)}
                            </span>
                          )}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          'ml-2 shrink-0 text-[10px]',
                          pageStatusStyles[page.status ?? 'draft'] ??
                            'bg-(--cms-bg-muted) text-(--cms-text-secondary)',
                        )}
                      >
                        {page.status || 'draft'}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Site Health / Checklist ────────────────────────────── */}
        <Card className="border-(--cms-card-border)">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-(--cms-text-muted)" />
              <CardTitle className="text-sm font-semibold text-(--cms-text)">
                Site Checklist
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: 'Pages created',
                  done: pagesResult.totalDocs > 0,
                  action: 'Create a page',
                  href: `/admin/collections/pages/create?siteId=${encodeURIComponent(siteKey)}`,
                },
                {
                  label: 'Media uploaded',
                  done: mediaResult.totalDocs > 0,
                  action: 'Upload media',
                  href: `/admin/collections/media/create?siteId=${encodeURIComponent(siteKey)}`,
                },
                {
                  label: 'Settings configured',
                  done: Boolean(site.siteName),
                  action: 'Edit settings',
                  href: `/admin/collections/sites/${siteDocId}/settings`,
                },
                {
                  label: 'Page published',
                  done: publishedResult.totalDocs > 0,
                  action: 'Publish a page',
                  href: `/admin/collections/sites/${siteDocId}/pages`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    'rounded-xl border p-4 transition',
                    item.done
                      ? 'border-(--cms-success-soft) bg-(--cms-success-soft)'
                      : 'border-(--cms-border) bg-(--cms-card-bg)',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'flex size-5 items-center justify-center rounded-full text-xs font-bold',
                        item.done
                          ? 'bg-(--cms-success) text-white'
                          : 'border-2 border-(--cms-border)',
                      )}
                    >
                      {item.done && '✓'}
                    </div>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        item.done ? 'text-(--cms-success-text)' : 'text-(--cms-text)',
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                  {!item.done && (
                    <Link
                      href={item.href}
                      className="mt-2 inline-block text-xs font-medium text-(--cms-primary) hover:underline"
                    >
                      {item.action} →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
