import Link from 'next/link'
import type { DocumentViewServerProps } from 'payload'
import {
  Calendar,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Image as ImageIcon,
  Inbox,
  Mail,
  PenLine,
  Plus,
  Settings2,
  Upload,
  Briefcase,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getSiteDomain } from '@/lib/sites'
import {
  DashboardActivityList,
  DashboardChecklistCard,
  DashboardGrid,
  DashboardHeader,
  DashboardInfoCard,
  DashboardPageShell,
  DashboardQuickActions,
  DashboardSection,
  DashboardStatsRow,
  EmptyState,
  type DashboardActivityItem,
  type DashboardChecklistItem,
  type DashboardQuickActionItem,
  type DashboardStatItem,
} from '@/components/admin/dashboard/primitives'

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

  const [
    pagesResult,
    publishedResult,
    draftResult,
    formsResult,
    submissionsResult,
    servicesResult,
    mediaResult,
    recentPagesResult,
    recentSubmissionsResult,
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
    props.payload.find({
      collection: 'form-submissions',
      depth: 0,
      limit: 5,
      sort: '-createdAt',
      user,
      overrideAccess: false,
      where: siteWhere,
    }),
  ])

  const stats: DashboardStatItem[] = [
    {
      label: 'Total Pages',
      value: pagesResult.totalDocs,
      icon: FileText,
      tone: 'primary',
      description: 'All site pages',
    },
    {
      label: 'Published',
      value: publishedResult.totalDocs,
      icon: Eye,
      tone: 'success',
      description: 'Live content',
    },
    {
      label: 'Drafts',
      value: draftResult.totalDocs,
      icon: PenLine,
      tone: 'warning',
      description: 'Work in progress',
    },
    {
      label: 'Media Files',
      value: mediaResult.totalDocs,
      icon: ImageIcon,
      tone: 'info',
      description: 'Uploaded assets',
    },
    {
      label: 'Forms',
      value: formsResult.totalDocs,
      icon: Mail,
      tone: 'neutral',
      description: 'Lead capture forms',
    },
    {
      label: 'Submissions',
      value: submissionsResult.totalDocs,
      icon: Inbox,
      tone: 'danger',
      description: 'Captured responses',
    },
    {
      label: 'Services',
      value: servicesResult.totalDocs,
      icon: Briefcase,
      tone: 'neutral',
      description: 'Service listings',
    },
  ]

  const recentPages = recentPagesResult.docs as unknown as Array<{
    id: string | number
    title?: string
    slug?: string
    status?: string
    updatedAt?: string
  }>

  const recentSubmissionItems: DashboardActivityItem[] = recentSubmissionsResult.docs.map((doc) => {
    const submission = doc as unknown as {
      id: string | number
      createdAt?: string
      form?: string | { title?: string }
      siteId?: string
    }

    const formLabel =
      typeof submission.form === 'object' && submission.form?.title
        ? submission.form.title
        : typeof submission.form === 'string'
          ? submission.form
          : 'Form submission'

    return {
      id: String(submission.id),
      title: formLabel,
      subtitle: `Site: ${submission.siteId ?? siteKey}`,
      time: submission.createdAt ?? new Date().toISOString(),
      icon: Inbox,
      tone: 'info',
      href: `/admin/collections/form-submissions/${submission.id}`,
    }
  })

  const domain = getSiteDomain(site as Parameters<typeof getSiteDomain>[0])
  const siteStatus = site.status ?? 'draft'

  const quickActions: DashboardQuickActionItem[] = [
    {
      label: 'Create New Page',
      description: 'Start a fresh page draft',
      href: `/admin/collections/pages/create?siteId=${encodeURIComponent(siteKey)}`,
      icon: Plus,
    },
    {
      label: 'Upload Media',
      description: 'Add images and files',
      href: `/admin/collections/media/create?siteId=${encodeURIComponent(siteKey)}`,
      icon: Upload,
    },
    {
      label: 'Edit Site Settings',
      description: 'Branding, domain and SEO',
      href: `/admin/collections/sites/${siteDocId}/settings`,
      icon: Settings2,
    },
    {
      label: 'View Forms',
      description: 'Manage forms and responses',
      href: `/admin/collections/sites/${siteDocId}/forms`,
      icon: Inbox,
    },
    {
      label: 'Preview Site',
      description: 'Open public preview',
      href: previewUrl,
      icon: ExternalLink,
    },
  ]

  const checklistItems: DashboardChecklistItem[] = [
    {
      id: 'pages-created',
      label: 'Pages created',
      done: pagesResult.totalDocs > 0,
      actionLabel: 'Create a page',
      actionHref: `/admin/collections/pages/create?siteId=${encodeURIComponent(siteKey)}`,
    },
    {
      id: 'media-uploaded',
      label: 'Media uploaded',
      done: mediaResult.totalDocs > 0,
      actionLabel: 'Upload media',
      actionHref: `/admin/collections/media/create?siteId=${encodeURIComponent(siteKey)}`,
    },
    {
      id: 'settings-configured',
      label: 'Settings configured',
      done: Boolean(site.siteName),
      actionLabel: 'Edit settings',
      actionHref: `/admin/collections/sites/${siteDocId}/settings`,
    },
    {
      id: 'page-published',
      label: 'Page published',
      done: publishedResult.totalDocs > 0,
      actionLabel: 'Publish a page',
      actionHref: `/admin/collections/sites/${siteDocId}/pages`,
    },
  ]

  return (
    <DashboardPageShell>
      <DashboardHeader
        title="Website Dashboard"
        subtitle="Manage your site content, leads, and publishing workflow from one place"
        meta={site.siteName ?? siteKey}
        icon={
          <div
            className="flex size-12 items-center justify-center rounded-2xl text-white shadow-sm"
            style={{
              background: 'linear-gradient(135deg, var(--cms-primary), var(--cms-primary-hover))',
            }}
          >
            <Globe className="size-5" />
          </div>
        }
        actions={
          <>
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
          </>
        }
      />

      <div className="space-y-6 p-4 sm:p-6">
        <DashboardSection>
          <DashboardStatsRow
            items={stats}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-7"
          />
        </DashboardSection>

        <DashboardGrid>
          <DashboardSection title="Site overview" className="lg:col-span-1">
            <DashboardInfoCard
              title="Site info"
              icon={<Globe className="size-4 text-(--cms-text-muted)" />}
              rows={[
                { label: 'Name', value: site.siteName || '—' },
                { label: 'Domain', value: domain },
                { label: 'Last Updated', value: formatDate(site.updatedAt) },
                { label: 'Status', value: siteStatus },
              ]}
            />
            <div className="px-6 pb-5 -mt-4">
              <Badge
                className={cn(
                  'text-[11px] font-semibold',
                  statusStyles[siteStatus] ?? 'bg-(--cms-bg-muted) text-(--cms-text-secondary)',
                )}
              >
                {siteStatus}
              </Badge>
            </div>
          </DashboardSection>

          <DashboardSection title="Quick actions" className="lg:col-span-1">
            <DashboardQuickActions items={quickActions} columnsClassName="grid grid-cols-1 gap-2" />
          </DashboardSection>

          <DashboardSection
            title="Recent submissions"
            description="Latest form entries for your site"
            className="lg:col-span-1"
          >
            <Card className="border-(--cms-card-border)">
              <CardContent className="pt-6">
                <DashboardActivityList
                  items={recentSubmissionItems}
                  emptyTitle="No submissions yet"
                  emptyDescription="Submissions will appear here once your forms receive responses."
                />
              </CardContent>
            </Card>
          </DashboardSection>
        </DashboardGrid>

        <DashboardGrid className="grid gap-6 lg:grid-cols-3">
          <DashboardSection
            className="lg:col-span-2"
            title="Recent pages"
            description="Most recently edited pages"
            aside={
              <Link
                href={`/admin/collections/sites/${siteDocId}/pages`}
                className="text-xs font-medium text-(--cms-primary) hover:underline"
              >
                View all
              </Link>
            }
          >
            <Card className="border-(--cms-card-border)">
              <CardContent className="pt-6">
                {recentPages.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="No pages yet"
                    description="Create your first page to start building your site."
                    actionLabel="Create your first page"
                    actionHref={`/admin/collections/pages/create?siteId=${encodeURIComponent(siteKey)}`}
                  />
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
          </DashboardSection>

          <DashboardSection className="lg:col-span-1">
            <DashboardChecklistCard title="Site checklist" items={checklistItems} />
          </DashboardSection>
        </DashboardGrid>

        <DashboardSection
          title="Publishing momentum"
          description="Keep your site active and conversion-ready"
        >
          <Card className="border-(--cms-card-border)">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-(--cms-text-muted)" />
                <CardTitle className="text-sm font-semibold text-(--cms-text)">
                  Weekly focus
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-(--cms-text-secondary)">
                Publish at least one page update, respond to new submissions, and review your media
                library to keep your website fresh and effective.
              </p>
            </CardContent>
          </Card>
        </DashboardSection>
      </div>
    </DashboardPageShell>
  )
}
