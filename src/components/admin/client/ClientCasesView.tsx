import Link from 'next/link'
import type { DocumentViewServerProps } from 'payload'
import { ArrowUpRight, Briefcase, CalendarClock, Plus, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import WorkspaceHeader from '@/components/admin/shared/WorkspaceHeader'
import WorkspaceMetricCard from '@/components/admin/shared/WorkspaceMetricCard'

interface UserWithSite {
  id?: string | number
  role?: string
  email?: string
  siteId?: string
}

interface SiteDoc {
  id: string | number
  siteId?: string | null
  siteName?: string | null
}

interface CaseDoc {
  id: string | number
  fullName?: string | null
  email?: string | null
  currentStage?: string | null
  status?: string | null
  priority?: string | null
  nextActionDate?: string | null
}

function notDeletedWhere() {
  return { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] }
}

function pretty(value?: string | null): string {
  if (!value) return '—'
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatDate(value?: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function ClientCasesView(props: DocumentViewServerProps) {
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

  const [totalResult, waitingResult, activeResult, listResult] = await Promise.all([
    props.payload.find({
      collection: 'student-cases',
      depth: 0,
      limit: 0,
      user,
      overrideAccess: false,
      where: siteWhere,
    }),
    props.payload.find({
      collection: 'student-cases',
      depth: 0,
      limit: 0,
      user,
      overrideAccess: false,
      where: {
        and: [
          { siteId: { equals: siteKey } },
          { status: { in: ['waiting-student', 'waiting-institution'] } },
          notDeletedWhere(),
        ],
      },
    }),
    props.payload.find({
      collection: 'student-cases',
      depth: 0,
      limit: 0,
      user,
      overrideAccess: false,
      where: {
        and: [
          { siteId: { equals: siteKey } },
          { status: { in: ['new', 'in-progress'] } },
          notDeletedWhere(),
        ],
      },
    }),
    props.payload.find({
      collection: 'student-cases',
      depth: 0,
      sort: '-updatedAt',
      limit: 50,
      user,
      overrideAccess: false,
      where: siteWhere,
    }),
  ])

  const cases = listResult.docs as unknown as CaseDoc[]

  return (
    <div className="min-h-screen bg-(--cms-bg-elevated)">
      <div className="mx-auto w-full max-w-420 space-y-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
        <WorkspaceHeader
          eyebrow={site.siteName || siteKey}
          title="Student Cases"
          description="Track student journey from first inquiry to successful enrollment with clear stage and action ownership."
          primaryActionHref={`/admin/collections/student-cases/create?siteId=${encodeURIComponent(siteKey)}`}
          primaryActionLabel="Create Case"
          stats={[
            { label: 'Total', value: `${totalResult.totalDocs} cases` },
            { label: 'Active', value: `${activeResult.totalDocs}` },
            { label: 'Waiting', value: `${waitingResult.totalDocs}` },
          ]}
          aside={
            <Card className="rounded-3xl border-(--cms-card-border)">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-(--cms-text)">Operations Focus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-(--cms-text-secondary)">
                <p className="inline-flex items-center gap-2">
                  <Sparkles className="size-4 text-(--cms-primary)" />
                  Keep next actions assigned and dated for every active case.
                </p>
              </CardContent>
            </Card>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <WorkspaceMetricCard
            label="Total Cases"
            value={totalResult.totalDocs}
            icon={Briefcase}
            tone="primary"
            detail="All active cases for this site"
          />
          <WorkspaceMetricCard
            label="Active"
            value={activeResult.totalDocs}
            icon={Sparkles}
            tone="success"
            detail="New + in-progress cases"
          />
          <WorkspaceMetricCard
            label="Waiting"
            value={waitingResult.totalDocs}
            icon={CalendarClock}
            tone="warning"
            detail="Blocked cases requiring follow-up"
          />
        </div>

        <Card className="rounded-[26px] border-(--cms-card-border)">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="text-lg text-(--cms-text)">Recent Cases</CardTitle>
            <Link href="/admin/collections/student-cases">
              <Button variant="outline" className="rounded-xl">
                View Full Pipeline
                <ArrowUpRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {cases.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-(--cms-border) bg-(--cms-bg-muted) p-8 text-center">
                <p className="text-base font-semibold text-(--cms-text)">No cases yet</p>
                <p className="mt-2 text-sm text-(--cms-text-secondary)">
                  Convert form submissions into student cases to start tracking workflow.
                </p>
                <Link
                  href={`/admin/collections/student-cases/create?siteId=${encodeURIComponent(siteKey)}`}
                  className="mt-4 inline-block"
                >
                  <Button className="rounded-xl">
                    <Plus className="mr-2 size-4" />
                    Create First Case
                  </Button>
                </Link>
              </div>
            ) : (
              cases.map((item) => (
                <Link
                  key={String(item.id)}
                  href={`/admin/collections/student-cases/${String(item.id)}/workspace`}
                  className="group block rounded-2xl border border-(--cms-border) bg-(--cms-bg-muted) p-4 transition hover:-translate-y-0.5 hover:border-(--cms-primary)"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-(--cms-text)">{item.fullName || 'Untitled Case'}</p>
                      <p className="mt-0.5 text-xs text-(--cms-text-secondary)">{item.email || '—'}</p>
                    </div>
                    <div className="text-xs text-(--cms-text-secondary)">
                      {pretty(item.currentStage)} • {pretty(item.status)} • {pretty(item.priority)}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-(--cms-text-muted)">
                    Next action date: {formatDate(item.nextActionDate)}
                  </p>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
