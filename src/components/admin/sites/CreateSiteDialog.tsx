'use client'

import { useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Globe, Loader2, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function CreateSiteDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [siteName, setSiteName] = useState('')
  const [siteSlug, setSiteSlug] = useState('')
  const [domain, setDomain] = useState('')
  const [subdomain, setSubdomain] = useState('')
  const [defaultLanguage, setDefaultLanguage] = useState('en')

  const suggestedSlug = useMemo(() => slugify(siteName), [siteName])

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedSiteName = siteName.trim()
    const normalizedSiteSlug = slugify(siteSlug || suggestedSlug)
    const normalizedDomain = domain.trim()
    const normalizedSubdomain = subdomain.trim()

    if (!normalizedSiteName) {
      toast.error('Site name is required.')
      return
    }

    if (!normalizedSiteSlug) {
      toast.error('Slug is required.')
      return
    }

    if (!normalizedDomain && !normalizedSubdomain) {
      toast.error('Provide a domain or subdomain.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteName: normalizedSiteName,
          siteId: normalizedSiteSlug,
          domain: normalizedDomain || undefined,
          subdomain: normalizedSubdomain || undefined,
          defaultLanguage: defaultLanguage.trim() || 'en',
          status: 'active',
        }),
      })

      if (!response.ok) {
        throw new Error(`Create failed with status ${response.status}`)
      }

      const payload = (await response.json()) as { doc?: { id?: number | string }; id?: number | string }
      const createdID = payload?.doc?.id ?? payload?.id

      toast.success('Site created successfully.')
      setOpen(false)

      if (createdID) {
        window.location.href = `/admin/collections/sites/${String(createdID)}/pages`
        return
      }

      window.location.href = '/admin/collections/sites'
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create site.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button className="h-11 rounded-xl bg-(--cms-primary) px-5 text-sm font-semibold text-white hover:bg-(--cms-primary-hover)">
          <Plus className="size-4" />
          Create site
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-70 bg-black/45 backdrop-blur-[1px]" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-80 w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2',
            'rounded-2xl border border-(--cms-card-border) bg-(--cms-card-bg) p-6 shadow-(--cms-card-shadow) sm:p-7',
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-semibold text-(--cms-text)">
                Quick Create Site
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-(--cms-text-secondary)">
                Create a site quickly, then continue in the full native workspace.
              </Dialog.Description>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-lg border border-(--cms-border) text-(--cms-text-secondary) transition hover:bg-(--cms-bg-elevated) hover:text-(--cms-text)"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleCreate} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                  Site Name
                </span>
                <input
                  value={siteName}
                  onChange={(event) => setSiteName(event.target.value)}
                  placeholder="TechFlow SaaS"
                  className="mt-2 h-11 w-full rounded-xl border border-(--cms-input-border) bg-(--cms-input-bg) px-3 text-sm text-(--cms-text) outline-none transition focus:border-(--cms-primary) focus:ring-4 focus:ring-(--cms-input-focus-ring)"
                />
              </label>

              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                  Slug
                </span>
                <input
                  value={siteSlug}
                  onChange={(event) => setSiteSlug(event.target.value)}
                  placeholder={suggestedSlug || 'techflow-saas'}
                  className="mt-2 h-11 w-full rounded-xl border border-(--cms-input-border) bg-(--cms-input-bg) px-3 text-sm text-(--cms-text) outline-none transition focus:border-(--cms-primary) focus:ring-4 focus:ring-(--cms-input-focus-ring)"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                  Domain
                </span>
                <input
                  value={domain}
                  onChange={(event) => setDomain(event.target.value)}
                  placeholder="example.com"
                  className="mt-2 h-11 w-full rounded-xl border border-(--cms-input-border) bg-(--cms-input-bg) px-3 text-sm text-(--cms-text) outline-none transition focus:border-(--cms-primary) focus:ring-4 focus:ring-(--cms-input-focus-ring)"
                />
              </label>

              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                  Subdomain
                </span>
                <input
                  value={subdomain}
                  onChange={(event) => setSubdomain(event.target.value)}
                  placeholder="techflow"
                  className="mt-2 h-11 w-full rounded-xl border border-(--cms-input-border) bg-(--cms-input-bg) px-3 text-sm text-(--cms-text) outline-none transition focus:border-(--cms-primary) focus:ring-4 focus:ring-(--cms-input-focus-ring)"
                />
              </label>
            </div>

            <label>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                Default Language
              </span>
              <input
                value={defaultLanguage}
                onChange={(event) => setDefaultLanguage(event.target.value)}
                placeholder="en"
                className="mt-2 h-11 w-full rounded-xl border border-(--cms-input-border) bg-(--cms-input-bg) px-3 text-sm text-(--cms-text) outline-none transition focus:border-(--cms-primary) focus:ring-4 focus:ring-(--cms-input-focus-ring)"
              />
            </label>

            <div className="rounded-xl border border-(--cms-primary-soft) bg-(--cms-primary-soft) p-3 text-xs text-(--cms-primary-text)">
              <div className="flex items-center gap-2">
                <Globe className="size-3.5" />
                After creation, you will land directly in the site workspace.
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <LinkButton href="/admin/collections/sites/create" label="Open Full Create Form" />

              <div className="flex gap-2">
                <Dialog.Close asChild>
                  <Button type="button" variant="outline" className="h-11 rounded-xl">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 rounded-xl bg-(--cms-primary) px-5 text-sm font-semibold text-white hover:bg-(--cms-primary-hover)"
                >
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                  {isSubmitting ? 'Creating...' : 'Create Site'}
                </Button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex h-11 items-center rounded-xl px-3 text-sm font-medium text-(--cms-text-secondary) no-underline transition hover:bg-(--cms-bg-elevated) hover:text-(--cms-text)"
    >
      {label}
    </a>
  )
}