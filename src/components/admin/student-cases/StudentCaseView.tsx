import Link from 'next/link'
import type { DocumentViewServerProps } from 'payload'
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CalendarClock,
  CheckCheck,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Clock,
  ExternalLink,
  FileText,
  Flag,
  FolderOpen,
  GraduationCap,
  HelpCircle,
  History,
  Link2,
  ListChecks,
  Mail,
  Phone,
  StickyNote,
  User,
  XCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StudentCaseDoc {
  id: string | number
  fullName?: string | null
  email?: string | null
  phone?: string | null
  nationality?: string | null
  targetCountry?: string | null
  targetCity?: string | null
  targetField?: string | null
  educationLevel?: string | null
  languageLevel?: string | null
  visaType?: string | null
  currentStage?: string | null
  status?: string | null
  priority?: string | null
  nextAction?: string | null
  nextActionDate?: string | null
  tasks?: Array<{ title?: string | null; status?: string | null; dueDate?: string | null }> | null
  documents?: Array<{
    name?: string | null
    documentType?: string | null
    status?: string | null
    note?: string | null
    file?:
      | number
      | string
      | { id?: number | string; url?: string | null; filename?: string | null }
      | null
  }> | null
  timeline?: Array<{ title?: string | null; at?: string | null; note?: string | null }> | null
  internalNotes?: Array<{ note?: string | null; createdAt?: string | null }> | null
  sourceSubmission?: string | number | null
}

type CaseDocumentFile =
  | number
  | string
  | { id?: number | string; url?: string | null; filename?: string | null }
  | null
  | undefined

function pretty(value?: string | null): string {
  if (!value) return '—'
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatDate(value?: string | null): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const STAGES = ['lead', 'consultation', 'application', 'visa', 'enrolled'] as const

const statusTone: Record<string, string> = {
  new: 'bg-(--cms-info-soft) text-(--cms-info-text)',
  'in-progress': 'bg-(--cms-primary-soft) text-(--cms-primary-text)',
  'waiting-student': 'bg-(--cms-warning-soft) text-(--cms-warning-text)',
  'waiting-institution': 'bg-(--cms-warning-soft) text-(--cms-warning-text)',
  completed: 'bg-(--cms-success-soft) text-(--cms-success-text)',
  'closed-lost': 'bg-(--cms-danger-soft) text-(--cms-danger-text)',
}

const priorityTone: Record<string, string> = {
  low: 'bg-(--cms-bg-muted) text-(--cms-text-secondary)',
  medium: 'bg-(--cms-info-soft) text-(--cms-info-text)',
  high: 'bg-(--cms-warning-soft) text-(--cms-warning-text)',
  urgent: 'bg-(--cms-danger-soft) text-(--cms-danger-text)',
}

const taskStatusBadge: Record<string, string> = {
  done: 'bg-(--cms-success-soft) text-(--cms-success-text)',
  completed: 'bg-(--cms-success-soft) text-(--cms-success-text)',
  'in-progress': 'bg-(--cms-primary-soft) text-(--cms-primary-text)',
  blocked: 'bg-(--cms-danger-soft) text-(--cms-danger-text)',
  waiting: 'bg-(--cms-warning-soft) text-(--cms-warning-text)',
}

const docStatusBadge: Record<string, string> = {
  verified: 'bg-(--cms-success-soft) text-(--cms-success-text)',
  pending: 'bg-(--cms-warning-soft) text-(--cms-warning-text)',
  rejected: 'bg-(--cms-danger-soft) text-(--cms-danger-text)',
  missing: 'bg-(--cms-bg-muted) text-(--cms-text-muted)',
}

function taskBorderColor(status: string | null | undefined): string {
  const map: Record<string, string> = {
    done: 'var(--cms-success-text)',
    completed: 'var(--cms-success-text)',
    'in-progress': 'var(--cms-primary)',
    blocked: 'var(--cms-danger-text)',
    waiting: 'var(--cms-warning-text)',
  }
  return map[status ?? ''] ?? 'var(--cms-border)'
}

function isOverdue(value?: string | null): boolean {
  if (!value) return false
  return new Date(value) < new Date()
}

function fileHref(file: CaseDocumentFile): string {
  if (!file) return ''
  if (typeof file === 'object' && file.url) return String(file.url)
  if (typeof file === 'object' && file.id) return `/admin/collections/media/${String(file.id)}`
  return `/admin/collections/media/${String(file)}`
}

function fileLabel(file: CaseDocumentFile): string {
  if (!file) return 'View file'
  if (typeof file === 'object' && file.filename) return String(file.filename)
  if (typeof file === 'object' && file.id) return `Media #${String(file.id)}`
  return `Media #${String(file)}`
}

export default function StudentCaseView(props: DocumentViewServerProps) {
  const doc = props.doc as StudentCaseDoc | null

  if (!doc) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-(--cms-text-secondary)">
        Student case not found.
      </div>
    )
  }

  const docId = String(doc.id)
  const tasks = doc.tasks ?? []
  const documents = doc.documents ?? []
  const timeline = doc.timeline ?? []
  const notes = doc.internalNotes ?? []
  const currentStageIdx = STAGES.indexOf((doc.currentStage ?? 'lead') as (typeof STAGES)[number])

  return (
    <div className="min-h-screen bg-(--cms-bg-elevated) px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <div className="mx-auto max-w-420 space-y-6">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <Card className="rounded-3xl border-(--cms-card-border)">
          <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                Student Case Workspace
              </p>
              <CardTitle className="mt-2 text-2xl font-semibold tracking-tight text-(--cms-text)">
                {doc.fullName || 'Untitled Case'}
              </CardTitle>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge className="rounded-full border-0 bg-(--cms-bg-muted) px-3 py-1 text-xs font-semibold text-(--cms-text-secondary)">
                  {pretty(doc.currentStage)}
                </Badge>
                <Badge
                  className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${statusTone[doc.status ?? ''] ?? 'bg-(--cms-bg-muted) text-(--cms-text-secondary)'}`}
                >
                  {pretty(doc.status)}
                </Badge>
                <Badge
                  className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${priorityTone[doc.priority ?? ''] ?? 'bg-(--cms-bg-muted) text-(--cms-text-secondary)'}`}
                >
                  {pretty(doc.priority)} priority
                </Badge>
              </div>

              {/* Stage progress dots */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {STAGES.map((stage, idx) => {
                  const isActive = idx === currentStageIdx
                  const isPast = idx < currentStageIdx
                  return (
                    <div key={stage} className="flex items-center gap-1.5">
                      <div
                        className={`size-2 rounded-full transition-colors ${
                          isActive
                            ? 'bg-(--cms-primary) ring-2 ring-offset-1 ring-(--cms-primary-soft)'
                            : isPast
                              ? 'bg-(--cms-success-text)'
                              : 'bg-(--cms-border)'
                        }`}
                      />
                      <span
                        className={`text-[11px] font-medium ${
                          isActive
                            ? 'text-(--cms-primary)'
                            : isPast
                              ? 'text-(--cms-success-text)'
                              : 'text-(--cms-text-muted)'
                        }`}
                      >
                        {pretty(stage)}
                      </span>
                      {idx < STAGES.length - 1 && (
                        <ArrowRight className="size-3 shrink-0 text-(--cms-border)" />
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { href: '#overview', label: 'Overview', icon: User },
                  { href: '#workflow', label: 'Workflow', icon: Flag },
                  { href: '#documents', label: 'Documents', icon: FolderOpen },
                  { href: '#tasks', label: 'Tasks', icon: ListChecks },
                  { href: '#timeline', label: 'Timeline', icon: History },
                ].map(({ href, label, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-(--cms-border) bg-(--cms-bg) px-3 text-xs font-semibold uppercase tracking-[0.08em] text-(--cms-text-secondary) transition hover:bg-(--cms-bg-muted)"
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link href={`/admin/collections/student-cases/${docId}#field-documents`}>
                <Button variant="outline" className="rounded-xl text-sm">
                  Manage Files
                </Button>
              </Link>
              <Link href={`/admin/collections/student-cases/${docId}`}>
                <Button variant="outline" className="rounded-xl text-sm">
                  Open Full Editor
                </Button>
              </Link>
              <Link href="/admin/collections/student-cases">
                <Button className="rounded-xl text-sm">Back to Cases</Button>
              </Link>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card id="overview" className="rounded-2xl border-(--cms-card-border)">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="size-4 text-(--cms-primary)" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Email', value: doc.email, Icon: Mail },
                  { label: 'Phone', value: doc.phone, Icon: Phone },
                  { label: 'Nationality', value: doc.nationality, Icon: User },
                  { label: 'Target Country', value: doc.targetCountry, Icon: GraduationCap },
                  { label: 'Target Field', value: doc.targetField, Icon: GraduationCap },
                  { label: 'Education Level', value: doc.educationLevel, Icon: GraduationCap },
                ].map(({ label, value, Icon }) => (
                  <div
                    key={label}
                    className="flex items-start gap-2.5 rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3 text-sm"
                  >
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-(--cms-primary-soft)">
                      <Icon className="size-3.5 text-(--cms-primary)" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-(--cms-text-muted)">{label}</p>
                      <p className="mt-0.5 truncate font-medium text-(--cms-text)">
                        {value || '—'}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card id="tasks" className="rounded-2xl border-(--cms-card-border)">
              <CardHeader className="flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ClipboardList className="size-4 text-(--cms-primary)" />
                  Tasks
                  {tasks.length > 0 && (
                    <span className="ml-1 rounded-full bg-(--cms-primary-soft) px-2 py-0.5 text-[11px] font-semibold text-(--cms-primary-text)">
                      {tasks.length}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-(--cms-border) bg-(--cms-bg-muted) px-4 py-8 text-center">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-(--cms-bg)">
                      <ClipboardList className="size-5 text-(--cms-text-muted)" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-(--cms-text)">No tasks yet</p>
                      <p className="mt-0.5 text-xs text-(--cms-text-muted)">
                        Tasks help track required steps to close this case.
                      </p>
                    </div>
                    <Link href={`/admin/collections/student-cases/${docId}#field-tasks`}>
                      <Button variant="outline" size="sm" className="rounded-xl text-xs">
                        Open Editor to Add Tasks
                      </Button>
                    </Link>
                  </div>
                ) : (
                  tasks.map((task, idx) => {
                    const overdue =
                      isOverdue(task.dueDate) &&
                      task.status !== 'done' &&
                      task.status !== 'completed'
                    return (
                      <div
                        key={`task-${idx}`}
                        className="flex items-start gap-3 rounded-xl border border-(--cms-border) bg-(--cms-card-bg) p-3 text-sm border-l-4"
                        style={{ borderLeftColor: taskBorderColor(task.status) }}
                      >
                        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-(--cms-bg-muted)">
                          {task.status === 'done' || task.status === 'completed' ? (
                            <CheckCheck className="size-3.5 text-(--cms-success-text)" />
                          ) : task.status === 'blocked' ? (
                            <AlertCircle className="size-3.5 text-(--cms-danger-text)" />
                          ) : (
                            <Clock className="size-3.5 text-(--cms-text-secondary)" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium leading-snug text-(--cms-text)">
                            {task.title || 'Untitled task'}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            <Badge
                              className={`rounded-full border-0 px-2 py-0.5 text-[11px] font-semibold ${
                                taskStatusBadge[task.status ?? ''] ??
                                'bg-(--cms-bg-muted) text-(--cms-text-secondary)'
                              }`}
                            >
                              {pretty(task.status)}
                            </Badge>
                            {task.dueDate && (
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                                  overdue ? 'text-(--cms-danger-text)' : 'text-(--cms-text-muted)'
                                }`}
                              >
                                {overdue ? (
                                  <AlertCircle className="size-3" />
                                ) : (
                                  <CalendarClock className="size-3" />
                                )}
                                {overdue ? 'Overdue · ' : 'Due '}
                                {formatDate(task.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>

            <Card id="documents" className="rounded-2xl border-(--cms-card-border)">
              <CardHeader className="flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="size-4 text-(--cms-primary)" />
                  Documents
                  {documents.length > 0 && (
                    <span className="ml-1 rounded-full bg-(--cms-primary-soft) px-2 py-0.5 text-[11px] font-semibold text-(--cms-primary-text)">
                      {documents.length}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {documents.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-(--cms-border) bg-(--cms-bg-muted) px-4 py-8 text-center">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-(--cms-bg)">
                      <FolderOpen className="size-5 text-(--cms-text-muted)" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-(--cms-text)">No documents yet</p>
                      <p className="mt-0.5 text-xs text-(--cms-text-muted)">
                        Add document rows with file, type, and verification status.
                      </p>
                    </div>
                    <Link href={`/admin/collections/student-cases/${docId}#field-documents`}>
                      <Button variant="outline" size="sm" className="rounded-xl text-xs">
                        Open Editor to Add Documents
                      </Button>
                    </Link>
                  </div>
                ) : (
                  documents.map((item, idx) => {
                    const href = fileHref(item.file)
                    const hrefLabel = fileLabel(item.file)
                    const statusClass =
                      docStatusBadge[item.status ?? ''] ??
                      'bg-(--cms-bg-muted) text-(--cms-text-secondary)'

                    return (
                      <div
                        key={`doc-${idx}`}
                        className="flex items-start gap-3 rounded-xl border border-(--cms-border) bg-(--cms-card-bg) p-3 text-sm"
                      >
                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-(--cms-primary-soft)">
                          {item.status === 'verified' ? (
                            <CheckCircle2 className="size-4 text-(--cms-success-text)" />
                          ) : item.status === 'rejected' ? (
                            <XCircle className="size-4 text-(--cms-danger-text)" />
                          ) : item.status === 'missing' ? (
                            <HelpCircle className="size-4 text-(--cms-text-muted)" />
                          ) : (
                            <FileText className="size-4 text-(--cms-primary)" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-(--cms-text)">
                              {item.name || 'Document'}
                            </p>
                            <Badge
                              className={`rounded-full border-0 px-2 py-0.5 text-[11px] font-semibold ${statusClass}`}
                            >
                              {pretty(item.status || 'pending')}
                            </Badge>
                            {item.documentType && (
                              <Badge className="rounded-full border-0 bg-(--cms-bg-muted) px-2 py-0.5 text-[11px] text-(--cms-text-secondary)">
                                {pretty(item.documentType)}
                              </Badge>
                            )}
                          </div>
                          {item.note && (
                            <p className="mt-1 text-xs text-(--cms-text-secondary)">{item.note}</p>
                          )}
                          <div className="mt-2">
                            {href ? (
                              <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-(--cms-border) bg-(--cms-bg-muted) px-2.5 py-1 text-xs font-semibold text-(--cms-primary) transition hover:bg-(--cms-primary-soft)"
                              >
                                <ExternalLink className="size-3" />
                                {hrefLabel}
                              </a>
                            ) : (
                              <span className="text-xs text-(--cms-text-muted)">
                                No file attached
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
                <Link href={`/admin/collections/student-cases/${docId}#field-documents`}>
                  <Button
                    variant="outline"
                    className="h-9 rounded-xl border-(--cms-border) text-xs"
                  >
                    <FolderOpen className="mr-1.5 size-3.5" />
                    Add or Update Documents
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card id="workflow" className="rounded-2xl border-(--cms-card-border)">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CircleDot className="size-4 text-(--cms-primary)" />
                  Workflow Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {/* Status + Priority row */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-(--cms-text-muted)">
                      Status
                    </p>
                    <Badge
                      className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${
                        statusTone[doc.status ?? ''] ??
                        'bg-(--cms-bg-muted) text-(--cms-text-secondary)'
                      }`}
                    >
                      {pretty(doc.status)}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-(--cms-text-muted)">
                      Priority
                    </p>
                    <Badge
                      className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${
                        priorityTone[doc.priority ?? ''] ??
                        'bg-(--cms-bg-muted) text-(--cms-text-secondary)'
                      }`}
                    >
                      {pretty(doc.priority)}
                    </Badge>
                  </div>
                </div>

                {/* Next action focal panel */}
                {doc.nextAction ? (
                  <div
                    className={`rounded-xl border p-3 ${
                      isOverdue(doc.nextActionDate)
                        ? 'border-(--cms-danger-soft) bg-(--cms-danger-soft)'
                        : 'border-(--cms-primary-soft) bg-(--cms-primary-soft)'
                    }`}
                  >
                    <p
                      className={`text-[11px] font-semibold uppercase tracking-wide ${
                        isOverdue(doc.nextActionDate)
                          ? 'text-(--cms-danger-text)'
                          : 'text-(--cms-primary-text)'
                      }`}
                    >
                      {isOverdue(doc.nextActionDate) ? '⚠ Overdue Action' : 'Next Action'}
                    </p>
                    <p className="mt-1 font-medium text-(--cms-text)">{doc.nextAction}</p>
                    {doc.nextActionDate && (
                      <p
                        className={`mt-1 flex items-center gap-1 text-xs ${
                          isOverdue(doc.nextActionDate)
                            ? 'text-(--cms-danger-text)'
                            : 'text-(--cms-text-muted)'
                        }`}
                      >
                        <CalendarClock className="size-3" />
                        {formatDate(doc.nextActionDate)}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-(--cms-border) bg-(--cms-bg-muted) p-3">
                    <p className="text-xs text-(--cms-text-muted)">No next action set.</p>
                  </div>
                )}

                {/* Pipeline health mini-stats */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Tasks', count: tasks.length, Icon: ClipboardList },
                    { label: 'Docs', count: documents.length, Icon: FileText },
                    { label: 'Events', count: timeline.length, Icon: History },
                  ].map(({ label, count, Icon }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-1 rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) py-2.5"
                    >
                      <Icon className="size-4 text-(--cms-text-muted)" />
                      <p className="text-base font-bold text-(--cms-text)">{count}</p>
                      <p className="text-[10px] text-(--cms-text-muted)">{label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card id="timeline" className="rounded-2xl border-(--cms-card-border)">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <History className="size-4 text-(--cms-primary)" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                {timeline.length === 0 ? (
                  <p className="text-sm text-(--cms-text-muted)">No timeline events yet.</p>
                ) : (
                  <div className="space-y-0">
                    {timeline.map((event, idx) => (
                      <div key={`timeline-${idx}`} className="relative flex gap-3 pb-4 last:pb-0">
                        {/* connecting line */}
                        {idx < timeline.length - 1 && (
                          <div className="absolute left-[11px] top-5 h-full w-px bg-(--cms-border-subtle)" />
                        )}
                        <div className="relative mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-(--cms-primary-soft) bg-(--cms-card-bg)">
                          <div className="size-2 rounded-full bg-(--cms-primary)" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-snug text-(--cms-text)">
                            {event.title || 'Event'}
                          </p>
                          <p className="mt-0.5 text-xs text-(--cms-text-muted)">
                            {formatDate(event.at)}
                          </p>
                          {event.note && (
                            <p className="mt-1 text-xs text-(--cms-text-secondary)">{event.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-(--cms-card-border)">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <StickyNote className="size-4 text-(--cms-primary)" />
                  Internal Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {notes.length === 0 ? (
                  <p className="text-sm text-(--cms-text-muted)">No notes yet.</p>
                ) : (
                  notes.map((note, idx) => (
                    <div
                      key={`note-${idx}`}
                      className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3 text-sm border-l-4"
                      style={{ borderLeftColor: 'var(--cms-warning-text)' }}
                    >
                      <p className="leading-snug text-(--cms-text)">{note.note || '—'}</p>
                      <p className="mt-1.5 text-xs text-(--cms-text-muted)">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-(--cms-card-border)">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Briefcase className="size-4 text-(--cms-primary)" />
                  Source &amp; Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3">
                  <p className="text-(--cms-text-muted)">Submission</p>
                  {doc.sourceSubmission ? (
                    <Link
                      href={`/admin/collections/form-submissions/${String(doc.sourceSubmission)}`}
                      className="mt-1 inline-flex items-center gap-1.5 font-medium text-(--cms-primary)"
                    >
                      <Link2 className="size-3.5" />
                      Open source submission
                    </Link>
                  ) : (
                    <p className="mt-1 font-medium text-(--cms-text)">Manual case</p>
                  )}
                </div>
                <div className="space-y-1.5 rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3">
                  {[
                    { Icon: Mail, value: doc.email },
                    { Icon: Phone, value: doc.phone },
                    {
                      Icon: GraduationCap,
                      value: doc.targetCountry
                        ? `${doc.targetCountry} / ${doc.targetField || '—'}`
                        : null,
                    },
                  ].map(({ Icon, value }, i) => (
                    <p key={i} className="flex items-center gap-2 text-(--cms-text)">
                      <Icon className="size-3.5 shrink-0 text-(--cms-text-muted)" />
                      <span className="truncate">{value || '—'}</span>
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
