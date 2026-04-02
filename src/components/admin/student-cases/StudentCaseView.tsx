import Link from 'next/link'
import type { DocumentViewServerProps } from 'payload'
import {
  Briefcase,
  CalendarClock,
  ClipboardList,
  FileText,
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
  documents?: Array<{ name?: string | null; status?: string | null }> | null
  timeline?: Array<{ title?: string | null; at?: string | null; note?: string | null }> | null
  internalNotes?: Array<{ note?: string | null; createdAt?: string | null }> | null
  sourceSubmission?: string | number | null
}

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
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/collections/student-cases/${docId}`}>
                <Button variant="outline" className="rounded-xl">
                  Open Form Editor
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
            <Card className="rounded-2xl border-(--cms-card-border)">
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

            <Card className="rounded-2xl border-(--cms-card-border)">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ClipboardList className="size-4 text-(--cms-primary)" />
                  Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(doc.tasks ?? []).length === 0 ? (
                  <p className="text-sm text-(--cms-text-muted)">No tasks added yet.</p>
                ) : (
                  (doc.tasks ?? []).map((task, idx) => (
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

            <Card className="rounded-2xl border-(--cms-card-border)">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="size-4 text-(--cms-primary)" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(doc.documents ?? []).length === 0 ? (
                  <p className="text-sm text-(--cms-text-muted)">No document checklist yet.</p>
                ) : (
                  (doc.documents ?? []).map((item, idx) => (
                    <div
                      key={`doc-${idx}`}
                      className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-3 text-sm"
                    >
                      <p className="font-medium text-(--cms-text)">{item.name || 'Document'}</p>
                      <p className="mt-1 text-(--cms-text-secondary)">{pretty(item.status)}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl border-(--cms-card-border)">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CircleDot className="size-4 text-(--cms-primary)" />
                  Next Action
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
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

            <Card className="rounded-2xl border-(--cms-card-border)">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <History className="size-4 text-(--cms-primary)" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(doc.timeline ?? []).length === 0 ? (
                  <p className="text-sm text-(--cms-text-muted)">No timeline events yet.</p>
                ) : (
                  (doc.timeline ?? []).map((event, idx) => (
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
                {(doc.internalNotes ?? []).length === 0 ? (
                  <p className="text-sm text-(--cms-text-muted)">No notes yet.</p>
                ) : (
                  (doc.internalNotes ?? []).map((note, idx) => (
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
