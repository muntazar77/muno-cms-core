'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { startTransition, useState, type ComponentType, type ReactNode } from 'react'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock3,
  Globe,
  Languages,
  Link2,
  Mail,
  Palette,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import SitePreviewActions from '@/components/admin/shared/SitePreviewActions'
import { cn } from '@/lib/utils'

interface LinkItem {
  label: string
  url: string
  id?: string
  platform?: string
}

interface MediaOption {
  id: string
  label: string
}

interface OwnerOption {
  id: string
  email: string
}

interface SiteSettingsShape {
  id: string
  siteId: string
  siteName: string
  siteDescription: string
  domain: string
  subdomain: string
  status: string
  defaultLanguage: string
  timezone: string
  owner: string
  logo: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  headerNav: LinkItem[]
  ctaLabel: string
  ctaUrl: string
  showSiteTitle: boolean
  showLanguageSwitcher: boolean
  showThemeToggle: boolean
  stickyHeader: boolean
  footerLinks: LinkItem[]
  socialLinks: LinkItem[]
  showNewsletterSignup: boolean
  footerTagline: string
  footerNote: string
  copyrightText: string
  defaultMetaTitle: string
  defaultMetaDescription: string
  ogImage: string
  twitterImage: string
  allowIndexing: boolean
  publicEmail: string
  phone: string
  whatsapp: string
  address: string
}

interface SiteSettingsEditorProps {
  backHref: string
  previewURL: string
  liveURL: string
  mediaOptions: MediaOption[]
  ownerOptions: OwnerOption[]
  canEditOwner: boolean
  site: SiteSettingsShape
}

type TabKey = 'general' | 'branding' | 'navigation' | 'seo' | 'contact'
type ToggleKey =
  | 'showSiteTitle'
  | 'showLanguageSwitcher'
  | 'showThemeToggle'
  | 'stickyHeader'
  | 'showNewsletterSignup'
  | 'allowIndexing'

interface TabDefinition {
  key: TabKey
  label: string
  description: string
  eyebrow: string
  title: string
  panelDescription: string
  icon: ComponentType<{ className?: string }>
}

const tabs: TabDefinition[] = [
  {
    key: 'general',
    label: 'General',
    description: 'Identity, domain, locale, and publishing state.',
    eyebrow: 'Website Identity',
    title: 'General settings',
    panelDescription:
      'Manage the name, domain, language, and other essentials that define this site across your workspace.',
    icon: Globe,
  },
  {
    key: 'branding',
    label: 'Branding',
    description: 'Logo, favicon, color palette, and typography.',
    eyebrow: 'Brand Presentation',
    title: 'Branding system',
    panelDescription:
      'Control the visual identity clients will recognize across your site, from assets to colors and font choices.',
    icon: Palette,
  },
  {
    key: 'navigation',
    label: 'Navigation',
    description: 'Header, footer, links, and site chrome controls.',
    eyebrow: 'Website Structure',
    title: 'Navigation and footer',
    panelDescription:
      'Shape how visitors move through your site, what actions you feature, and how the footer supports conversion.',
    icon: Settings2,
  },
  {
    key: 'seo',
    label: 'SEO',
    description: 'Metadata defaults and indexing preferences.',
    eyebrow: 'Search Visibility',
    title: 'SEO defaults',
    panelDescription:
      'Set dependable metadata and social sharing defaults so new pages start with strong search and preview coverage.',
    icon: Search,
  },
  {
    key: 'contact',
    label: 'Contact',
    description: 'Business contact details and social profiles.',
    eyebrow: 'Public Contact',
    title: 'Contact and socials',
    panelDescription:
      'Keep your public contact details, messaging channels, and social profiles easy for visitors to discover.',
    icon: Mail,
  },
]

const navigationToggles: Array<{
  key: Extract<ToggleKey, 'showSiteTitle' | 'showLanguageSwitcher' | 'showThemeToggle' | 'stickyHeader'>
  label: string
  description: string
}> = [
  {
    key: 'showSiteTitle',
    label: 'Show site title',
    description: 'Display the website name in the header area.',
  },
  {
    key: 'showLanguageSwitcher',
    label: 'Show language switcher',
    description: 'Let visitors switch between available site languages.',
  },
  {
    key: 'showThemeToggle',
    label: 'Show theme toggle',
    description: 'Allow visitors to switch between light and dark modes.',
  },
  {
    key: 'stickyHeader',
    label: 'Sticky header',
    description: 'Keep the header visible while visitors scroll the page.',
  },
]

function sanitizeLinks(items: LinkItem[]) {
  return items.map((item) => ({
    ...(item.id ? { id: item.id } : {}),
    ...(item.platform ? { platform: item.platform } : {}),
    label: item.label,
    url: item.url,
  }))
}

function fieldInputClassName() {
  return 'mt-2 min-h-11 w-full rounded-2xl border border-[var(--cms-input-border)] bg-[var(--cms-input-bg)] px-4 py-3 text-sm text-[var(--cms-text)] outline-none transition duration-200 focus:border-[var(--cms-primary)] focus:ring-4 focus:ring-[var(--cms-input-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60'
}

function fieldLabelClassName() {
  return 'text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--cms-text-muted)]'
}

function surfaceCardClassName() {
  return 'rounded-3xl border border-[var(--cms-card-border)] bg-[var(--cms-card-bg)] shadow-[var(--cms-card-shadow)]'
}

function statusBadgeClassName(status: string) {
  if (status === 'active') {
    return 'border-[var(--cms-success-soft)] bg-[var(--cms-success-soft)] text-[var(--cms-success-text)]'
  }
  if (status === 'maintenance') {
    return 'border-[var(--cms-danger-soft)] bg-[var(--cms-danger-soft)] text-[var(--cms-danger-text)]'
  }
  return 'border-[var(--cms-warning-soft)] bg-[var(--cms-warning-soft)] text-[var(--cms-warning-text)]'
}

function resolvedDomain(domain: string, subdomain: string) {
  return domain || `${subdomain || 'draft'}.localhost`
}

function FieldShell({
  label,
  hint,
  className,
  children,
}: {
  label: string
  hint?: string
  className?: string
  children: ReactNode
}) {
  return (
    <label className={cn('block', className)}>
      <span className={fieldLabelClassName()}>{label}</span>
      {hint ? <p className="mt-1 text-xs leading-5 text-[var(--cms-text-secondary)]">{hint}</p> : null}
      {children}
    </label>
  )
}

function GroupCard({
  title,
  description,
  children,
  className,
}: {
  title: string
  description: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'rounded-[28px] border border-[var(--cms-border)] bg-[var(--cms-bg)] p-5 sm:p-6',
        className,
      )}
    >
      <div className="mb-5 flex flex-col gap-2">
        <h3 className="text-base font-semibold tracking-[-0.02em] text-[var(--cms-text)]">{title}</h3>
        <p className="max-w-3xl text-sm leading-6 text-[var(--cms-text-secondary)]">{description}</p>
      </div>
      {children}
    </section>
  )
}

function SettingsSectionCard({
  tab,
  children,
}: {
  tab: TabDefinition
  children: ReactNode
}) {
  const Icon = tab.icon

  return (
    <section
      className={cn(
        surfaceCardClassName(),
        'overflow-hidden bg-[linear-gradient(180deg,rgba(37,99,235,0.04),transparent_22%),var(--cms-card-bg)]',
      )}
    >
      <div className="border-b border-[var(--cms-border-subtle)] px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--cms-border)] bg-[var(--cms-bg)] text-[var(--cms-primary)]">
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--cms-text-muted)]">
                  {tab.eyebrow}
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[var(--cms-text)] sm:text-2xl">
                  {tab.title}
                </h2>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--cms-text-secondary)]">
              {tab.panelDescription}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--cms-border)] bg-[var(--cms-bg)] px-4 py-3 text-sm text-[var(--cms-text-secondary)]">
            <p className="font-medium text-[var(--cms-text)]">{tab.label}</p>
            <p className="mt-1 max-w-60 text-xs leading-5">{tab.description}</p>
          </div>
        </div>
      </div>
      <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </section>
  )
}

function ToggleTile({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex min-h-16 items-start justify-between gap-4 rounded-2xl border border-[var(--cms-border)] bg-[var(--cms-bg-elevated)] px-4 py-3.5 transition hover:border-[var(--cms-primary)]/40">
      <div>
        <p className="text-sm font-medium text-[var(--cms-text)]">{label}</p>
        <p className="mt-1 text-xs leading-5 text-[var(--cms-text-secondary)]">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-4 shrink-0 accent-[var(--cms-primary)]"
      />
    </label>
  )
}

function ArrayEditor({
  title,
  description,
  items,
  onChange,
  includePlatform = false,
}: {
  title: string
  description: string
  items: LinkItem[]
  onChange: (items: LinkItem[]) => void
  includePlatform?: boolean
}) {
  function updateItem(index: number, key: keyof LinkItem, value: string) {
    const nextItems = [...items]
    nextItems[index] = { ...nextItems[index], [key]: value }
    onChange(nextItems)
  }

  function addItem() {
    onChange([...items, { label: '', url: '', ...(includePlatform ? { platform: '' } : {}) }])
  }

  function removeItem(index: number) {
    onChange(items.filter((_, currentIndex) => currentIndex !== index))
  }

  return (
    <div className="rounded-[28px] border border-[var(--cms-border)] bg-[var(--cms-bg-elevated)] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-[-0.02em] text-[var(--cms-text)]">{title}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--cms-text-secondary)]">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--cms-border)] bg-[var(--cms-bg)] px-4 text-sm font-medium text-[var(--cms-text)] transition duration-200 hover:border-[var(--cms-primary)] hover:bg-[var(--cms-primary-soft)] hover:text-[var(--cms-primary-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cms-primary)]"
        >
          <Plus className="size-4" />
          {includePlatform ? 'Add social profile' : 'Add link'}
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--cms-border)] bg-[var(--cms-bg)] px-4 py-6 text-sm text-[var(--cms-text-secondary)]">
            Nothing has been added here yet.
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id ?? `${title}-${index}`}
              className={cn(
                'grid gap-3 rounded-2xl border border-[var(--cms-border)] bg-[var(--cms-bg)] p-4',
                includePlatform
                  ? 'md:grid-cols-[0.9fr_1fr_1.3fr_auto]'
                  : 'md:grid-cols-[1fr_1.4fr_auto]',
              )}
            >
              {includePlatform ? (
                <FieldShell label="Platform">
                  <input
                    value={item.platform ?? ''}
                    onChange={(event) => updateItem(index, 'platform', event.target.value)}
                    placeholder="Instagram"
                    className={fieldInputClassName()}
                  />
                </FieldShell>
              ) : null}
              <FieldShell label="Label">
                <input
                  value={item.label}
                  onChange={(event) => updateItem(index, 'label', event.target.value)}
                  placeholder={includePlatform ? 'Brand profile' : 'About us'}
                  className={fieldInputClassName()}
                />
              </FieldShell>
              <FieldShell label="URL">
                <input
                  value={item.url}
                  onChange={(event) => updateItem(index, 'url', event.target.value)}
                  placeholder="https://example.com"
                  className={fieldInputClassName()}
                />
              </FieldShell>
              <button
                type="button"
                aria-label={`Remove ${title} item ${index + 1}`}
                onClick={() => removeItem(index)}
                className="inline-flex min-h-11 items-center justify-center self-end rounded-2xl border border-[var(--cms-danger-soft)] bg-[var(--cms-danger-soft)] px-3 text-[var(--cms-danger-text)] transition duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cms-danger)]"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function SiteSettingsEditor({
  backHref,
  previewURL,
  liveURL,
  mediaOptions,
  ownerOptions,
  canEditOwner,
  site,
}: SiteSettingsEditorProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>('general')
  const [formState, setFormState] = useState<SiteSettingsShape>(site)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeletingSite, setIsDeletingSite] = useState(false)

  const activeTabMeta = tabs.find((tab) => tab.key === activeTab) ?? tabs[0]
  const currentDomain = resolvedDomain(formState.domain, formState.subdomain)

  function setField<K extends keyof SiteSettingsShape>(key: K, value: SiteSettingsShape[K]) {
    setFormState((current) => ({ ...current, [key]: value }))
  }

  function renderMediaSelect(
    label: string,
    value: string,
    onChange: (value: string) => void,
    hint?: string,
  ) {
    return (
      <FieldShell label={label} hint={hint}>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={fieldInputClassName()}
        >
          <option value="">No asset selected</option>
          {mediaOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </FieldShell>
    )
  }

  function handleSave() {
    setIsSaving(true)

    startTransition(async () => {
      try {
        const payload = {
          ...formState,
          headerNav: sanitizeLinks(formState.headerNav),
          footerLinks: sanitizeLinks(formState.footerLinks),
          socialLinks: sanitizeLinks(formState.socialLinks),
          owner: formState.owner ? Number(formState.owner) : null,
          logo: formState.logo || null,
          favicon: formState.favicon || null,
          ogImage: formState.ogImage || null,
          twitterImage: formState.twitterImage || null,
        }

        const response = await fetch(`/api/sites/${formState.id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error(`Save failed with status ${response.status}`)
        }

        toast.success('Site settings saved.')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to save site settings.')
      } finally {
        setIsSaving(false)
      }
    })
  }

  function handleMoveSiteToTrash() {
    if (!canEditOwner) return

    const confirmed = window.confirm(
      `Move site "${formState.siteName || formState.siteId}" to trash? You can restore it from Trash later.`,
    )
    if (!confirmed) return

    setIsDeletingSite(true)

    startTransition(async () => {
      try {
        const response = await fetch(`/api/sites/${formState.id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isDeleted: true }),
        })

        if (!response.ok) {
          throw new Error(`Delete failed with status ${response.status}`)
        }

        toast.success('Site moved to trash.')
        router.replace('/admin/collections/sites')
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to move site to trash.')
      } finally {
        setIsDeletingSite(false)
      }
    })
  }

  return (
    <div className="min-h-screen bg-[var(--cms-bg-elevated)] text-[var(--cms-text)]">
      <header className="sticky top-0 z-20 border-b border-[var(--cms-border-subtle)] bg-[var(--cms-card-bg)]/95 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-[1560px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
           

              <div className="mt-4 flex flex-col gap-3">
                <div>
                  <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--cms-text)] sm:text-3xl">
                    Site Settings
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--cms-text-secondary)] sm:text-[15px]">
                    Manage your website identity, branding, navigation, SEO defaults, and contact information from one calm, reliable workspace.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-[var(--cms-border)] bg-[var(--cms-bg)] px-3.5 text-sm text-[var(--cms-text-secondary)]">
                    <Globe className="size-4 text-[var(--cms-primary)]" />
                    {formState.siteName || formState.siteId || 'Untitled site'}
                  </span>
                  <span className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-[var(--cms-border)] bg-[var(--cms-bg)] px-3.5 text-sm text-[var(--cms-text-secondary)]">
                    <Link2 className="size-4 text-[var(--cms-primary)]" />
                    {currentDomain}
                  </span>
                  <span className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-[var(--cms-border)] bg-[var(--cms-bg)] px-3.5 text-sm text-[var(--cms-text-secondary)]">
                    <Languages className="size-4 text-[var(--cms-primary)]" />
                    {formState.defaultLanguage || 'en'}
                  </span>
                  <span className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-[var(--cms-border)] bg-[var(--cms-bg)] px-3.5 text-sm text-[var(--cms-text-secondary)]">
                    <Clock3 className="size-4 text-[var(--cms-primary)]" />
                    {formState.timezone || 'UTC'}
                  </span>
                  <span
                    className={cn(
                      'inline-flex min-h-10 items-center rounded-2xl border px-3.5 text-sm font-medium capitalize',
                      statusBadgeClassName(formState.status),
                    )}
                  >
                    {formState.status || 'draft'}
                  </span>
                </div>
              </div>
            </div>

            <div className="xl:sticky xl:top-4 xl:w-[560px] xl:max-w-[560px]">
              <div className={cn(surfaceCardClassName(), 'p-4 sm:p-5')}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--cms-text-muted)]">
                      Actions
                    </p>
                    <p className="text-sm leading-6 text-[var(--cms-text-secondary)]">
                      Preview changes, open the live site, and save updates whenever you are ready.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <SitePreviewActions previewURL={previewURL} liveURL={liveURL} />
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--cms-primary)] px-5 text-sm font-semibold text-white transition duration-200 hover:bg-[var(--cms-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cms-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? (
                        <ChevronRight className="size-4 animate-pulse" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      {isSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1560px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="xl:hidden">
          <div className={cn(surfaceCardClassName(), 'p-4')}>
            <FieldShell
              label="Settings Section"
              hint="Choose which part of your website you want to update."
            >
              <select
                value={activeTab}
                onChange={(event) => setActiveTab(event.target.value as TabKey)}
                className={fieldInputClassName()}
              >
                {tabs.map((tab) => (
                  <option key={tab.key} value={tab.key}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </FieldShell>
          </div>
        </div>

        <div className="mt-5 grid gap-6 xl:mt-0 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-8">
          <aside className="hidden xl:block">
            <div className="sticky top-28 space-y-4">
              <div className={cn(surfaceCardClassName(), 'p-4')}>
                <div className="rounded-[28px] border border-[var(--cms-border)] bg-[var(--cms-bg)] px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--cms-text-muted)]">
                    Website
                  </p>
                  <p className="mt-2 text-base font-semibold tracking-[-0.02em] text-[var(--cms-text)]">
                    {formState.siteName || formState.siteId || 'Untitled site'}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--cms-text-secondary)]">{currentDomain}</p>
                </div>

                <div className="mt-4">
                  <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--cms-text-muted)]">
                    Sections
                  </p>
                  <nav className="mt-3 space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      const isActive = tab.key === activeTab

                      return (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setActiveTab(tab.key)}
                          className={cn(
                            'flex w-full items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition duration-200',
                            isActive
                              ? 'border-[var(--cms-primary)] bg-[var(--cms-primary-soft)] text-[var(--cms-primary-text)]'
                              : 'border-transparent bg-transparent text-[var(--cms-text-secondary)] hover:border-[var(--cms-border)] hover:bg-[var(--cms-bg-muted)] hover:text-[var(--cms-text)]',
                          )}
                        >
                          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--cms-bg)] text-current">
                            <Icon className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{tab.label}</p>
                            <p className="mt-1 text-xs leading-5 opacity-80">{tab.description}</p>
                          </div>
                        </button>
                      )
                    })}
                  </nav>
                </div>
              </div>

              {canEditOwner ? (
                <div className={cn(surfaceCardClassName(), 'p-4')}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--cms-text-muted)]">
                    Danger Zone
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--cms-text-secondary)]">
                    Move this site to trash if it is no longer needed. You can restore it later from the central trash workspace.
                  </p>
                  <button
                    type="button"
                    onClick={handleMoveSiteToTrash}
                    disabled={isDeletingSite}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--cms-danger-soft)] bg-[var(--cms-danger-soft)] px-4 text-sm font-medium text-[var(--cms-danger-text)] transition duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cms-danger)] disabled:opacity-60"
                  >
                    <Trash2 className="size-4" />
                    {isDeletingSite ? 'Moving…' : 'Move to Trash'}
                  </button>
                </div>
              ) : null}
            </div>
          </aside>

          <div className="min-w-0 space-y-6">
            <SettingsSectionCard tab={activeTabMeta}>
              {activeTab === 'general' ? (
                <>
                  <GroupCard
                    title="Website identity"
                    description="The essentials visitors and teammates use to recognize this site across previews, dashboards, and published pages."
                  >
                    <div className="grid gap-5 lg:grid-cols-2">
                      <FieldShell
                        label="Site name"
                        hint="The primary name displayed across the site and workspace."
                      >
                        <input
                          value={formState.siteName}
                          onChange={(event) => setField('siteName', event.target.value)}
                          className={fieldInputClassName()}
                          placeholder="Acme Studio"
                        />
                      </FieldShell>
                      <FieldShell
                        label="Status"
                        hint="Use draft or maintenance when the site should not be treated as fully live."
                      >
                        <select
                          value={formState.status}
                          onChange={(event) => setField('status', event.target.value)}
                          className={fieldInputClassName()}
                        >
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </FieldShell>
                    </div>
                    <FieldShell
                      label="Site description"
                      hint="A short description of the website's purpose, tone, or audience."
                      className="mt-5"
                    >
                      <textarea
                        value={formState.siteDescription}
                        onChange={(event) => setField('siteDescription', event.target.value)}
                        className={cn(fieldInputClassName(), 'min-h-32 resize-y')}
                        placeholder="Describe what this website offers and who it is for."
                      />
                    </FieldShell>
                  </GroupCard>

                  <GroupCard
                    title="Domain and locale"
                    description="Control where the site lives online and how it behaves across language and timezone defaults."
                  >
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      <FieldShell
                        label="Primary domain"
                        hint="Use a full domain when the site is published on its own address."
                      >
                        <input
                          value={formState.domain}
                          onChange={(event) => setField('domain', event.target.value)}
                          className={fieldInputClassName()}
                          placeholder="acme.com"
                        />
                      </FieldShell>
                      <FieldShell
                        label="Subdomain"
                        hint="Useful when the site runs under a shared environment."
                      >
                        <input
                          value={formState.subdomain}
                          onChange={(event) => setField('subdomain', event.target.value)}
                          className={fieldInputClassName()}
                          placeholder="acme"
                        />
                      </FieldShell>
                      <FieldShell
                        label="Default language"
                        hint="Displayed and used as the default site language."
                      >
                        <input
                          value={formState.defaultLanguage}
                          onChange={(event) => setField('defaultLanguage', event.target.value)}
                          className={fieldInputClassName()}
                          placeholder="en"
                        />
                      </FieldShell>
                      <FieldShell
                        label="Timezone"
                        hint="Used for scheduling, dates, and operational displays."
                      >
                        <input
                          value={formState.timezone}
                          onChange={(event) => setField('timezone', event.target.value)}
                          className={fieldInputClassName()}
                          placeholder="UTC"
                        />
                      </FieldShell>
                      {canEditOwner ? (
                        <FieldShell
                          label="Site key"
                          hint="Internal site identifier used across the workspace."
                        >
                          <input
                            value={formState.siteId}
                            onChange={(event) => setField('siteId', event.target.value)}
                            className={fieldInputClassName()}
                          />
                        </FieldShell>
                      ) : null}
                      {canEditOwner ? (
                        <FieldShell
                          label="Owner"
                          hint="Assign the client account responsible for this website."
                        >
                          <select
                            value={formState.owner}
                            onChange={(event) => setField('owner', event.target.value)}
                            className={fieldInputClassName()}
                          >
                            <option value="">No owner assigned</option>
                            {ownerOptions.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.email}
                              </option>
                            ))}
                          </select>
                        </FieldShell>
                      ) : null}
                    </div>
                  </GroupCard>
                </>
              ) : null}

              {activeTab === 'branding' ? (
                <>
                  <GroupCard
                    title="Brand assets"
                    description="Choose the visual assets visitors will see first, from the main logo to browser favicon."
                  >
                    <div className="grid gap-5 md:grid-cols-2">
                      {renderMediaSelect(
                        'Logo',
                        formState.logo,
                        (value) => setField('logo', value),
                        'Used in headers, footers, and branded sections.',
                      )}
                      {renderMediaSelect(
                        'Favicon',
                        formState.favicon,
                        (value) => setField('favicon', value),
                        'Shown in browser tabs and bookmarks.',
                      )}
                    </div>
                  </GroupCard>

                  <GroupCard
                    title="Colors and typography"
                    description="Set the base colors and font family that should carry the site's brand consistently."
                  >
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1fr_1fr_320px]">
                      <FieldShell
                        label="Primary color"
                        hint="Main accent for buttons, links, and brand highlights."
                      >
                        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[var(--cms-input-border)] bg-[var(--cms-input-bg)] px-4 py-3">
                          <span
                            className="size-6 rounded-full border border-[var(--cms-border)]"
                            style={{ backgroundColor: formState.primaryColor || '#2563eb' }}
                          />
                          <input
                            value={formState.primaryColor}
                            onChange={(event) => setField('primaryColor', event.target.value)}
                            className="w-full bg-transparent text-sm text-[var(--cms-text)] outline-none"
                          />
                        </div>
                      </FieldShell>
                      <FieldShell
                        label="Secondary color"
                        hint="Support color for deeper sections, accents, or contrast areas."
                      >
                        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[var(--cms-input-border)] bg-[var(--cms-input-bg)] px-4 py-3">
                          <span
                            className="size-6 rounded-full border border-[var(--cms-border)]"
                            style={{ backgroundColor: formState.secondaryColor || '#0f172a' }}
                          />
                          <input
                            value={formState.secondaryColor}
                            onChange={(event) => setField('secondaryColor', event.target.value)}
                            className="w-full bg-transparent text-sm text-[var(--cms-text)] outline-none"
                          />
                        </div>
                      </FieldShell>
                      <div className="rounded-[28px] border border-[var(--cms-border)] bg-[var(--cms-bg-elevated)] p-5">
                        <p className={fieldLabelClassName()}>Brand preview</p>
                        <div className="mt-4 rounded-[24px] border border-[var(--cms-border)] bg-[var(--cms-bg)] p-4">
                          <div className="flex items-center gap-3">
                            <span
                              className="size-10 rounded-2xl"
                              style={{ backgroundColor: formState.primaryColor || '#2563eb' }}
                            />
                            <div>
                              <p className="text-sm font-semibold text-[var(--cms-text)]">
                                {formState.siteName || 'Your site'}
                              </p>
                              <p className="text-xs text-[var(--cms-text-secondary)]">
                                {formState.fontFamily || 'inter'} with your chosen palette
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <span
                              className="h-2.5 flex-1 rounded-full"
                              style={{ backgroundColor: formState.primaryColor || '#2563eb' }}
                            />
                            <span
                              className="h-2.5 flex-1 rounded-full"
                              style={{ backgroundColor: formState.secondaryColor || '#0f172a' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <FieldShell
                      label="Font family"
                      hint="Choose the primary type style used throughout the public site."
                      className="mt-5"
                    >
                      <select
                        value={formState.fontFamily}
                        onChange={(event) => setField('fontFamily', event.target.value)}
                        className={fieldInputClassName()}
                      >
                        <option value="inter">Inter</option>
                        <option value="geist">Geist</option>
                        <option value="poppins">Poppins</option>
                        <option value="outfit">Outfit</option>
                        <option value="plus-jakarta-sans">Plus Jakarta Sans</option>
                        <option value="dm-sans">DM Sans</option>
                      </select>
                    </FieldShell>
                  </GroupCard>
                </>
              ) : null}

              {activeTab === 'navigation' ? (
                <>
                  <GroupCard
                    title="Header experience"
                    description="Configure the main call to action and the visibility of key website controls in the header."
                  >
                    <div className="grid gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
                      <FieldShell
                        label="Call-to-action label"
                        hint="The text visitors will see on your main button."
                      >
                        <input
                          value={formState.ctaLabel}
                          onChange={(event) => setField('ctaLabel', event.target.value)}
                          className={fieldInputClassName()}
                          placeholder="Book a consultation"
                        />
                      </FieldShell>
                      <FieldShell
                        label="Call-to-action URL"
                        hint="Where the main header button should send visitors."
                      >
                        <input
                          value={formState.ctaUrl}
                          onChange={(event) => setField('ctaUrl', event.target.value)}
                          className={fieldInputClassName()}
                          placeholder="/contact"
                        />
                      </FieldShell>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      {navigationToggles.map((item) => (
                        <ToggleTile
                          key={item.key}
                          label={item.label}
                          description={item.description}
                          checked={formState[item.key]}
                          onChange={(checked) => setField(item.key, checked)}
                        />
                      ))}
                    </div>
                  </GroupCard>

                  <ArrayEditor
                    title="Main navigation links"
                    description="These links appear in the main header navigation and help visitors explore the site."
                    items={formState.headerNav}
                    onChange={(items) => setField('headerNav', items)}
                  />

                  <GroupCard
                    title="Footer content"
                    description="Add footer copy and supporting details that reinforce trust and help visitors stay oriented."
                  >
                    <div className="grid gap-5 md:grid-cols-2">
                      <FieldShell
                        label="Footer tagline"
                        hint="A short line that introduces the footer section."
                      >
                        <input
                          value={formState.footerTagline}
                          onChange={(event) => setField('footerTagline', event.target.value)}
                          className={fieldInputClassName()}
                        />
                      </FieldShell>
                      <FieldShell
                        label="Copyright text"
                        hint="Legal or brand text shown at the bottom of the site."
                      >
                        <input
                          value={formState.copyrightText}
                          onChange={(event) => setField('copyrightText', event.target.value)}
                          className={fieldInputClassName()}
                        />
                      </FieldShell>
                    </div>
                    <FieldShell
                      label="Footer note"
                      hint="Optional supporting message or brand note shown in the footer."
                      className="mt-5"
                    >
                      <textarea
                        value={formState.footerNote}
                        onChange={(event) => setField('footerNote', event.target.value)}
                        className={cn(fieldInputClassName(), 'min-h-28 resize-y')}
                      />
                    </FieldShell>
                    <div className="mt-5">
                      <ToggleTile
                        label="Show newsletter signup"
                        description="Display a newsletter capture area in the footer when available on the frontend."
                        checked={formState.showNewsletterSignup}
                        onChange={(checked) => setField('showNewsletterSignup', checked)}
                      />
                    </div>
                  </GroupCard>

                  <ArrayEditor
                    title="Footer links"
                    description="Add secondary links for policy pages, supporting pages, and footer navigation."
                    items={formState.footerLinks}
                    onChange={(items) => setField('footerLinks', items)}
                  />
                </>
              ) : null}

              {activeTab === 'seo' ? (
                <>
                  <GroupCard
                    title="Metadata defaults"
                    description="Provide strong default metadata for new pages so titles and descriptions stay consistent if a page has not been customized yet."
                  >
                    <FieldShell
                      label="Default meta title"
                      hint="Used as the fallback SEO title for pages without a custom title."
                    >
                      <input
                        value={formState.defaultMetaTitle}
                        onChange={(event) => setField('defaultMetaTitle', event.target.value)}
                        className={fieldInputClassName()}
                      />
                    </FieldShell>
                    <FieldShell
                      label="Default meta description"
                      hint="Fallback description for search and link previews."
                      className="mt-5"
                    >
                      <textarea
                        value={formState.defaultMetaDescription}
                        onChange={(event) => setField('defaultMetaDescription', event.target.value)}
                        className={cn(fieldInputClassName(), 'min-h-32 resize-y')}
                      />
                    </FieldShell>
                  </GroupCard>

                  <GroupCard
                    title="Social sharing"
                    description="Choose default images used when pages are shared across social networks and messaging platforms."
                  >
                    <div className="grid gap-5 md:grid-cols-2">
                      {renderMediaSelect(
                        'Open Graph image',
                        formState.ogImage,
                        (value) => setField('ogImage', value),
                        'Used by Facebook, LinkedIn, and many messaging previews.',
                      )}
                      {renderMediaSelect(
                        'Twitter image',
                        formState.twitterImage,
                        (value) => setField('twitterImage', value),
                        'Used when pages are shared on Twitter and similar networks.',
                      )}
                    </div>
                    <div className="mt-5">
                      <ToggleTile
                        label="Allow search engine indexing"
                        description="Turn this off if the site should stay hidden from search engines for now."
                        checked={formState.allowIndexing}
                        onChange={(checked) => setField('allowIndexing', checked)}
                      />
                    </div>
                  </GroupCard>
                </>
              ) : null}

              {activeTab === 'contact' ? (
                <>
                  <GroupCard
                    title="Business contact details"
                    description="These details can be reused across contact sections, footer areas, and other public-facing parts of the site."
                  >
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      <FieldShell
                        label="Public email"
                        hint="Email address visitors should use to contact your team."
                      >
                        <input
                          value={formState.publicEmail}
                          onChange={(event) => setField('publicEmail', event.target.value)}
                          className={fieldInputClassName()}
                          placeholder="hello@acme.com"
                        />
                      </FieldShell>
                      <FieldShell label="Phone" hint="Primary phone number for your business.">
                        <input
                          value={formState.phone}
                          onChange={(event) => setField('phone', event.target.value)}
                          className={fieldInputClassName()}
                          placeholder="+1 (555) 123-4567"
                        />
                      </FieldShell>
                      <FieldShell
                        label="WhatsApp"
                        hint="Optional WhatsApp number for direct messaging."
                      >
                        <input
                          value={formState.whatsapp}
                          onChange={(event) => setField('whatsapp', event.target.value)}
                          className={fieldInputClassName()}
                          placeholder="+1 (555) 123-4567"
                        />
                      </FieldShell>
                    </div>
                    <FieldShell
                      label="Address"
                      hint="Physical address or studio location shown to visitors."
                      className="mt-5"
                    >
                      <textarea
                        value={formState.address}
                        onChange={(event) => setField('address', event.target.value)}
                        className={cn(fieldInputClassName(), 'min-h-28 resize-y')}
                        placeholder="123 Main Street, Suite 400"
                      />
                    </FieldShell>
                  </GroupCard>

                  <ArrayEditor
                    title="Social profiles"
                    description="Add the social accounts you want to expose across footer, contact, or social-proof areas of the site."
                    items={formState.socialLinks}
                    onChange={(items) => setField('socialLinks', items)}
                    includePlatform
                  />
                </>
              ) : null}
            </SettingsSectionCard>
          </div>
        </div>
      </div>
    </div>
  )
}
