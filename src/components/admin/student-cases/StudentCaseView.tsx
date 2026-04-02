import Link from 'next/link'
import type { DocumentViewServerProps } from 'payload'
import {
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  Flag,
  FolderOpen,
  GraduationCap,
  ListChecks,
  Mail,
  Phone,
  User,
  CircleDot,
  History,
  StickyNote,
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

const statusTone: Record<string, string> = {
  new: 'bg-(--cms-info-soft) text-(--cms-info-text)',
  'in-progress': 'bg-(--cms-primary-soft) text-(--cms-primary-text)',
  'waiting-student': 'bg-(--cms-warning-soft) text-(--cms-warning-text)',
  'waiting-institution': 'bg-(--cms-warning-soft) text-(--cms-warning-text)',
  completed: 'bg-(--cms-success-soft) text-(--cms-success-text)',
  'closed-lost': 'bg-(--cms-danger-soft) text-(--cms-danger-text)',
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

  return (
    <div className="min-h-screen bg-(--cms-bg-elevated) px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <div className="mx-auto max-w-420 space-y-6">
        <Card className="rounded-3xl border-(--cms-card-border)">
          <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                Student Case Workspace
              </p>
              <CardTitle className="mt-2 text-2xl font-semibold tracking-tight text-(--cms-text)">
                {doc.fullName || 'Untitled Case'}
              </CardTitle>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge className="rounded-full border-0 bg-(--cms-bg-muted) px-3 py-1 text-xs text-(--cms-text-secondary)">
                  {pretty(doc.currentStage)}
                </Badge>
                <Badge
                  className={`rounded-full border-0 px-3 py-1 text-xs ${statusTone[doc.status ?? ''] ?? 'bg-(--cms-bg-muted) text-(--cms-text-secondary)'}`}
                >
                  {pretty(doc.status)}
                </Badge>
                <Badge className="rounded-full border-0 bg-(--cms-bg-muted) px-3 py-1 text-xs text-(--cms-text-secondary)">
                  Priority: {pretty(doc.priority)}
                </Badge>
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
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-(--cms-border) bg-(--cms-bg) px-3 text-xs font-semibold uppercase tracking-[0.08em] text-(--cms-text-secondary) transition hover:bg-(--cms-bg-muted)"
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/collections/student-cases/${docId}#field-documents`}>
                <Button variant="outline" className="rounded-xl">
                  Manage Files
                </Button>
              </Link>
              <Link href={`/admin/collections/student-cases/${docId}`}>
                <Button variant="outline" className="rounded-xl">
                  Open Full Editor
                </Button>
              </Link>
              <Link href="/admin/collections/student-cases">
                <Button className="rounded-xl">Back to Cases</Button>
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
                <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3 text-sm">
                  <p className="text-(--cms-text-muted)">Email</p>
                  <p className="mt-1 font-medium text-(--cms-text)">{doc.email || '—'}</p>
                </div>
                <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3 text-sm">
                  <p className="text-(--cms-text-muted)">Phone</p>
                  <p className="mt-1 font-medium text-(--cms-text)">{doc.phone || '—'}</p>
                </div>
                <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3 text-sm">
                  <p className="text-(--cms-text-muted)">Nationality</p>
                  <p className="mt-1 font-medium text-(--cms-text)">{doc.nationality || '—'}</p>
                </div>
                <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3 text-sm">
                  <p className="text-(--cms-text-muted)">Target Country</p>
                  <p className="mt-1 font-medium text-(--cms-text)">{doc.targetCountry || '—'}</p>
                </div>
                <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3 text-sm">
                  <p className="text-(--cms-text-muted)">Target Field</p>
                  <p className="mt-1 font-medium text-(--cms-text)">{doc.targetField || '—'}</p>
                </div>
                <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3 text-sm">
                  <p className="text-(--cms-text-muted)">Education Level</p>
                  <p className="mt-1 font-medium text-(--cms-text)">{doc.educationLevel || '—'}</p>
                </div>
              </CardContent>
            </Card>

            <Card id="tasks" className="rounded-2xl border-(--cms-card-border)">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ClipboardList className="size-4 text-(--cms-primary)" />
                  Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-sm text-(--cms-text-muted)">No tasks added yet.</p>
                ) : (
                  tasks.map((task, idx) => (
                    <div
                      key={`task-${idx}`}
                      className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3 text-sm"
                    >
                      <p className="font-medium text-(--cms-text)">
                        {task.title || 'Untitled task'}
                      </p>
                      <p className="mt-1 text-(--cms-text-secondary)">
                        {pretty(task.status)} • Due {formatDate(task.dueDate)}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card id="documents" className="rounded-2xl border-(--cms-card-border)">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="size-4 text-(--cms-primary)" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-(--cms-border) bg-(--cms-bg-muted) p-5 text-sm text-(--cms-text-secondary)">
                    No document checklist yet. Start by opening the full editor and adding document
                    rows with a file, type, and verification status.
                  </div>
                ) : (
                  documents.map((item, idx) => {
                    const href = fileHref(item.file)
                    const hrefLabel = fileLabel(item.file)

                    return (
                    <div
                      key={`doc-${idx}`}
                      className="space-y-2 rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3 text-sm"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-(--cms-text)">{item.name || 'Document'}</p>
                        <Badge className="rounded-full border-0 bg-(--cms-primary-soft) px-2 py-0.5 text-[11px] text-(--cms-primary-text)">
                          {pretty(item.documentType)}
                        </Badge>
                        <Badge className="rounded-full border-0 bg-(--cms-bg) px-2 py-0.5 text-[11px] text-(--cms-text-secondary)">
                          {pretty(item.status)}
                        </Badge>
                      </div>

                      {item.note ? <p className="text-(--cms-text-secondary)">{item.note}</p> : null}

                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-(--cms-primary)"
                        >
                          <ExternalLink className="size-3.5" />
                          {hrefLabel}
                        </a>
                      ) : (
                        <p className="text-xs text-(--cms-text-muted)">No file attached</p>
                      )}
                    </div>
                    )
                  })
                )}

                <Link href={`/admin/collections/student-cases/${docId}#field-documents`}>
                  <Button variant="outline" className="h-10 rounded-xl border-(--cms-border)">
                    <FolderOpen className="mr-2 size-4" />
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
                <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3">
                  <p className="text-(--cms-text-muted)">Current Stage</p>
                  <p className="mt-1 font-medium text-(--cms-text)">{pretty(doc.currentStage)}</p>
                </div>
                <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3">
                  <p className="text-(--cms-text-muted)">Current Status</p>
                  <p className="mt-1 font-medium text-(--cms-text)">{pretty(doc.status)}</p>
                </div>
                <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3">
                  <p className="text-(--cms-text-muted)">Priority</p>
                  <p className="mt-1 font-medium text-(--cms-text)">{pretty(doc.priority)}</p>
                </div>
                <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3">
                  <p className="text-(--cms-text-muted)">Action</p>
                  <p className="mt-1 font-medium text-(--cms-text)">{doc.nextAction || '—'}</p>
                </div>
                <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3">
                  <p className="text-(--cms-text-muted)">Due</p>
                  <p className="mt-1 font-medium text-(--cms-text)">
                    {formatDate(doc.nextActionDate)}
                  </p>
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
              <CardContent className="space-y-2">
                {timeline.length === 0 ? (
                  <p className="text-sm text-(--cms-text-muted)">No timeline events yet.</p>
                ) : (
                  timeline.map((event, idx) => (
                    <div
                      key={`timeline-${idx}`}
                      className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3 text-sm"
                    >
                      <p className="font-medium text-(--cms-text)">{event.title || 'Event'}</p>
                      <p className="mt-1 text-(--cms-text-secondary)">
                        {formatDate(event.at)} {event.note ? `• ${event.note}` : ''}
                      </p>
                    </div>
                  ))
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
              <CardContent className="space-y-2">
                {notes.length === 0 ? (
                  <p className="text-sm text-(--cms-text-muted)">No notes yet.</p>
                ) : (
                  notes.map((note, idx) => (
                    <div
                      key={`note-${idx}`}
                      className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3 text-sm"
                    >
                      <p className="text-(--cms-text)">{note.note || '—'}</p>
                      <p className="mt-1 text-(--cms-text-muted)">{formatDate(note.createdAt)}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-(--cms-card-border)">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Briefcase className="size-4 text-(--cms-primary)" />
                  Source
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3">
                  <p className="text-(--cms-text-muted)">Submission Link</p>
                  {doc.sourceSubmission ? (
                    <Link
                      href={`/admin/collections/form-submissions/${String(doc.sourceSubmission)}`}
                      className="mt-1 inline-flex items-center gap-1 font-medium text-(--cms-primary)"
                    >
                      Open source submission
                    </Link>
                  ) : (
                    <p className="mt-1 font-medium text-(--cms-text)">Manual case</p>
                  )}
                </div>
                <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3">
                  <p className="text-(--cms-text-muted)">Contact</p>
                  <p className="mt-1 inline-flex items-center gap-2 text-(--cms-text)">
                    <Mail className="size-4" /> {doc.email || '—'}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 text-(--cms-text)">
                    <Phone className="size-4" /> {doc.phone || '—'}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 text-(--cms-text)">
                    <CalendarClock className="size-4" /> Next: {formatDate(doc.nextActionDate)}
                  </p>
                </div>

                <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3">
                  <p className="text-(--cms-text-muted)">Pipeline Health</p>
                  <p className="mt-1 inline-flex items-center gap-2 text-(--cms-text)">
                    <CheckCircle2 className="size-4" />
                    {tasks.length} tasks • {documents.length} docs • {timeline.length} timeline entries
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 text-(--cms-text)">
                    <GraduationCap className="size-4" />
                    Target: {doc.targetCountry || '—'} / {doc.targetField || '—'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
