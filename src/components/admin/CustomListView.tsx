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
import { toast } from 'sonner'
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
  Globe,
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
import UsersListStats from '@/components/admin/collection/UsersListStats'
import PagesListStats from '@/components/admin/collection/PagesListStats'
import StudentCasesListStats from '@/components/admin/collection/StudentCasesListStats'
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
  columnType?: Record<string, 'email' | 'role' | 'site'>
  editURL?: (id: string) => string
}

const LIST_VIEW_CONFIGS: Record<string, ListViewCollectionConfig> = {
  users: {
    description: 'Manage user accounts and permissions',
    columnType: { email: 'email', role: 'role', siteId: 'site' },
    columnLabels: { createdAt: 'Created', updatedAt: 'Updated', siteId: 'Site' },
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
  'marketing-pages': {
    description: 'Platform marketing pages for monocms.app',
    statusField: 'status',
    statusConfig: {
      draft: { label: 'Draft', variant: 'warning' },
      published: { label: 'Published', variant: 'success' },
    },
    editURL: (id: string) => `/admin/collections/marketing-pages/${id}`,
  },
  'student-cases': {
    description: 'Track student consultation and admissions workflow',
    statusField: 'status',
    statusConfig: {
      new: { label: 'New', variant: 'info' },
      'in-progress': { label: 'In Progress', variant: 'info' },
      'waiting-student': { label: 'Waiting Student', variant: 'warning' },
      'waiting-institution': { label: 'Waiting Institution', variant: 'warning' },
      completed: { label: 'Completed', variant: 'success' },
      'closed-lost': { label: 'Closed Lost', variant: 'danger' },
    },
    columnLabels: {
      fullName: 'Student',
      email: 'Email',
      currentStage: 'Stage',
      priority: 'Priority',
      nextActionDate: 'Next Action',
      siteId: 'Site',
      updatedAt: 'Updated',
    },
    columnType: {
      email: 'email',
      siteId: 'site',
    },
    editURL: (id: string) => `/admin/collections/student-cases/${id}/workspace`,
  },
}

const STATS_COMPONENTS: Record<string, React.ComponentType> = {
  users: UsersListStats,
  pages: PagesListStats,
  'student-cases': StudentCasesListStats,
}

// ─── Status Variant Styles ───────────────────────────────────────────

const STATUS_VARIANT_CLASSES: Record<string, string> = {
  success: 'bg-(--cms-success-soft) text-(--cms-success-text) border-(--cms-success-soft)',
  warning: 'bg-(--cms-warning-soft) text-(--cms-warning-text) border-(--cms-warning-soft)',
  danger: 'bg-(--cms-danger-soft) text-(--cms-danger-text) border-(--cms-danger-soft)',
  info: 'bg-(--cms-info-soft) text-(--cms-info-text) border-(--cms-info-soft)',
  default: 'bg-(--cms-bg-muted) text-(--cms-text-secondary) border-(--cms-border-subtle)',
}

const ROLE_VARIANT_CLASSES: Record<string, string> = {
  'super-admin': 'bg-(--cms-info-soft) text-(--cms-info-text) border-(--cms-info-soft)',
  client: 'bg-(--cms-warning-soft) text-(--cms-warning-text) border-(--cms-warning-soft)',
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
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--cms-primary-soft) text-(--cms-primary)">
        <User className="h-3.5 w-3.5" />
      </div>
      <span className="font-medium text-(--cms-text) transition-colors group-hover/email:text-(--cms-primary)">
        {value}
      </span>
    </Link>
  )
}

function RoleBadge({ value }: { value: string }) {
  const style =
    ROLE_VARIANT_CLASSES[value] ??
    'bg-(--cms-bg-muted) text-(--cms-text-secondary) border-(--cms-border-subtle)'
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

function SiteBadge({ value }: { value: string }) {
  if (!value) return <span className="text-(--cms-text-muted)">—</span>
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-full px-2.5 py-0.5 text-[11px] font-medium',
        'bg-(--cms-primary-soft) text-(--cms-primary) border-(--cms-primary-soft)',
      )}
    >
      <Globe className="mr-1 inline h-3 w-3" />
      {value}
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
  if (!def) return <span className="text-(--cms-text-muted)">{value || '—'}</span>
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
    return <span className="text-(--cms-text-muted)">—</span>
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
    return <span className="text-(--cms-text-muted) tabular-nums">{formatDate(value)}</span>
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return <>{String(value)}</>
  }

  if (Array.isArray(value)) {
    return (
      <Badge
        variant="outline"
        className="rounded-full px-2.5 py-0.5 text-[11px] text-(--cms-text-muted) border-(--cms-border)"
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
              className="h-8 w-8 rounded-lg border border-(--cms-border) object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--cms-border) bg-(--cms-bg-muted)">
              <FileText className="h-3.5 w-3.5 text-(--cms-text-muted)" />
            </div>
          )}
          <span className="max-w-45 truncate text-[13px]">{filename}</span>
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
    return <ChevronUp className="ml-1 inline h-3.5 w-3.5 text-(--cms-primary)" />
  if (currentSort === `-${field}`)
    return <ChevronDown className="ml-1 inline h-3.5 w-3.5 text-(--cms-primary)" />
  return (
    <ChevronsUpDown className="ml-1 inline h-3.5 w-3.5 text-(--cms-text-muted) opacity-0 transition-opacity group-hover/sort:opacity-100" />
  )
}

function ActionMenu({
  editURL,
  apiRoute,
  slug,
  id,
  singularLabel,
  isTrashView,
  canDelete,
  onActionComplete,
}: {
  editURL: string
  apiRoute: string
  slug: string
  id: string
  singularLabel: string
  isTrashView: boolean
  canDelete: boolean
  onActionComplete: () => void
}) {
  const [isWorking, setIsWorking] = React.useState(false)
  const [confirm, setConfirm] = React.useState<{
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

  function formatError(action: string, error: unknown) {
    const message = error instanceof Error ? error.message : ''
    return `${action}${message ? ` (${message})` : ''}`
  }
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

  function handleTrash() {
    if (!canDelete || isWorking) return
    setConfirm({
      open: true,
      title: 'Move to Trash',
      description: `This ${singularLabel.toLowerCase()} will be moved to trash. You can restore it later.`,
      label: 'Move to Trash',
      variant: 'danger',
      action: async () => {
        try {
          setIsWorking(true)
          await runAction(`${apiRoute}/${slug}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: true }),
          })
          toast.success(`${singularLabel} moved to trash.`)
        } catch (error) {
          toast.error(formatError('Unable to move document to trash', error))
        } finally {
          setIsWorking(false)
        }
      },
    })
  }

  function handleRestore() {
    if (!canDelete || isWorking) return
    setConfirm({
      open: true,
      title: 'Restore Document',
      description: `Restore this ${singularLabel.toLowerCase()} so it becomes active again?`,
      label: 'Restore',
      variant: 'default',
      action: async () => {
        try {
          setIsWorking(true)
          await runAction(`${apiRoute}/${slug}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: false }),
          })
          toast.success(`${singularLabel} restored.`)
        } catch (error) {
          toast.error(formatError('Unable to restore document', error))
        } finally {
          setIsWorking(false)
        }
      },
    })
  }

  function handlePermanentDelete() {
    if (!canDelete || isWorking) return
    setConfirm({
      open: true,
      title: 'Delete Permanently',
      description: `This ${singularLabel.toLowerCase()} will be permanently deleted. This cannot be undone.`,
      label: 'Delete Permanently',
      variant: 'danger',
      action: async () => {
        try {
          setIsWorking(true)
          await runAction(`${apiRoute}/${slug}/${id}`, { method: 'DELETE' })
          toast.success(`${singularLabel} permanently deleted.`)
        } catch (error) {
          toast.error(formatError('Unable to permanently delete document', error))
        } finally {
          setIsWorking(false)
        }
      },
    })
  }

  const editHref = isTrashView ? `${editURL}?trash=true` : editURL

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={isWorking}
            className="h-8 w-8 rounded-lg text-(--cms-text-muted) opacity-100 transition-all hover:bg-(--cms-bg-muted) hover:text-(--cms-text) sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-40"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-44 rounded-xl border-(--cms-border) bg-(--cms-card-bg) shadow-lg"
        >
          <DropdownMenuItem className="rounded-lg text-(--cms-text-secondary)" asChild>
            <Link href={editHref}>
              <Eye className="mr-2 size-4" />
              Open
            </Link>
          </DropdownMenuItem>
          {!isTrashView && (
            <DropdownMenuItem className="rounded-lg text-(--cms-text-secondary)" asChild>
              <Link href={editURL}>
                <Pencil className="mr-2 size-4" />
                Edit
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator className="bg-(--cms-border-subtle)" />

          {isTrashView ? (
            <>
              <DropdownMenuItem
                className="rounded-lg text-(--cms-text-secondary)"
                onSelect={(event) => {
                  event.preventDefault()
                  handleRestore()
                }}
                disabled={!canDelete || isWorking}
              >
                <RotateCcw className="mr-2 size-4" />
                Restore
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg text-(--cms-danger-text) focus:bg-(--cms-danger-soft) focus:text-(--cms-danger-text)"
                onSelect={(event) => {
                  event.preventDefault()
                  handlePermanentDelete()
                }}
                disabled={!canDelete || isWorking}
              >
                <ShieldAlert className="mr-2 size-4" />
                Delete Permanently
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              className="rounded-lg text-(--cms-danger-text) focus:bg-(--cms-danger-soft) focus:text-(--cms-danger-text)"
              onSelect={(event) => {
                event.preventDefault()
                handleTrash()
              }}
              disabled={!canDelete || isWorking}
            >
              <Trash2 className="mr-2 size-4" />
              Move to Trash
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

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
    </>
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
  const userRole = user && 'role' in user ? String((user as { role?: string }).role ?? '') : ''
  const isTrashView = false // Trash is now centralized at /admin/trash

  const collectionConfig = config?.collections?.find((c) => c.slug === slug)
  const listCfg = LIST_VIEW_CONFIGS[slug]

  const hasCreatePermission = Boolean(user)
  const canDelete = Boolean(user) // Any authenticated user can soft-delete
  const apiRoute = (config?.routes?.api as string | undefined) ?? '/api'
  const newDocURL = slug ? `/admin/collections/${slug}/create` : undefined
  const trashURL = '/admin/trash' // Global trash page

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

  // Block native Pages list for non-super-admin: redirect to their Site Pages workspace
  const userSiteId =
    user && 'siteId' in user ? String((user as { siteId?: string }).siteId ?? '') : ''
  React.useEffect(() => {
    if (slug === 'pages' && userRole !== 'super-admin') {
      // Resolve the client's site doc ID so we can redirect to the workspace
      const apiRoute = (config?.routes?.api as string | undefined) ?? '/api'
      if (userSiteId) {
        fetch(
          `${apiRoute}/sites?where[siteId][equals]=${encodeURIComponent(userSiteId)}&limit=1&depth=0`,
          { credentials: 'include' },
        )
          .then((res) => res.json())
          .then((data) => {
            const doc = data?.docs?.[0]
            if (doc?.id) {
              router.replace(`/admin/collections/sites/${doc.id}/pages`)
            } else {
              router.replace('/admin/collections/sites')
            }
          })
          .catch(() => router.replace('/admin/collections/sites'))
      } else {
        router.replace('/admin/collections/sites')
      }
    }
  }, [slug, userRole, userSiteId, router, config?.routes?.api])

  function refreshList() {
    router.refresh()
  }

  if (slug === 'pages' && userRole !== 'super-admin') return null

  if (!data) {
    return (
      <div className="px-6 pb-6 pt-5">
        <div className="mb-6 h-20 animate-pulse rounded-2xl border border-(--cms-card-border) bg-(--cms-bg-muted)" />
        <div className="space-y-3 rounded-2xl border border-(--cms-card-border) bg-(--cms-card-bg) p-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={`list-skeleton-${idx}`}
              className="h-12 animate-pulse rounded-xl bg-(--cms-bg-muted)"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 pb-6 pt-5">
      <AdminPageHeader
        title={isTrashView ? `${pluralLabel} Trash` : pluralLabel}
        description={
          isTrashView
            ? `Restore or permanently delete archived ${pluralLabel.toLowerCase()}.`
            : (listCfg?.description ?? `Manage ${pluralLabel.toLowerCase()} for your workspace.`)
        }
        isTrashView={isTrashView}
        primaryActionLabel={
          !isTrashView && hasCreatePermission ? `New ${singularLabel}` : undefined
        }
        primaryActionHref={!isTrashView && hasCreatePermission ? newDocURL : undefined}
        trashActionHref={trashURL}
        totalDocs={totalDocs}
      />

      {StatsComponent && <StatsComponent />}

      <section
        aria-labelledby="list-heading"
        className="overflow-hidden rounded-2xl border border-(--cms-card-border) bg-(--cms-card-bg)"
        style={{ boxShadow: 'var(--cms-card-shadow)' }}
      >
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-(--cms-border-subtle) px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="list-heading"
              className="text-[16px] font-semibold tracking-tight text-(--cms-text)"
            >
              {isTrashView ? `Deleted ${pluralLabel}` : pluralLabel}
            </h2>
            <p className="mt-0.5 text-[13px] text-(--cms-text-muted)">
              {`${totalDocs.toLocaleString()} ${totalDocs === 1 ? singularLabel.toLowerCase() : pluralLabel.toLowerCase()}`}
            </p>
          </div>
        </div>

        {docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--cms-bg-muted)">
              <Inbox className="h-6 w-6 text-(--cms-text-muted)" />
            </div>
            <h3 className="text-[15px] font-semibold text-(--cms-text)">
              {isTrashView
                ? `No deleted ${pluralLabel.toLowerCase()} yet`
                : `No ${pluralLabel.toLowerCase()} yet`}
            </h3>
            <p className="mt-1 text-[13px] text-(--cms-text-muted)">
              {isTrashView
                ? `Documents moved to trash will appear here.`
                : `Get started by creating your first ${singularLabel.toLowerCase()}.`}
            </p>
            {!isTrashView && hasCreatePermission && newDocURL && (
              <Link href={newDocURL} className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-(--cms-border) text-(--cms-text-secondary)"
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
                        <TableHead key={col} className="min-w-30">
                          <button
                            type="button"
                            onClick={() => toggleSort(col)}
                            className="group/sort inline-flex items-center whitespace-nowrap transition-colors hover:text-(--cms-text)"
                          >
                            {listCfg?.columnLabels?.[col] ?? toLabel(col)}
                            <SortIndicator field={col} currentSort={currentSort} />
                          </button>
                        </TableHead>
                      )
                    })}
                    {listCfg?.statusField && (
                      <TableHead className="min-w-25">
                        {listCfg.columnLabels?.[listCfg.statusField] ??
                          toLabel(listCfg.statusField)}
                      </TableHead>
                    )}
                    <TableHead className="w-13">
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
                              ) : colType === 'site' ? (
                                <SiteBadge value={String(doc[col] ?? '')} />
                              ) : i === 0 ? (
                                <Link
                                  href={editURL}
                                  className="font-medium text-(--cms-text) transition-colors hover:text-(--cms-primary)"
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
                            apiRoute={apiRoute}
                            slug={slug}
                            id={String(doc.id)}
                            singularLabel={singularLabel}
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
            <div className="flex items-center justify-between border-t border-(--cms-border-subtle) px-6 py-3.5">
              <p className="text-[13px] text-(--cms-text-muted)">
                <span className="font-medium text-(--cms-text-secondary)">
                  {startIndex}–{endIndex}
                </span>{' '}
                of{' '}
                <span className="font-medium text-(--cms-text-secondary)">
                  {totalDocs.toLocaleString()}
                </span>
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 rounded-lg text-(--cms-text-muted) hover:bg-(--cms-bg-muted) hover:text-(--cms-text) disabled:opacity-30"
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
                          ? 'bg-(--cms-primary) text-white'
                          : 'text-(--cms-text-muted) hover:bg-(--cms-bg-muted) hover:text-(--cms-text)',
                      )}
                    >
                      {page}
                    </button>
                  )
                })}

                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 rounded-lg text-(--cms-text-muted) hover:bg-(--cms-bg-muted) hover:text-(--cms-text) disabled:opacity-30"
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
