'use client'

/**
 * Global Trash View — Unified trash management across all collections.
 *
 * Displays all soft-deleted items from Pages, Media, Forms, Services, etc.
 * Supports filtering by collection, searching, restoring, and permanent deletion.
 */

import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import { toast } from 'sonner'
import {
  Trash2,
  RotateCcw,
  ShieldAlert,
  Search,
  FileText,
  Image as ImageIcon,
  ClipboardList,
  Inbox,
  Briefcase,
  Users,
  Filter,
  X,
  CheckSquare,
  Square,
  Loader2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// ─── Types ───────────────────────────────────────────────────────────

interface TrashItem {
  id: string
  collection: string
  collectionLabel: string
  title: string
  deletedAt: string | null
  deletedBy: string | null
  deletedByEmail?: string
  siteId: string | null
  createdAt: string
}

interface TrashResponse {
  docs: TrashItem[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
}

// ─── Constants ───────────────────────────────────────────────────────

const COLLECTION_ICONS: Record<string, LucideIcon> = {
  users: Users,
  pages: FileText,
  media: ImageIcon,
  forms: ClipboardList,
  'form-submissions': Inbox,
  services: Briefcase,
}

const COLLECTION_COLORS: Record<string, string> = {
  users: 'bg-(--cms-info-soft) text-(--cms-info-text) border-(--cms-border)',
  pages: 'bg-(--cms-primary-soft) text-(--cms-primary-text) border-(--cms-border)',
  media: 'bg-(--cms-warning-soft) text-(--cms-warning-text) border-(--cms-border)',
  forms: 'bg-(--cms-warning-soft) text-(--cms-warning-text) border-(--cms-border)',
  'form-submissions': 'bg-(--cms-success-soft) text-(--cms-success-text) border-(--cms-border)',
  services: 'bg-(--cms-danger-soft) text-(--cms-danger-text) border-(--cms-border)',
}

const BASE_COLLECTION_FILTERS = [
  { slug: '', label: 'All' },
  { slug: 'pages', label: 'Pages' },
  { slug: 'media', label: 'Media' },
  { slug: 'forms', label: 'Forms' },
  { slug: 'form-submissions', label: 'Submissions' },
  { slug: 'services', label: 'Services' },
]

// ─── Helpers ─────────────────────────────────────────────────────────

function formatDate(value: string | null): string {
  if (!value) return '—'
  const d = new Date(value)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function timeAgo(value: string | null): string {
  if (!value) return ''
  const now = Date.now()
  const then = new Date(value).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(value)
}

// ─── Main Component ──────────────────────────────────────────────────

export default function TrashView() {
  const { user } = useAuth()
  const userRole = (user as { role?: string } | null)?.role ?? ''
  const isAdmin = userRole === 'super-admin'
  const canRestore = Boolean(user) // Both roles can restore
  const canPermanentDelete = isAdmin // Only super-admin can permanently delete
  const collectionFilters = isAdmin
    ? [...BASE_COLLECTION_FILTERS, { slug: 'users', label: 'Users' }]
    : BASE_COLLECTION_FILTERS

  const [items, setItems] = useState<TrashItem[]>([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [collectionFilter, setCollectionFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState(false)

  const [confirm, setConfirm] = useState<{
    open: boolean
    title: string
    description: string
    label: string
    variant: 'default' | 'danger'
    action: () => Promise<void>
  }>({
    open: false,
    title: '',
    description: '',
    label: 'Confirm',
    variant: 'default',
    action: async () => {},
  })

  // ─── Fetch ───────────────────────────────────────────────────────

  const fetchTrash = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (collectionFilter) params.set('collection', collectionFilter)
      if (search) params.set('search', search)
      params.set('limit', '100')

      const res = await fetch(`/api/trash?${params.toString()}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch')

      const data: TrashResponse = await res.json()
      setItems(data.docs)
      setTotalDocs(data.totalDocs)
    } catch {
      toast.error('Failed to load trash items')
    } finally {
      setLoading(false)
    }
  }, [collectionFilter, search])

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchTrash()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchTrash])

  // ─── Actions ─────────────────────────────────────────────────────

  async function restoreItem(item: TrashItem) {
    setActionLoading(true)
    try {
      const res = await fetch('/api/trash', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'restore',
          collection: item.collection,
          id: item.id,
        }),
      })
      if (!res.ok) throw new Error('Failed to restore')
      toast.success(`"${item.title}" restored successfully`)
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(`${item.collection}:${item.id}`)
        return next
      })
      void fetchTrash()
    } catch {
      toast.error('Failed to restore item')
    } finally {
      setActionLoading(false)
    }
  }

  async function permanentDeleteItem(item: TrashItem) {
    setActionLoading(true)
    try {
      const res = await fetch('/api/trash', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          collection: item.collection,
          id: item.id,
        }),
      })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success(`"${item.title}" permanently deleted`)
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(`${item.collection}:${item.id}`)
        return next
      })
      void fetchTrash()
    } catch {
      toast.error('Failed to delete item')
    } finally {
      setActionLoading(false)
    }
  }

  async function bulkRestore() {
    setActionLoading(true)
    try {
      const bulkItems = items
        .filter((i) => selectedIds.has(`${i.collection}:${i.id}`))
        .map((i) => ({ collection: i.collection, id: i.id }))
      const res = await fetch('/api/trash', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulk-restore', items: bulkItems }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(`${bulkItems.length} items restored`)
      setSelectedIds(new Set())
      void fetchTrash()
    } catch {
      toast.error('Bulk restore failed')
    } finally {
      setActionLoading(false)
    }
  }

  async function bulkDelete() {
    setActionLoading(true)
    try {
      const bulkItems = items
        .filter((i) => selectedIds.has(`${i.collection}:${i.id}`))
        .map((i) => ({ collection: i.collection, id: i.id }))
      const res = await fetch('/api/trash', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulk-delete', items: bulkItems }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(`${bulkItems.length} items permanently deleted`)
      setSelectedIds(new Set())
      void fetchTrash()
    } catch {
      toast.error('Bulk delete failed')
    } finally {
      setActionLoading(false)
    }
  }

  // ─── Selection ───────────────────────────────────────────────────

  function toggleSelect(item: TrashItem) {
    const key = `${item.collection}:${item.id}`
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function toggleSelectAll() {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(items.map((i) => `${i.collection}:${i.id}`)))
    }
  }

  const hasSelection = selectedIds.size > 0

  // ─── Render ──────────────────────────────────────────────────────

  return (
    <div className="px-6 pb-6 pt-5">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--cms-danger-soft) text-(--cms-danger-text)">
            <Trash2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[var(--cms-text)]">
              Trash
            </h1>
            <p className="mt-0.5 text-[13px] text-[var(--cms-text-muted)]">
              {totalDocs} deleted {totalDocs === 1 ? 'item' : 'items'}
              {isAdmin ? ' across all collections' : ' for your site'}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--cms-text-muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deleted items..."
            className="h-9 rounded-xl border-[var(--cms-border)] pl-9 text-[13px]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cms-text-muted)] hover:text-[var(--cms-text)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Bulk Actions */}
        {hasSelection && canRestore && (
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-[var(--cms-text-secondary)]">
              {selectedIds.size} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-[var(--cms-border)] text-[13px]"
              disabled={actionLoading}
              onClick={() =>
                setConfirm({
                  open: true,
                  title: 'Restore Selected Items',
                  description: `Restore ${selectedIds.size} items? They will become active again.`,
                  label: 'Restore All',
                  variant: 'default',
                  action: bulkRestore,
                })
              }
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Restore
            </Button>
            {canPermanentDelete && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-(--cms-danger-soft) text-(--cms-danger-text) hover:bg-(--cms-danger-soft) text-[13px]"
                disabled={actionLoading}
                onClick={() =>
                  setConfirm({
                    open: true,
                    title: 'Permanently Delete Selected',
                    description: `Delete ${selectedIds.size} items permanently? This cannot be undone.`,
                    label: 'Delete Permanently',
                    variant: 'danger',
                    action: bulkDelete,
                  })
                }
              >
                <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Collection Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-[var(--cms-text-muted)]" />
        {collectionFilters.map((f) => (
          <button
            key={f.slug}
            onClick={() => setCollectionFilter(f.slug)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all',
              collectionFilter === f.slug
                ? 'bg-[var(--cms-primary)] text-white shadow-sm'
                : 'bg-[var(--cms-bg-muted)] text-[var(--cms-text-secondary)] hover:bg-gray-200',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <section
        className="overflow-hidden rounded-2xl border border-[var(--cms-card-border)] bg-[var(--cms-card-bg)]"
        style={{ boxShadow: 'var(--cms-card-shadow)' }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center px-6 py-20">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--cms-text-muted)]" />
            <p className="mt-3 text-[13px] text-[var(--cms-text-muted)]">Loading trash...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--cms-bg-muted)]">
              <Trash2 className="h-6 w-6 text-[var(--cms-text-muted)]" />
            </div>
            <h3 className="text-[15px] font-semibold text-[var(--cms-text)]">Trash is empty</h3>
            <p className="mt-1 max-w-sm text-[13px] text-[var(--cms-text-muted)]">
              {search || collectionFilter
                ? 'No deleted items match your current filters.'
                : 'Items you delete will appear here. You can restore or permanently remove them.'}
            </p>
          </div>
        ) : (
          <>
            {/* Select All Header */}
            {canRestore && (
              <div className="flex items-center gap-3 border-b border-[var(--cms-border-subtle)] px-6 py-3">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-[13px] font-medium text-[var(--cms-text-secondary)] transition-colors hover:text-[var(--cms-text)]"
                >
                  {selectedIds.size === items.length ? (
                    <CheckSquare className="h-4 w-4 text-[var(--cms-primary)]" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  Select all ({items.length})
                </button>
              </div>
            )}

            {/* Items List */}
            <div className="divide-y divide-[var(--cms-border-subtle)]">
              {items.map((item) => {
                const key = `${item.collection}:${item.id}`
                const isSelected = selectedIds.has(key)
                const Icon = COLLECTION_ICONS[item.collection] || FileText
                const colorClass =
                  COLLECTION_COLORS[item.collection] || 'bg-gray-50 text-gray-600 border-gray-100'

                return (
                  <div
                    key={key}
                    className={cn(
                      'flex items-center gap-4 px-6 py-4 transition-colors',
                      isSelected ? 'bg-(--cms-primary-soft)/50' : 'hover:bg-[var(--cms-bg-muted)]/50',
                    )}
                  >
                    {/* Checkbox */}
                    {canRestore && (
                      <button
                        onClick={() => toggleSelect(item)}
                        className="shrink-0 text-[var(--cms-text-muted)] transition-colors hover:text-[var(--cms-text)]"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4.5 w-4.5 text-[var(--cms-primary)]" />
                        ) : (
                          <Square className="h-4.5 w-4.5" />
                        )}
                      </button>
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
                        colorClass,
                      )}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[14px] font-medium text-[var(--cms-text)]">
                          {item.title}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            'shrink-0 rounded-full px-2 py-0 text-[10px] font-medium border',
                            colorClass,
                          )}
                        >
                          {item.collectionLabel}
                        </Badge>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-[12px] text-[var(--cms-text-muted)]">
                        <span>Deleted {timeAgo(item.deletedAt)}</span>
                        {item.deletedByEmail && (
                          <>
                            <span className="text-[var(--cms-border)]">·</span>
                            <span>by {item.deletedByEmail}</span>
                          </>
                        )}
                        {item.siteId && (
                          <>
                            <span className="text-[var(--cms-border)]">·</span>
                            <span>Site: {item.siteId}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {canRestore && (
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-lg px-3 text-[12px] font-medium text-[var(--cms-text-secondary)] hover:bg-(--cms-success-soft) hover:text-(--cms-success-text)"
                          disabled={actionLoading}
                          onClick={() =>
                            setConfirm({
                              open: true,
                              title: 'Restore Item',
                              description: `Restore "${item.title}"? It will become active again.`,
                              label: 'Restore',
                              variant: 'default',
                              action: () => restoreItem(item),
                            })
                          }
                        >
                          <RotateCcw className="mr-1 h-3.5 w-3.5" />
                          Restore
                        </Button>
                        {canPermanentDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-lg px-3 text-[12px] font-medium text-(--cms-danger-text) hover:bg-(--cms-danger-soft) hover:text-(--cms-danger-text)"
                            disabled={actionLoading}
                            onClick={() =>
                              setConfirm({
                                open: true,
                                title: 'Delete Permanently',
                                description: `Permanently delete "${item.title}"? This cannot be undone.`,
                                label: 'Delete Permanently',
                                variant: 'danger',
                                action: () => permanentDeleteItem(item),
                              })
                            }
                          >
                            <ShieldAlert className="mr-1 h-3.5 w-3.5" />
                            Delete
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </section>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirm.open} onOpenChange={(open) => setConfirm((s) => ({ ...s, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirm.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={confirm.variant}
              onClick={() => {
                setConfirm((s) => ({ ...s, open: false }))
                void confirm.action()
              }}
            >
              {confirm.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
