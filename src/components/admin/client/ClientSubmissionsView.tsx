import { Inbox, Clock3, Sparkles, Mail, FormInput } from 'lucide-react'
import type { DocumentViewServerProps } from 'payload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import WorkspaceHeader from '@/components/admin/shared/WorkspaceHeader'
import WorkspaceMetricCard from '@/components/admin/shared/WorkspaceMetricCard'
import ClientSubmissionsPanel, { type SubmissionListItem } from './ClientSubmissionsPanel'
import { extractStudentCaseSeed } from '@/lib/studentCases'

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

interface SubmissionDoc {
  id: string | number
  form?: number | string | { id?: number | string; title?: string | null } | null
  data?: unknown
  createdAt?: string | null
  siteId?: string | null
}

function notDeletedWhere() {
  return { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] }
}

function isNewSubmission(value?: string | null): boolean {
  if (!value) return false
  const created = new Date(value).getTime()
  if (isNaN(created)) return false
  return Date.now() - created < 24 * 60 * 60 * 1000
}

export default async function ClientSubmissionsView(props: DocumentViewServerProps) {
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

  const [totalResult, newResult, weekResult, formsResult, listResult] = await Promise.all([
    props.payload.find({
      collection: 'form-submissions',
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
      where: {
        and: [
          { siteId: { equals: siteKey } },
          { createdAt: { greater_than: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() } },
          notDeletedWhere(),
        ],
      },
    }),
    props.payload.find({
      collection: 'form-submissions',
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
      depth: 0,
      limit: 0,
      user,
      overrideAccess: false,
      where: siteWhere,
    }),
    props.payload.find({
      collection: 'form-submissions',
      depth: 1,
      limit: 200,
      sort: '-createdAt',
      user,
      overrideAccess: false,
      where: siteWhere,
    }),
  ])

  const list = listResult.docs as unknown as SubmissionDoc[]

  const sourceSubmissionIds = list.map((item) => String(item.id))
  const linkedCasesResult = sourceSubmissionIds.length
    ? await props.payload.find({
        collection: 'student-cases',
        depth: 0,
        limit: 200,
        user,
        overrideAccess: false,
        where: {
          and: [{ sourceSubmission: { in: sourceSubmissionIds } }, notDeletedWhere()],
        },
      })
    : { docs: [] }

  const linkedCasesBySubmission = new Map<string, string>()
  for (const rawCase of linkedCasesResult.docs as Array<{
    id: string | number
    sourceSubmission?: string | number | null
  }>) {
    const submissionId = rawCase.sourceSubmission ? String(rawCase.sourceSubmission) : ''
    if (!submissionId) continue
    linkedCasesBySubmission.set(submissionId, String(rawCase.id))
  }

  const submissions: SubmissionListItem[] = list.map((item) => {
    const seed = extractStudentCaseSeed(item.data)
    const caseId = linkedCasesBySubmission.get(String(item.id))

    const formName =
      typeof item.form === 'object' && item.form
        ? String(item.form.title || `Form #${String(item.form.id || 'Unknown')}`)
        : `Form #${String(item.form || 'Unknown')}`

    return {
      id: String(item.id),
      formName,
      submitterName: seed.fullName,
      submitterEmail: seed.email,
      submitterPhone: seed.phone,
      createdAt: item.createdAt || null,
      isNew: isNewSubmission(item.createdAt),
      siteId: String(item.siteId ?? siteKey),
      existingCaseId: caseId,
      targetCountry: seed.targetCountry,
      nationality: seed.nationality,
    }
  })

  const summaryStats = [
    {
      label: 'Total Submissions',
      value: totalResult.totalDocs,
      icon: Inbox,
      tone: 'primary' as const,
      detail: 'All incoming responses for this site.',
    },
    {
      label: 'New (24h)',
      value: newResult.totalDocs,
      icon: Sparkles,
      tone: 'success' as const,
      detail: 'Fresh responses received in the last 24 hours.',
    },
    {
      label: 'This Week',
      value: weekResult.totalDocs,
      icon: Clock3,
      tone: 'info' as const,
      detail: 'Submissions received in the last 7 days.',
    },
    {
      label: 'Active Forms',
      value: formsResult.totalDocs,
      icon: FormInput,
      tone: 'warning' as const,
      detail: 'Forms currently configured in this site workspace.',
    },
  ]

  return (
    <div className="min-h-screen bg-(--cms-bg-elevated)">
      <div className="mx-auto w-full max-w-420 space-y-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
        <WorkspaceHeader
          eyebrow={site.siteName || siteKey}
          title="Form Submissions"
          description="Review incoming responses from all forms connected to this site, identify new activity, and jump directly to each submission detail."
          stats={[
            { label: 'Total', value: `${totalResult.totalDocs} submissions` },
            { label: 'New Today', value: `${newResult.totalDocs}` },
            { label: 'Forms', value: `${formsResult.totalDocs} active` },
          ]}
          aside={
            <Card className="rounded-3xl border-(--cms-card-border) bg-(--cms-bg)/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-(--cms-text)">
                  <Mail className="size-4 text-(--cms-primary)" />
                  <CardTitle className="text-sm font-semibold">Review Focus</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                    Current Snapshot
                  </p>
                  <p className="mt-1 text-sm leading-6 text-(--cms-text-secondary)">
                    {newResult.totalDocs > 0
                      ? `${newResult.totalDocs} new submission${newResult.totalDocs === 1 ? '' : 's'} in the last 24 hours. Prioritize recent responses first.`
                      : 'No new submissions in the last 24 hours.'}
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

        <ClientSubmissionsPanel submissions={submissions} />
      </div>
    </div>
  )
}
