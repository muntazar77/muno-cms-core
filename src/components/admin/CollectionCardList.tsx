'use client'

import React from 'react'
import Link from 'next/link'
import { useListQuery, useConfig, useAuth } from '@payloadcms/ui'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  MoreVertical,
  Pencil,
  Trash2,
  RotateCcw,
  ShieldAlert,
  Plus,
  Inbox,
  FileText,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import PagesListStats from '@/components/admin/collection/PagesListStats'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'

// ─── Helpers ─────────────────────────────────────────────────────────

function formatDate(value: string | Date | undefined | null): string {
  if (!value) return '—'
  const d = new Date(value)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Main Component ──────────────────────────────────────────────────

export default function CollectionCardList() {
  const { data, handlePageChange } = useListQuery()
  const { config } = useConfig()
  const { user } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const pathParts = (pathname ?? '').split('/').filter(Boolean)
  const collectionsIdx = pathParts.lastIndexOf('collections')
  const slug = collectionsIdx !== -1 ? (pathParts[collectionsIdx + 1] ?? '') : ''
  const isTrashView = pathParts.includes('trash')

  const collectionConfig = config?.collections?.find((c) => c.slug === slug)

  const hasCreatePermission = Boolean(user)
  const canDelete = (user as { role?: string } | null)?.role === 'admin'
  const apiRoute = (config?.routes?.api as string | undefined) ?? '/api'
  const newDocURL = slug ? `/admin/collections/${slug}/create` : undefined
  const trashURL = slug
    ? isTrashView
      ? `/admin/collections/${slug}`
      : `/admin/collections/${slug}/trash`
    : undefined

  const docs = (data?.docs ?? []) as Record<string, unknown>[]
  const totalDocs = data?.totalDocs ?? 0
  const totalPages = data?.totalPages ?? 1
  const currentPage = Number(data?.page ?? 1)

  const singularLabel = String(collectionConfig?.labels?.singular ?? 'Document')
  const pluralLabel = String(collectionConfig?.labels?.plural ?? 'Documents')

  function refreshList() {
    router.refresh()
  }

  // --- Actions ---

  async function runAction(request: RequestInfo | URL, init: RequestInit) {
    const res = await fetch(request, { credentials: 'include', ...init })
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
    refreshList()
  }

  async function handleTrash(id: string) {
    if (!canDelete) return
    if (!window.confirm('Move this document to trash? You can restore it later.')) return
    try {
      await runAction(`${apiRoute}/${slug}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deletedAt: new Date().toISOString() }),
      })
      toast.success(`${singularLabel} moved to trash.`)
    } catch (error) {
      toast.error('Unable to move document to trash')
    }
  }

  async function handleRestore(id: string) {
    if (!canDelete) return
    if (!window.confirm('Restore this document from trash?')) return
    try {
      await runAction(`${apiRoute}/${slug}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deletedAt: null }),
      })
      toast.success(`${singularLabel} restored.`)
    } catch (error) {
      toast.error('Unable to restore document')
    }
  }

  async function handlePermanentDelete(id: string) {
    if (!canDelete) return
    if (!window.confirm('Permanently delete this document? This action cannot be undone.')) return
    try {
      await runAction(`${apiRoute}/${slug}/${id}`, { method: 'DELETE' })
      toast.success(`${singularLabel} permanently deleted.`)
    } catch (error) {
      toast.error('Unable to permanently delete document')
    }
  }

  return (
    <div className="px-6 pb-6 pt-5">
      <AdminPageHeader
        title={isTrashView ? `${pluralLabel} Trash` : pluralLabel}
        description={
          isTrashView
            ? `Restore or permanently delete archived ${pluralLabel.toLowerCase()}.`
            : `Manage ${pluralLabel.toLowerCase()} visually.`
        }
        isTrashView={isTrashView}
        primaryActionLabel={!isTrashView && hasCreatePermission ? `New ${singularLabel}` : undefined}
        primaryActionHref={!isTrashView && hasCreatePermission ? newDocURL : undefined}
        trashActionHref={trashURL}
        totalDocs={totalDocs}
      />

      {slug === 'pages' && <PagesListStats />}

      <section aria-labelledby="list-heading" className="mt-6">
        {docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--cms-card-border)] bg-[var(--cms-card-bg)] px-6 py-24 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--cms-bg-muted)]">
              <Inbox className="h-6 w-6 text-[var(--cms-text-muted)]" />
            </div>
            <h3 className="text-[15px] font-semibold text-[var(--cms-text)]">
              {isTrashView ? `No deleted ${pluralLabel.toLowerCase()} yet` : `No ${pluralLabel.toLowerCase()} yet`}
            </h3>
            <p className="mt-1 text-[13px] text-[var(--cms-text-muted)]">
              {isTrashView
                ? `Documents moved to trash will appear here.`
                : `Get started by creating your first ${singularLabel.toLowerCase()}.`}
            </p>
            {!isTrashView && hasCreatePermission && newDocURL && (
              <Link href={newDocURL} className="mt-4">
                <Button variant="outline" size="sm" className="rounded-xl border-[var(--cms-border)]">
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Create {singularLabel.toLowerCase()}
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {docs.map((doc) => {
              const id = String(doc.id)
              const title = String(doc.title || doc.name || doc.slug || id)
              const docSlug = String(doc.slug || '')
              const status = String(doc.status || 'draft')
              const editURL = `/admin/collections/${slug}/${id}${isTrashView ? '?trash=true' : ''}`

              return (
                <div
                  key={id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--cms-border)] bg-[var(--cms-card-bg)] p-5 transition-all hover:border-[var(--cms-primary-soft)] hover:shadow-md"
                >
                  <div>
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--cms-bg-muted)] text-[var(--cms-text-muted)] transition-colors group-hover:bg-[var(--cms-primary-soft)] group-hover:text-[var(--cms-primary)]">
                        <FileText className="h-5 w-5" />
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-muted)] hover:text-[var(--cms-text)]"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-xl">
                          <DropdownMenuItem asChild>
                            <Link href={editURL}>
                              <Pencil className="mr-2 h-4 w-4" />
                              {isTrashView ? 'View' : 'Edit'}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {isTrashView ? (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleRestore(id)}
                                disabled={!canDelete}
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restore
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/50 dark:focus:text-red-400"
                                onClick={() => handlePermanentDelete(id)}
                                disabled={!canDelete}
                              >
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                Delete Permanently
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <DropdownMenuItem
                              className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/50 dark:focus:text-red-400"
                              onClick={() => handleTrash(id)}
                              disabled={!canDelete}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Move to Trash
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <Link href={editURL} className="block group-hover:underline">
                      <h4 className="line-clamp-1 text-[15px] font-semibold text-[var(--cms-text)]">
                        {title}
                      </h4>
                    </Link>
                    {docSlug && (
                      <p className="mt-1 line-clamp-1 text-sm text-[var(--cms-text-secondary)]">
                        /{docSlug}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[var(--cms-border-subtle)] pt-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-medium',
                        status === 'published'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                          : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                      )}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                    <div className="flex items-center text-xs text-[var(--cms-text-muted)]">
                      <Calendar className="mr-1.5 h-3.5 w-3.5" />
                      {formatDate(doc.updatedAt as string)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-1 rounded-xl border border-[var(--cms-border)] bg-[var(--cms-card-bg)] p-1 shadow-sm">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange?.(page)}
                className={cn(
                  'h-8 min-w-8 rounded-lg px-2 text-sm font-medium transition-colors',
                  page === currentPage
                    ? 'bg-[var(--cms-primary)] text-white'
                    : 'text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-muted)] hover:text-[var(--cms-text)]'
                )}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
