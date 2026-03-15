'use client'

/**
 * CustomListView — Polished DataTable for all Payload collections.
 *
 * Usage:
 *   admin: {
 *     components: {
 *       views: {
 *         list: { Component: '/components/admin/CustomListView' },
 *       },
 *     },
 *   }
 *
 * Optionally register collection-specific config in LIST_VIEW_CONFIGS.
 */

import React from 'react'
import Link from 'next/link'
import { useListQuery, useConfig, useAuth } from '@payloadcms/ui'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
  ShieldAlert,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Plus,
  FileText,
  Inbox,
  User,
  ChevronLeft,
  ChevronRight,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import UsersListStats from '@/components/admin/collection/UsersListStats'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'

// ─── Per-Collection Config ───────────────────────────────────────────

interface StatusBadgeDef {
  label: string
  variant: 'success' | 'warning' | 'danger' | 'info' | 'default'
}

interface ListViewCollectionConfig {
  description?: string
  statusField?: string
  statusConfig?: Record<string, StatusBadgeDef>
  columnLabels?: Record<string, string>
  columnType?: Record<string, 'email' | 'role'>
  editURL?: (id: string) => string
}

const LIST_VIEW_CONFIGS: Record<string, ListViewCollectionConfig> = {
  users: {
    description: 'Manage user accounts and permissions',
    columnType: { email: 'email', role: 'role' },
    columnLabels: { createdAt: 'Created', updatedAt: 'Updated' },
  },
  media: {
    description: 'Uploaded files and images',
  },
  pages: {
    description: 'Manage website pages and content',
    statusField: 'status',
    statusConfig: {
      draft: { label: 'Draft', variant: 'warning' },
      published: { label: 'Published', variant: 'success' },
    },
    editURL: (id: string) => `/admin/collections/pages/${id}`,
  },
  services: {
    description: 'Manage service listings',
  },
  forms: {
    description: 'Manage form templates',
  },
  'form-submissions': {
    description: 'View form submission responses',
  },
}

const STATS_COMPONENTS: Record<string, React.ComponentType> = {
  users: UsersListStats,
}

// ─── Status Variant Styles ───────────────────────────────────────────

const STATUS_VARIANT_CLASSES: Record<string, string> = {
  success:
    'bg-[var(--cms-success-soft)] text-[var(--cms-success-text)] border-[var(--cms-success-soft)]',
  warning:
    'bg-[var(--cms-warning-soft)] text-[var(--cms-warning-text)] border-[var(--cms-warning-soft)]',
  danger:
    'bg-[var(--cms-danger-soft)] text-[var(--cms-danger-text)] border-[var(--cms-danger-soft)]',
  info: 'bg-[var(--cms-info-soft)] text-[var(--cms-info-text)] border-[var(--cms-info-soft)]',
  default:
    'bg-[var(--cms-bg-muted)] text-[var(--cms-text-secondary)] border-[var(--cms-border-subtle)]',
}

const ROLE_VARIANT_CLASSES: Record<string, string> = {
  admin: 'bg-[var(--cms-info-soft)] text-[var(--cms-info-text)] border-[var(--cms-info-soft)]',
  editor:
    'bg-[var(--cms-warning-soft)] text-[var(--cms-warning-text)] border-[var(--cms-warning-soft)]',
  user: 'bg-[var(--cms-bg-muted)] text-[var(--cms-text-secondary)] border-[var(--cms-border-subtle)]',
}

// ─── Helpers ─────────────────────────────────────────────────────────

function toLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}

function formatDate(value: string): string {
  const d = new Date(value)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Inline Cell Renderers ───────────────────────────────────────────

function EmailCellInline({ value, editURL }: { value: string; editURL: string }) {
  return (
    <Link href={editURL} className="group/email flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--cms-primary-soft)] text-[var(--cms-primary)]">
        <User className="h-3.5 w-3.5" />
      </div>
      <span className="font-medium text-[var(--cms-text)] transition-colors group-hover/email:text-[var(--cms-primary)]">
        {value}
      </span>
    </Link>
  )
}

function RoleBadge({ value }: { value: string }) {
  const style = ROLE_VARIANT_CLASSES[value] ?? ROLE_VARIANT_CLASSES.user
  const label = value ? value.charAt(0).toUpperCase() + value.slice(1) : '—'
  return (
    <Badge
      variant="outline"
      className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-medium', style)}
    >
      {label}
    </Badge>
  )
}

function StatusBadgeCell({
  value,
  config,
}: {
  value: string
  config: Record<string, StatusBadgeDef>
}) {
  const def = config[value]
  if (!def) return <span className="text-[var(--cms-text-muted)]">{value || '—'}</span>
  const classes = STATUS_VARIANT_CLASSES[def.variant] ?? STATUS_VARIANT_CLASSES.default
  return (
    <Badge
      variant="outline"
      className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-medium', classes)}
    >
      {def.label}
    </Badge>
  )
}

function CellValue({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-[var(--cms-text-muted)]">—</span>
  }

  if (typeof value === 'boolean') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'rounded-full px-2.5 py-0.5 text-[11px] font-medium',
          value ? STATUS_VARIANT_CLASSES.success : STATUS_VARIANT_CLASSES.default,
        )}
      >
        {value ? 'Yes' : 'No'}
      </Badge>
    )
  }

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return <span className="text-[var(--cms-text-muted)] tabular-nums">{formatDate(value)}</span>
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return <>{String(value)}</>
  }

  if (Array.isArray(value)) {
    return (
      <Badge
        variant="outline"
        className="rounded-full px-2.5 py-0.5 text-[11px] text-[var(--cms-text-muted)] border-[var(--cms-border)]"
      >
        {value.length} item{value.length !== 1 ? 's' : ''}
      </Badge>
    )
  }

  if (typeof value === 'object') {
    const v = value as Record<string, unknown>

    if ('filename' in v) {
      const isImage = String(v.mimeType ?? '').startsWith('image/')
      const url = String(v.url ?? '')
      const filename = String(v.filename ?? '')
      return (
        <div className="flex items-center gap-2">
          {isImage && url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={filename}
              className="h-8 w-8 rounded-lg border border-[var(--cms-border)] object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--cms-border)] bg-[var(--cms-bg-muted)]">
              <FileText className="h-3.5 w-3.5 text-[var(--cms-text-muted)]" />
            </div>
          )}
          <span className="max-w-[180px] truncate text-[13px]">{filename}</span>
        </div>
      )
    }

    const label = v.name ?? v.title ?? v.email ?? v.id
    return <>{label ? String(label) : '—'}</>
  }

  return <>{String(value)}</>
}

function SortIndicator({ field, currentSort }: { field: string; currentSort: string }) {
  if (currentSort === field)
    return <ChevronUp className="ml-1 inline h-3.5 w-3.5 text-[var(--cms-primary)]" />
  if (currentSort === `-${field}`)
    return <ChevronDown className="ml-1 inline h-3.5 w-3.5 text-[var(--cms-primary)]" />
  return (
    <ChevronsUpDown className="ml-1 inline h-3.5 w-3.5 text-[var(--cms-text-muted)] opacity-0 transition-opacity group-hover/sort:opacity-100" />
  )
}

function ActionMenu({
  editURL,
  slug,
  id,
  isTrashView,
  canDelete,
  onActionComplete,
}: {
  editURL: string
  slug: string
  id: string
  isTrashView: boolean
  canDelete: boolean
  onActionComplete: () => void
}) {
  const [isWorking, setIsWorking] = React.useState(false)

  async function runAction(request: RequestInfo | URL, init: RequestInit) {
    const res = await fetch(request, {
      credentials: 'include',
      ...init,
    })

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`)
    }

    onActionComplete()
  }

  async function handleTrash() {
    if (!canDelete || isWorking) return

    const confirmed = window.confirm('Move this document to trash? You can restore it later.')
    if (!confirmed) return

    try {
      setIsWorking(true)
      await runAction(`/api/${slug}/${id}`, { method: 'DELETE' })
    } catch {
      window.alert('Unable to move this document to trash. Please try again.')
    } finally {
      setIsWorking(false)
    }
  }

  async function handleRestore() {
    if (!canDelete || isWorking) return

    const confirmed = window.confirm('Restore this document from trash?')
    if (!confirmed) return

    try {
      setIsWorking(true)
      await runAction(`/api/${slug}/${id}?trash=true`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deletedAt: null }),
      })
    } catch {
      window.alert('Unable to restore this document. Please try again.')
    } finally {
      setIsWorking(false)
    }
  }

  async function handlePermanentDelete() {
    if (!canDelete || isWorking) return

    const confirmed = window.confirm(
      'Permanently delete this document? This action cannot be undone.',
    )
    if (!confirmed) return

    try {
      setIsWorking(true)
      await runAction(`/api/${slug}/${id}?trash=true`, { method: 'DELETE' })
    } catch {
      window.alert('Unable to permanently delete this document. Please try again.')
    } finally {
      setIsWorking(false)
    }
  }

  const editHref = isTrashView ? `${editURL}?trash=true` : editURL

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={isWorking}
          className="h-8 w-8 rounded-lg text-[var(--cms-text-muted)] opacity-100 transition-all hover:bg-[var(--cms-bg-muted)] hover:text-[var(--cms-text)] sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-40"
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 rounded-xl border-[var(--cms-border)] bg-[var(--cms-card-bg)] shadow-lg"
      >
        <DropdownMenuItem className="rounded-lg text-[var(--cms-text-secondary)]" asChild>
          <Link href={editHref}>
            <Eye className="mr-2 size-4" />
            Open
          </Link>
        </DropdownMenuItem>
        {!isTrashView && (
          <DropdownMenuItem className="rounded-lg text-[var(--cms-text-secondary)]" asChild>
            <Link href={editURL}>
              <Pencil className="mr-2 size-4" />
              Edit
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-[var(--cms-border-subtle)]" />

        {isTrashView ? (
          <>
            <DropdownMenuItem
              className="rounded-lg text-[var(--cms-text-secondary)]"
              onSelect={(event) => {
                event.preventDefault()
                void handleRestore()
              }}
              disabled={!canDelete || isWorking}
            >
              <RotateCcw className="mr-2 size-4" />
              Restore
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-lg text-[var(--cms-danger-text)] focus:bg-[var(--cms-danger-soft)] focus:text-[var(--cms-danger-text)]"
              onSelect={(event) => {
                event.preventDefault()
                void handlePermanentDelete()
              }}
              disabled={!canDelete || isWorking}
            >
              <ShieldAlert className="mr-2 size-4" />
              Delete Permanently
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            className="rounded-lg text-[var(--cms-danger-text)] focus:bg-[var(--cms-danger-soft)] focus:text-[var(--cms-danger-text)]"
            onSelect={(event) => {
              event.preventDefault()
              void handleTrash()
            }}
            disabled={!canDelete || isWorking}
          >
            <Trash2 className="mr-2 size-4" />
            Move to Trash
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Main Component ──────────────────────────────────────────────────

export default function CustomListView() {
  const { data, handleSortChange, handlePageChange } = useListQuery()
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
  const listCfg = LIST_VIEW_CONFIGS[slug]

  const hasCreatePermission = Boolean(user)
  const canDelete = (user as { role?: string } | null)?.role === 'admin'
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
  const limit = Number(data?.limit ?? 10)

  const singularLabel = String(collectionConfig?.labels?.singular ?? 'Document')
  const pluralLabel = String(collectionConfig?.labels?.plural ?? 'Documents')

  const adminConfig = collectionConfig?.admin as { defaultColumns?: string[] } | undefined
  const columns: string[] = adminConfig?.defaultColumns?.length
    ? adminConfig.defaultColumns
    : ['id']

  const currentSort = searchParams?.get('sort') ?? ''

  function toggleSort(field: string) {
    void handleSortChange?.(currentSort === field ? `-${field}` : field)
  }

  const startIndex = totalDocs > 0 ? (currentPage - 1) * limit + 1 : 0
  const endIndex = Math.min(currentPage * limit, totalDocs)

  const StatsComponent = STATS_COMPONENTS[slug]

  function refreshList() {
    router.refresh()
  }

  return (
    <div className="px-6 pb-6 pt-5">
      <AdminPageHeader
        title={isTrashView ? `${pluralLabel} Trash` : pluralLabel}
        description={
          isTrashView
            ? `Restore or permanently delete archived ${pluralLabel.toLowerCase()}.`
            : listCfg?.description ?? `Manage ${pluralLabel.toLowerCase()} for your workspace.`
        }
        isTrashView={isTrashView}
        primaryActionLabel={!isTrashView && hasCreatePermission ? `New ${singularLabel}` : undefined}
        primaryActionHref={!isTrashView && hasCreatePermission ? newDocURL : undefined}
        trashActionHref={trashURL}
        totalDocs={totalDocs}
      />

      {StatsComponent && <StatsComponent />}

      <section
        aria-labelledby="list-heading"
        className="overflow-hidden rounded-2xl border border-[var(--cms-card-border)] bg-[var(--cms-card-bg)]"
        style={{ boxShadow: 'var(--cms-card-shadow)' }}
      >
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-[var(--cms-border-subtle)] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="list-heading"
              className="text-[16px] font-semibold tracking-tight text-[var(--cms-text)]"
            >
              {isTrashView ? `Deleted ${pluralLabel}` : pluralLabel}
            </h2>
            <p className="mt-0.5 text-[13px] text-[var(--cms-text-muted)]">
              {`${totalDocs.toLocaleString()} ${totalDocs === 1 ? singularLabel.toLowerCase() : pluralLabel.toLowerCase()}`}
            </p>
          </div>

          {!isTrashView && hasCreatePermission && newDocURL && (
            <Link href={newDocURL}>
              <Button className="rounded-xl bg-[var(--cms-primary)] px-4 text-white shadow-sm transition-colors hover:bg-[var(--cms-primary-hover)]">
                <Plus className="mr-1.5 h-4 w-4" />
                New {singularLabel}
              </Button>
            </Link>
          )}
        </div>

        {docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--cms-bg-muted)]">
              <Inbox className="h-6 w-6 text-[var(--cms-text-muted)]" />
            </div>
            <h3 className="text-[15px] font-semibold text-[var(--cms-text)]">
              {isTrashView
                ? `No deleted ${pluralLabel.toLowerCase()} yet`
                : `No ${pluralLabel.toLowerCase()} yet`}
            </h3>
            <p className="mt-1 text-[13px] text-[var(--cms-text-muted)]">
              {isTrashView
                ? `Documents moved to trash will appear here.`
                : `Get started by creating your first ${singularLabel.toLowerCase()}.`}
            </p>
            {!isTrashView && hasCreatePermission && newDocURL && (
              <Link href={newDocURL} className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-[var(--cms-border)] text-[var(--cms-text-secondary)]"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Create {singularLabel.toLowerCase()}
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Data Table */}
            <div className="overflow-x-auto">
              <Table wrapperClassName="border-0 rounded-none shadow-none bg-transparent">
                <TableHeader>
                  <TableRow className="hover:bg-transparent even:bg-transparent">
                    {columns.map((col) => {
                      if (listCfg?.statusField && col === listCfg.statusField) return null
                      return (
                        <TableHead key={col} className="min-w-[120px]">
                          <button
                            type="button"
                            onClick={() => toggleSort(col)}
                            className="group/sort inline-flex items-center whitespace-nowrap transition-colors hover:text-[var(--cms-text)]"
                          >
                            {listCfg?.columnLabels?.[col] ?? toLabel(col)}
                            <SortIndicator field={col} currentSort={currentSort} />
                          </button>
                        </TableHead>
                      )
                    })}
                    {listCfg?.statusField && (
                      <TableHead className="min-w-[100px]">
                        {listCfg.columnLabels?.[listCfg.statusField] ??
                          toLabel(listCfg.statusField)}
                      </TableHead>
                    )}
                    <TableHead className="w-[52px]">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {docs.map((doc) => {
                    const defaultURL = `/admin/collections/${slug}/${String(doc.id)}`
                    const editURL = listCfg?.editURL ? listCfg.editURL(String(doc.id)) : defaultURL
                    return (
                      <TableRow key={String(doc.id)} className="group">
                        {columns.map((col, i) => {
                          if (listCfg?.statusField && col === listCfg.statusField) return null
                          const colType = listCfg?.columnType?.[col]

                          return (
                            <TableCell key={col}>
                              {colType === 'email' ? (
                                <EmailCellInline value={String(doc[col] ?? '')} editURL={editURL} />
                              ) : colType === 'role' ? (
                                <RoleBadge value={String(doc[col] ?? '')} />
                              ) : i === 0 ? (
                                <Link
                                  href={editURL}
                                  className="font-medium text-[var(--cms-text)] transition-colors hover:text-[var(--cms-primary)]"
                                >
                                  <CellValue value={doc[col]} />
                                </Link>
                              ) : (
                                <CellValue value={doc[col]} />
                              )}
                            </TableCell>
                          )
                        })}

                        {listCfg?.statusField && listCfg.statusConfig && (
                          <TableCell>
                            <StatusBadgeCell
                              value={String(doc[listCfg.statusField] ?? '')}
                              config={listCfg.statusConfig}
                            />
                          </TableCell>
                        )}

                        <TableCell>
                          <ActionMenu
                            editURL={editURL}
                            slug={slug}
                            id={String(doc.id)}
                            isTrashView={isTrashView}
                            canDelete={canDelete}
                            onActionComplete={refreshList}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-[var(--cms-border-subtle)] px-6 py-3.5">
              <p className="text-[13px] text-[var(--cms-text-muted)]">
                <span className="font-medium text-[var(--cms-text-secondary)]">
                  {startIndex}–{endIndex}
                </span>{' '}
                of{' '}
                <span className="font-medium text-[var(--cms-text-secondary)]">
                  {totalDocs.toLocaleString()}
                </span>
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 rounded-lg text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-muted)] hover:text-[var(--cms-text)] disabled:opacity-30"
                  disabled={currentPage <= 1}
                  onClick={() => void handlePageChange?.(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page: number
                  if (totalPages <= 5) {
                    page = i + 1
                  } else if (currentPage <= 3) {
                    page = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i
                  } else {
                    page = currentPage - 2 + i
                  }
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => void handlePageChange?.(page)}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-medium transition-colors',
                        page === currentPage
                          ? 'bg-[var(--cms-primary)] text-white'
                          : 'text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-muted)] hover:text-[var(--cms-text)]',
                      )}
                    >
                      {page}
                    </button>
                  )
                })}

                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 rounded-lg text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-muted)] hover:text-[var(--cms-text)] disabled:opacity-30"
                  disabled={currentPage >= totalPages}
                  onClick={() => void handlePageChange?.(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
