import Link from 'next/link'
import type { DocumentViewServerProps } from 'payload'
import { Mail, Plus, Inbox, LayoutList, Clock, FolderOpen, Activity, Sparkles } from 'lucide-react'
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

interface FormDoc {
  id: string | number
  title?: string | null
  fields?: Array<unknown> | null
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

export default async function ClientFormsView(props: DocumentViewServerProps) {
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

  const [totalResult, submissionsResult, newThisWeekResult, allResult] = await Promise.all([
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
      collection: 'forms',
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
      collection: 'forms',
      depth: 1,
      limit: 100,
      sort: '-updatedAt',
      user,
      overrideAccess: false,
      where: siteWhere,
    }),
  ])

  const forms = allResult.docs as unknown as FormDoc[]
  const newestForm = forms[0]

  const summaryStats = [
    {
      label: 'Total Forms',
      value: totalResult.totalDocs,
      icon: Mail,
      tone: 'primary' as const,
      detail: 'All forms configured for this site.',
    },
    {
      label: 'Total Submissions',
      value: submissionsResult.totalDocs,
      icon: Inbox,
      tone: 'success' as const,
      detail: 'All form responses received for this site.',
    },
    {
      label: 'New This Week',
      value: newThisWeekResult.totalDocs,
      icon: Clock,
      tone: 'info' as const,
      detail: 'New forms created in the last seven days.',
    },
    {
      label: 'Avg Fields',
      value:
        forms.length > 0
          ? Math.round(
              forms.reduce((sum, f) => sum + (Array.isArray(f.fields) ? f.fields.length : 0), 0) /
                forms.length,
            )
          : 0,
      icon: LayoutList,
      tone: 'warning' as const,
      detail: 'Average number of fields per form.',
    },
  ]

  return (
    <div className="min-h-screen bg-(--cms-bg-elevated)">
      <div className="mx-auto w-full max-w-[1680px] space-y-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
        <WorkspaceHeader
          eyebrow={site.siteName || siteKey}
          title="Forms Workspace"
          description="Build and manage contact, intake, and conversion forms. Each form is scoped to this site and collects structured submissions."
          primaryActionHref={`/admin/collections/forms/create?siteId=${encodeURIComponent(siteKey)}`}
          primaryActionLabel="Create Form"
          stats={[
            { label: 'Total Forms', value: `${totalResult.totalDocs} forms` },
            { label: 'Submissions', value: `${submissionsResult.totalDocs} total` },
            { label: 'New This Week', value: `${newThisWeekResult.totalDocs} added` },
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
                    Submission Activity
                  </p>
                  <p className="mt-1 text-sm leading-6 text-(--cms-text-secondary)">
                    {submissionsResult.totalDocs > 0
                      ? `You have ${submissionsResult.totalDocs} submission${submissionsResult.totalDocs === 1 ? '' : 's'} across all forms on this site.`
                      : 'No form submissions yet. Share your forms to start receiving responses.'}
                  </p>
                </div>
                <div className="rounded-2xl border border-(--cms-border) bg-(--cms-bg-muted) px-4 py-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                    Latest Form
                  </p>
                  <p className="mt-1 text-sm font-medium text-(--cms-text)">
                    {newestForm?.title || 'No forms yet'}
                  </p>
                  <p className="mt-1 text-xs text-(--cms-text-secondary)">
                    {newestForm?.updatedAt
                      ? `Updated ${formatRelativeTime(newestForm.updatedAt)}`
                      : 'Create a form to start collecting responses.'}
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
                      Form Library
                    </CardTitle>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-(--cms-text-secondary)">
                      All forms for this site. Click a form to edit its fields or view submissions.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-(--cms-border) bg-(--cms-bg-muted) px-4 py-3 text-sm text-(--cms-text-secondary)">
                    <span className="font-semibold text-(--cms-text)">{forms.length}</span> visible
                    items
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                {forms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-(--cms-border) bg-(--cms-bg-muted) px-6 py-16 text-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-(--cms-card-bg) text-(--cms-primary)">
                      <FolderOpen className="size-6" />
                    </div>
                    <p className="mt-5 text-lg font-semibold tracking-[-0.02em] text-(--cms-text)">
                      No forms yet
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-6 text-(--cms-text-secondary)">
                      Create your first form to start capturing contact requests, inquiries, or
                      applications.
                    </p>
                    <Link
                      href={`/admin/collections/forms/create?siteId=${encodeURIComponent(siteKey)}`}
                      className="mt-6"
                    >
                      <Button className="h-11 gap-2 rounded-2xl bg-(--cms-primary) px-5 text-sm font-semibold text-white hover:bg-(--cms-primary-hover)">
                        <Plus className="size-4" />
                        Create Form
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {forms.map((form) => {
                      const fieldCount = Array.isArray(form.fields) ? form.fields.length : 0

                      return (
                        <WorkspaceResourceCard
                          key={String(form.id)}
                          title={form.title || 'Untitled'}
                          subtitle={`${fieldCount} field${fieldCount === 1 ? '' : 's'}`}
                          href={`/admin/collections/forms/${form.id}`}
                          editHref={`/admin/collections/forms/${form.id}`}
                          statusLabel="Form"
                          statusTone="neutral"
                          icon={Mail}
                          deleteCollection="forms"
                          deleteDocId={String(form.id)}
                          meta={[
                            {
                              label: 'Updated',
                              value: formatRelativeTime(form.updatedAt),
                            },
                            {
                              label: 'Created',
                              value: formatRelativeTime(form.createdAt),
                            },
                            {
                              label: 'Fields',
                              value: String(fieldCount),
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
                    <CardTitle className="text-sm font-semibold">Submission Insights</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-(--cms-border) bg-(--cms-bg-muted) px-4 py-3.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                      Total Responses
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-(--cms-text)">
                      {submissionsResult.totalDocs}
                    </p>
                    <p className="mt-1 text-xs text-(--cms-text-secondary)">
                      form submissions received across all forms
                    </p>
                  </div>
                  <div className="rounded-2xl border border-(--cms-border) bg-(--cms-bg-muted) px-4 py-3.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                      Avg Fields Per Form
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-(--cms-text)">
                      {forms.length > 0
                        ? Math.round(
                            forms.reduce(
                              (sum, f) => sum + (Array.isArray(f.fields) ? f.fields.length : 0),
                              0,
                            ) / forms.length,
                          )
                        : '—'}
                    </p>
                    <p className="mt-1 text-xs text-(--cms-text-secondary)">
                      fields configured per form on average
                    </p>
                  </div>
                  {/* <Link
                    href={`/admin/collections/forms/create?siteId=${encodeURIComponent(siteKey)}`}
                  >
                    <Button className="mt-2 h-10 w-full gap-2 rounded-2xl bg-(--cms-primary) text-sm font-semibold text-white hover:bg-(--cms-primary-hover)">
                      <Plus className="size-4" />
                      Create Form
                    </Button>
                  </Link> */}
                </CardContent>
              </Card>

              <Card className="rounded-[24px] border-(--cms-card-border)">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-(--cms-text)">
                    <Inbox className="size-4 text-(--cms-primary)" />
                    <CardTitle className="text-sm font-semibold">View All Submissions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-(--cms-text-secondary)">
                    Access individual submission data via the form submissions collection.
                  </p>
                  <Link
                    href={`/admin/collections/form-submissions?where[siteId][equals]=${encodeURIComponent(siteKey)}`}
                    className="mt-4 inline-flex"
                  >
                    <Button
                      variant="outline"
                      className="h-10 w-full gap-2 rounded-2xl border-(--cms-border) text-sm font-medium text-(--cms-text-secondary)"
                    >
                      Open Submissions
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
