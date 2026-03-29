import Link from 'next/link'
import type { DocumentViewServerProps } from 'payload'
import {
  FileText,
  Plus,
  Eye,
  PenLine,
  Clock,
  MoreHorizontal,
  ExternalLink,
  Hammer,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

const pageStatusStyles: Record<string, string> = {
  published: 'bg-(--cms-success-soft) text-(--cms-success-text)',
  draft: 'bg-(--cms-warning-soft) text-(--cms-warning-text)',
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
  const siteDocId = String(site.id)
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
      label: 'Total',
      value: totalResult.totalDocs,
      icon: FileText,
      color: 'text-(--cms-primary)',
      bg: 'bg-(--cms-primary-soft)',
    },
    {
      label: 'Published',
      value: publishedResult.totalDocs,
      icon: Eye,
      color: 'text-(--cms-success-text)',
      bg: 'bg-(--cms-success-soft)',
    },
    {
      label: 'Drafts',
      value: draftResult.totalDocs,
      icon: PenLine,
      color: 'text-(--cms-warning-text)',
      bg: 'bg-(--cms-warning-soft)',
    },
    {
      label: 'Recently Updated',
      value: recentResult.totalDocs,
      icon: Clock,
      color: 'text-(--cms-info-text)',
      bg: 'bg-(--cms-info-soft)',
    },
  ]

  const pages = allPagesResult.docs as unknown as PageDoc[]

  return (
    <div className="min-h-screen bg-(--cms-bg-elevated)">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="border-b border-(--cms-border-subtle) bg-(--cms-card-bg) px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-(--cms-text)">Pages</h1>
            <p className="mt-0.5 text-sm text-(--cms-text-secondary)">
              Create and manage your website pages
            </p>
          </div>
          <Link href={`/admin/collections/pages/create?siteId=${encodeURIComponent(siteKey)}`}>
            <Button
              size="sm"
              className="gap-2 bg-(--cms-primary) text-white hover:bg-(--cms-primary-hover)"
            >
              <Plus className="size-3.5" />
              New Page
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* ── Summary Cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {summaryStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl border border-(--cms-card-border) bg-(--cms-card-bg) p-4"
            >
              <div
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-lg',
                  stat.bg,
                )}
              >
                <stat.icon className={cn('size-4', stat.color)} />
              </div>
              <div>
                <p className="text-xl font-bold leading-tight text-(--cms-text)">{stat.value}</p>
                <p className="text-xs text-(--cms-text-muted)">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pages List ────────────────────────────────────────── */}
        {pages.length === 0 ? (
          <Card className="border-(--cms-card-border)">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="mb-3 size-10 text-(--cms-border)" />
              <p className="text-sm font-medium text-(--cms-text)">No pages yet</p>
              <p className="mt-1 text-sm text-(--cms-text-muted)">
                Get started by creating your first page.
              </p>
              <Link
                href={`/admin/collections/pages/create?siteId=${encodeURIComponent(siteKey)}`}
                className="mt-4"
              >
                <Button
                  size="sm"
                  className="gap-2 bg-(--cms-primary) text-white hover:bg-(--cms-primary-hover)"
                >
                  <Plus className="size-3.5" />
                  Create Page
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden border-(--cms-card-border)">
            <div className="divide-y divide-(--cms-border-subtle)">
              {pages.map((page) => {
                const status = page.status ?? 'draft'
                const hasBuilder = Boolean(page.id)

                return (
                  <div
                    key={String(page.id)}
                    className="group flex items-center gap-4 px-5 py-4 transition hover:bg-(--cms-bg-muted)"
                  >
                    {/* Status indicator */}
                    <div
                      className={cn(
                        'size-2 shrink-0 rounded-full',
                        status === 'published' ? 'bg-(--cms-success)' : 'bg-(--cms-warning)',
                      )}
                    />

                    {/* Page info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/collections/pages/${page.id}`}
                          className="truncate text-sm font-medium text-(--cms-text) hover:text-(--cms-primary)"
                        >
                          {page.title || 'Untitled'}
                        </Link>
                        <Badge
                          className={cn(
                            'shrink-0 text-[10px] font-medium',
                            pageStatusStyles[status] ??
                              'bg-(--cms-bg-muted) text-(--cms-text-secondary)',
                          )}
                        >
                          {status}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-(--cms-text-muted)">/{page.slug || ''}</p>
                    </div>

                    {/* Updated time */}
                    <span className="hidden shrink-0 text-xs text-(--cms-text-muted) sm:inline">
                      {formatRelativeTime(page.updatedAt)}
                    </span>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
                      <Link
                        href={`/admin/collections/pages/${page.id}`}
                        className="flex size-8 items-center justify-center rounded-lg text-(--cms-text-muted) transition hover:bg-(--cms-bg) hover:text-(--cms-text)"
                        title="Edit page"
                      >
                        <PenLine className="size-3.5" />
                      </Link>
                      {hasBuilder && (
                        <Link
                          href={`/admin/pages/${page.id}/builder`}
                          className="flex size-8 items-center justify-center rounded-lg text-(--cms-text-muted) transition hover:bg-(--cms-bg) hover:text-(--cms-primary)"
                          title="Open Page Builder"
                        >
                          <Hammer className="size-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
