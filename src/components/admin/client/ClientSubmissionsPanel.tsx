'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Inbox, Search, Filter, Mail, User, ArrowUpRight, Clock3 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface SubmissionListItem {
  id: string
  formName: string
  submitterName: string
  submitterEmail: string
  submitterPhone?: string
  createdAt: string | null
  isNew: boolean
  siteId: string
  existingCaseId?: string
  targetCountry?: string
  nationality?: string
}

interface ClientSubmissionsPanelProps {
  submissions: SubmissionListItem[]
}

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

export default function ClientSubmissionsPanel({ submissions }: ClientSubmissionsPanelProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'new'>('all')
  const [creatingId, setCreatingId] = useState<string | null>(null)

  async function handleCreateCase(item: SubmissionListItem) {
    if (item.existingCaseId) {
      window.location.href = `/admin/collections/student-cases/${item.existingCaseId}/workspace`
      return
    }

    if (creatingId) return
    setCreatingId(item.id)

    try {
      const existingRes = await fetch(
        `/api/student-cases?limit=1&depth=0&where[sourceSubmission][equals]=${encodeURIComponent(item.id)}`,
        { credentials: 'include' },
      )
      const existingData = await existingRes.json()
      const existingDoc = existingData?.docs?.[0]

      if (existingDoc?.id) {
        toast.info('This submission is already linked to a case.')
        window.location.href = `/admin/collections/student-cases/${existingDoc.id}/workspace`
        return
      }

      const createRes = await fetch('/api/student-cases', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: item.submitterName,
          email: item.submitterEmail,
          phone: item.submitterPhone || '',
          sourceChannel: 'form',
          sourceSubmission: item.id,
          siteId: item.siteId,
          targetCountry: item.targetCountry || '',
          nationality: item.nationality || '',
          currentStage: 'lead',
          status: 'new',
          priority: 'medium',
          nextAction: 'Initial consultation call',
        }),
      })

      if (!createRes.ok) {
        throw new Error(`Request failed with status ${createRes.status}`)
      }

      const created = await createRes.json()
      const createdId = created?.doc?.id ?? created?.id
      if (!createdId) {
        throw new Error('Could not resolve created case id')
      }

      toast.success('Case created successfully.')
      window.location.href = `/admin/collections/student-cases/${createdId}/workspace`
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Unable to create case (${message})`)
    } finally {
      setCreatingId(null)
    }
  }

  const visibleSubmissions = useMemo(() => {
    const q = query.trim().toLowerCase()
    return submissions.filter((item) => {
      if (filter === 'new' && !item.isNew) return false
      if (!q) return true
      return (
        item.formName.toLowerCase().includes(q) ||
        item.submitterName.toLowerCase().includes(q) ||
        item.submitterEmail.toLowerCase().includes(q)
      )
    })
  }, [submissions, query, filter])

  return (
    <div className="space-y-4">
      <Card className="rounded-[28px] border-(--cms-card-border)">
        <CardHeader className="gap-3 border-b border-(--cms-border-subtle) pb-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle className="text-xl font-semibold tracking-[-0.03em] text-(--cms-text)">
                Submission Inbox
              </CardTitle>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-(--cms-text-secondary)">
                Review incoming responses with clear context and quick access to each submission.
              </p>
            </div>
            <div className="rounded-2xl border border-(--cms-border) bg-(--cms-bg-muted) px-4 py-3 text-sm text-(--cms-text-secondary)">
              <span className="font-semibold text-(--cms-text)">{visibleSubmissions.length}</span>{' '}
              matching results
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--cms-text-muted)" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by form, name, or email"
                className="h-11 rounded-xl border-(--cms-border) bg-(--cms-bg) pl-9 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition',
                    filter === 'all'
                      ? 'bg-(--cms-primary) text-white'
                      : 'text-(--cms-text-secondary) hover:text-(--cms-text)',
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('new')}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition',
                    filter === 'new'
                      ? 'bg-(--cms-primary) text-white'
                      : 'text-(--cms-text-secondary) hover:text-(--cms-text)',
                  )}
                >
                  New
                </button>
              </div>
              <div className="hidden h-11 items-center rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) px-3 text-(--cms-text-secondary) lg:inline-flex">
                <Filter className="size-4" />
              </div>
            </div>
          </div>

          {visibleSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-(--cms-border) bg-(--cms-bg-muted) px-6 py-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-(--cms-card-bg) text-(--cms-primary)">
                <Inbox className="size-6" />
              </div>
              <p className="mt-5 text-lg font-semibold tracking-[-0.02em] text-(--cms-text)">
                No submissions found
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-(--cms-text-secondary)">
                {query
                  ? 'No submissions match your current search.'
                  : 'Incoming responses will appear here once users submit your forms.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleSubmissions.map((item) => (
                <Card
                  key={item.id}
                  className="rounded-2xl border-(--cms-card-border) bg-(--cms-card-bg) transition hover:-translate-y-0.5 hover:border-(--cms-primary)"
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-(--cms-text) sm:text-base">
                            {item.formName}
                          </p>
                          {item.isNew ? (
                            <Badge className="rounded-full border-0 bg-(--cms-success-soft) text-[10px] font-semibold uppercase tracking-[0.12em] text-(--cms-success-text)">
                              New
                            </Badge>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-(--cms-text-secondary)">
                          <span className="inline-flex items-center gap-1.5">
                            <User className="size-3.5" />
                            {item.submitterName}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Mail className="size-3.5" />
                            {item.submitterEmail}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="size-3.5" />
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>
                      </div>

                      <Link href={`/admin/collections/form-submissions/${item.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 gap-2 rounded-xl border-(--cms-border) bg-(--cms-bg) px-3 text-(--cms-text-secondary) hover:text-(--cms-text)"
                        >
                          Open
                          <ArrowUpRight className="size-4" />
                        </Button>
                      </Link>
                      {item.existingCaseId ? (
                        <Link href={`/admin/collections/student-cases/${item.existingCaseId}/workspace`}>
                          <Button size="sm" className="h-10 rounded-xl px-3">
                            Open Case
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          size="sm"
                          className="h-10 rounded-xl px-3"
                          disabled={creatingId === item.id}
                          onClick={() => void handleCreateCase(item)}
                        >
                          {creatingId === item.id ? 'Creating…' : 'Create Case'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
