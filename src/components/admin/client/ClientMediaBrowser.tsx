'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Search,
  Image as ImageIcon,
  FileText,
  File,
  X,
  Copy,
  ExternalLink,
  PenLine,
  Trash2,
  Upload,
  FolderOpen,
  ChevronRight,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

/* ─── Types ───────────────────────────────────────────────────────── */

export interface MediaItem {
  id: string | number
  alt?: string | null
  caption?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  url?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

interface ClientMediaBrowserProps {
  siteKey: string
  initialMedia: MediaItem[]
  totalAll: number
  totalImages: number
  totalPdfs: number
  totalOther: number
  uploadHref: string
}

type FilterTab = 'all' | 'images' | 'pdfs' | 'other'

/* ─── Helpers ─────────────────────────────────────────────────────── */

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(value?: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getFileIcon(mimeType?: string | null) {
  if (!mimeType) return File
  if (mimeType.startsWith('image/')) return ImageIcon
  if (mimeType.includes('pdf')) return FileText
  return File
}

function getFileLabel(mimeType?: string | null): string {
  if (!mimeType) return 'File'
  if (mimeType.startsWith('image/')) return mimeType.replace('image/', '').toUpperCase()
  if (mimeType.includes('pdf')) return 'PDF'
  const parts = mimeType.split('/')
  return (parts[1] ?? parts[0] ?? 'FILE').toUpperCase().slice(0, 8)
}

function isImage(mimeType?: string | null): boolean {
  return Boolean(mimeType?.startsWith('image/'))
}

/* ─── Main Component ─────────────────────────────────────────────── */

export default function ClientMediaBrowser({
  siteKey,
  initialMedia,
  totalAll,
  totalImages,
  totalPdfs,
  totalOther,
  uploadHref,
}: ClientMediaBrowserProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [search, setSearch] = useState('')
  const [media, setMedia] = useState<MediaItem[]>(initialMedia)
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [copied, setCopied] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All Files', count: totalAll },
    { key: 'images', label: 'Images', count: totalImages },
    { key: 'pdfs', label: 'PDFs', count: totalPdfs },
    { key: 'other', label: 'Other', count: totalOther },
  ]

  const fetchMedia = useCallback(
    async (filter: FilterTab, query: string) => {
      setLoading(true)
      try {
        const conditions: Array<Record<string, unknown>> = [
          { siteId: { equals: siteKey } },
          {
            or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }],
          },
        ]

        if (filter === 'images') {
          conditions.push({ mimeType: { contains: 'image' } })
        } else if (filter === 'pdfs') {
          conditions.push({ mimeType: { contains: 'pdf' } })
        } else if (filter === 'other') {
          conditions.push({ mimeType: { not_in: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'] } })
        }

        if (query) {
          conditions.push({
            or: [
              { alt: { contains: query } },
              { filename: { contains: query } },
              { caption: { contains: query } },
            ],
          })
        }

        const where = JSON.stringify({ and: conditions })
        const url = `/api/media?where=${encodeURIComponent(where)}&limit=50&sort=-createdAt&depth=0`

        const res = await fetch(url, { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to fetch media')
        const data = await res.json()
        setMedia((data.docs as MediaItem[]) ?? [])
      } catch {
        toast.error('Failed to load media')
      } finally {
        setLoading(false)
      }
    },
    [siteKey],
  )

  // Debounce search + filter changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      void fetchMedia(activeFilter, search)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [activeFilter, search, fetchMedia])

  async function handleCopyUrl() {
    if (!selectedItem?.url) return
    try {
      await navigator.clipboard.writeText(selectedItem.url)
      setCopied(true)
      toast.success('URL copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy URL')
    }
  }

  async function handleDelete() {
    if (!selectedItem) return
    try {
      const res = await fetch('/api/trash', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          collection: 'media',
          id: String(selectedItem.id),
        }),
      })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success(`"${selectedItem.alt ?? selectedItem.filename ?? 'File'}" moved to trash`)
      setSelectedItem(null)
      void fetchMedia(activeFilter, search)
    } catch {
      toast.error('Failed to move file to trash')
    }
  }

  const FileIcon = selectedItem ? getFileIcon(selectedItem.mimeType) : File

  return (
    <div className="overflow-hidden rounded-[28px] border border-(--cms-card-border) bg-(--cms-card-bg)">
      <div className="flex min-h-[600px] flex-col xl:flex-row">
        {/* ── Left sidebar: Filter tabs ────────────────────────────── */}
        <aside className="shrink-0 border-b border-(--cms-border-subtle) p-4 xl:w-[220px] xl:border-b-0 xl:border-r xl:p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-(--cms-text-muted)">
            Library
          </p>
          <div className="flex flex-row gap-1 xl:flex-col xl:gap-0.5">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  'flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all',
                  activeFilter === tab.key
                    ? 'bg-(--cms-primary) text-white'
                    : 'text-(--cms-text-secondary) hover:bg-(--cms-bg-muted) hover:text-(--cms-text)',
                )}
              >
                <span className="truncate">{tab.label}</span>
                <span
                  className={cn(
                    'ml-2 shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-semibold',
                    activeFilter === tab.key
                      ? 'bg-white/20 text-white'
                      : 'bg-(--cms-bg-muted) text-(--cms-text-muted)',
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* ── Center: Search + Grid ────────────────────────────────── */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Search bar */}
          <div className="flex items-center gap-3 border-b border-(--cms-border-subtle) px-4 py-3.5 sm:px-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--cms-text-muted)" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, alt text…"
                className="h-10 rounded-xl border-(--cms-border) bg-(--cms-bg-muted) pl-9 text-sm focus:bg-(--cms-bg)"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--cms-text-muted) hover:text-(--cms-text)"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <Link href={uploadHref} className="shrink-0">
              <Button
                size="sm"
                className="h-10 gap-2 rounded-xl bg-(--cms-primary) px-4 text-sm font-semibold text-white hover:bg-(--cms-primary-hover)"
              >
                <Upload className="size-4" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
            </Link>
          </div>

          {/* Grid content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="space-y-3 text-center">
                  <div className="mx-auto size-8 animate-spin rounded-full border-2 border-(--cms-primary) border-t-transparent"></div>
                  <p className="text-sm text-(--cms-text-muted)">Loading media…</p>
                </div>
              </div>
            ) : media.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[20px] border border-dashed border-(--cms-border) bg-(--cms-bg-muted) px-6 py-14 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-(--cms-card-bg) text-(--cms-text-muted)">
                  <FolderOpen className="size-6" />
                </div>
                <p className="mt-4 text-base font-semibold tracking-[-0.02em] text-(--cms-text)">
                  {search ? 'No results found' : 'No media yet'}
                </p>
                <p className="mt-2 max-w-xs text-sm text-(--cms-text-secondary)">
                  {search
                    ? `No files match "${search}". Try a different search term.`
                    : 'Upload your first file to start building the media library for this site.'}
                </p>
                {!search && (
                  <Link href={uploadHref} className="mt-5">
                    <Button className="gap-2 rounded-xl bg-(--cms-primary) px-5 text-sm font-semibold text-white hover:bg-(--cms-primary-hover)">
                      <Upload className="size-4" />
                      Upload File
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {media.map((item) => {
                  const isSelected = selectedItem?.id === item.id
                  const imgFile = isImage(item.mimeType)
                  const ItemFileIcon = getFileIcon(item.mimeType)

                  return (
                    <button
                      key={String(item.id)}
                      onClick={() => setSelectedItem(isSelected ? null : item)}
                      className={cn(
                        'group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-150',
                        isSelected
                          ? 'border-(--cms-primary) shadow-[0_0_0_3px_var(--cms-primary-soft)]'
                          : 'border-(--cms-card-border) bg-(--cms-card-bg) hover:border-(--cms-primary) hover:shadow-sm',
                      )}
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-square w-full overflow-hidden bg-(--cms-bg-muted)">
                        {imgFile && item.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.url}
                            alt={item.alt ?? item.filename ?? ''}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3">
                            <ItemFileIcon className="size-8 text-(--cms-text-secondary)" />
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-(--cms-text-muted)">
                              {getFileLabel(item.mimeType)}
                            </span>
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-(--cms-primary)/10" />
                        )}
                      </div>

                      {/* Card footer */}
                      <div className="w-full border-t border-(--cms-border-subtle) bg-(--cms-card-bg) px-2.5 py-2 text-left">
                        <p className="truncate text-[12px] font-medium text-(--cms-text)">
                          {item.alt ?? item.filename ?? 'Untitled'}
                        </p>
                        <p className="mt-0.5 text-[11px] text-(--cms-text-muted)">
                          {formatBytes(item.filesize)}
                        </p>
                      </div>

                      {/* Selected check */}
                      {isSelected && (
                        <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-(--cms-primary) text-white">
                          <Check className="size-3" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Right panel: Details ─────────────────────────────────── */}
        <aside
          className={cn(
            'shrink-0 border-t border-(--cms-border-subtle) xl:w-[300px] xl:border-l xl:border-t-0 2xl:w-[320px]',
          )}
        >
          {!selectedItem ? (
            /* Empty state */
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center px-6 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-(--cms-bg-muted) text-(--cms-text-muted)">
                <ImageIcon className="size-5" />
              </div>
              <p className="mt-4 text-sm font-medium text-(--cms-text)">No file selected</p>
              <p className="mt-1 text-xs text-(--cms-text-secondary)">
                Click any file in the grid to view its details here.
              </p>
            </div>
          ) : (
            /* File details */
            <div className="flex h-full flex-col">
              {/* Preview */}
              <div className="flex min-h-[160px] items-center justify-center border-b border-(--cms-border-subtle) bg-(--cms-bg-muted) p-4">
                {isImage(selectedItem.mimeType) && selectedItem.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.alt ?? selectedItem.filename ?? ''}
                    className="max-h-[140px] rounded-xl object-contain shadow-sm"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <FileIcon className="size-12 text-(--cms-text-secondary)" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-(--cms-text-muted)">
                      {getFileLabel(selectedItem.mimeType)}
                    </span>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="flex-1 space-y-1 overflow-y-auto p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                  File Details
                </p>

                {(
                  [
                    { label: 'Name', value: selectedItem.filename },
                    { label: 'Alt Text', value: selectedItem.alt },
                    {
                      label: 'Type',
                      value: getFileLabel(selectedItem.mimeType),
                    },
                    { label: 'Size', value: formatBytes(selectedItem.filesize) },
                    ...(selectedItem.width && selectedItem.height
                      ? [
                          {
                            label: 'Dimensions',
                            value: `${selectedItem.width}×${selectedItem.height}`,
                          },
                        ]
                      : []),
                    { label: 'Caption', value: selectedItem.caption },
                    { label: 'Uploaded', value: formatDate(selectedItem.createdAt) },
                  ] as Array<{ label: string; value?: string | null | number }>
                )
                  .filter((row) => Boolean(row.value))
                  .map((row) => (
                    <div
                      key={row.label}
                      className="flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-(--cms-bg-muted)"
                    >
                      <p className="shrink-0 text-xs font-medium text-(--cms-text-muted)">
                        {row.label}
                      </p>
                      <p className="min-w-0 break-all text-right text-xs text-(--cms-text)">
                        {String(row.value)}
                      </p>
                    </div>
                  ))}

                {selectedItem.mimeType && (
                  <div className="pt-1">
                    <Badge className="rounded-lg border-0 bg-(--cms-bg-muted) px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-(--cms-text-secondary)">
                      {selectedItem.mimeType}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="shrink-0 space-y-2 border-t border-(--cms-border-subtle) p-4">
                <Button
                  onClick={handleCopyUrl}
                  variant="outline"
                  className="h-9 w-full gap-2 rounded-xl border-(--cms-border) text-sm font-medium text-(--cms-text-secondary) hover:text-(--cms-text)"
                  disabled={!selectedItem.url}
                >
                  {copied ? (
                    <Check className="size-3.5 text-(--cms-success)" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  {copied ? 'Copied!' : 'Copy URL'}
                </Button>

                {selectedItem.url && (
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-(--cms-border) text-sm font-medium text-(--cms-text-secondary) transition hover:bg-(--cms-bg-muted) hover:text-(--cms-text)"
                  >
                    <ExternalLink className="size-3.5" />
                    Open File
                  </a>
                )}

                <Link href={`/admin/collections/media/${selectedItem.id}`} className="block">
                  <Button
                    variant="outline"
                    className="h-9 w-full gap-2 rounded-xl border-(--cms-border) text-sm font-medium text-(--cms-text-secondary) hover:text-(--cms-text)"
                  >
                    <PenLine className="size-3.5" />
                    Edit Details
                  </Button>
                </Link>

                <button
                  onClick={() => void handleDelete()}
                  className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-(--cms-danger-soft) text-sm font-medium text-(--cms-danger-text) transition hover:bg-(--cms-danger-soft)"
                >
                  <Trash2 className="size-3.5" />
                  Move to Trash
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
