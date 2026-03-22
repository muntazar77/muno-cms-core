'use client'

import { startTransition, useState } from 'react'
import {
  Check,
  ChevronRight,
  Globe,
  Palette,
  Search,
  Settings2,
  ShieldCheck,
  Mail,
  Plus,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
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
  mediaOptions: MediaOption[]
  site: SiteSettingsShape
}

type TabKey = 'general' | 'branding' | 'navigation' | 'seo' | 'contact'

const tabs: Array<{
  key: TabKey
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  { key: 'general', label: 'General', icon: Globe },
  { key: 'branding', label: 'Branding', icon: Palette },
  { key: 'navigation', label: 'Navigation', icon: Settings2 },
  { key: 'seo', label: 'SEO', icon: Search },
  { key: 'contact', label: 'Contact', icon: Mail },
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
  return 'mt-2 w-full rounded-xl border border-[var(--cms-input-border)] bg-[var(--cms-input-bg)] px-4 py-3 text-sm text-[var(--cms-text)] outline-none transition focus:border-[var(--cms-primary)] focus:ring-4 focus:ring-[var(--cms-input-focus-ring)]'
}

function fieldLabelClassName() {
  return 'text-xs font-semibold uppercase tracking-[0.16em] text-[var(--cms-text-muted)]'
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[24px] border border-[var(--cms-card-border)] bg-[var(--cms-card-bg)] p-6 shadow-[var(--cms-card-shadow)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--cms-text)]">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--cms-text-secondary)]">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
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
    <div className="rounded-[20px] border border-[var(--cms-border)] bg-[var(--cms-bg-elevated)] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--cms-text)]">{title}</h3>
          <p className="mt-1 text-sm text-[var(--cms-text-secondary)]">{description}</p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--cms-border)] bg-[var(--cms-bg)] px-4 text-sm font-medium text-[var(--cms-text)] transition hover:border-[var(--cms-primary)] hover:bg-[var(--cms-primary-soft)] hover:text-[var(--cms-primary-text)]"
        >
          <Plus className="size-4" />
          Add link
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--cms-border)] px-4 py-6 text-sm text-[var(--cms-text-secondary)]">
            No items configured yet.
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id ?? `${title}-${index}`}
              className="grid gap-3 rounded-2xl border border-[var(--cms-border)] bg-[var(--cms-bg)] p-4 md:grid-cols-[1fr_1.2fr_auto]"
            >
              {includePlatform && (
                <input
                  value={item.platform ?? ''}
                  onChange={(event) => updateItem(index, 'platform', event.target.value)}
                  placeholder="Platform"
                  className={fieldInputClassName()}
                />
              )}
              <input
                value={item.label}
                onChange={(event) => updateItem(index, 'label', event.target.value)}
                placeholder="Label"
                className={fieldInputClassName()}
              />
              <input
                value={item.url}
                onChange={(event) => updateItem(index, 'url', event.target.value)}
                placeholder="URL"
                className={fieldInputClassName()}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--cms-danger-soft)] bg-[var(--cms-danger-soft)] px-3 text-[var(--cms-danger-text)] transition hover:opacity-90"
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

export default function SiteSettingsEditor({ mediaOptions, site }: SiteSettingsEditorProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('general')
  const [formState, setFormState] = useState<SiteSettingsShape>(site)
  const [isSaving, setIsSaving] = useState(false)

  function setField<K extends keyof SiteSettingsShape>(key: K, value: SiteSettingsShape[K]) {
    setFormState((current) => ({ ...current, [key]: value }))
  }

  function renderMediaSelect(label: string, value: string, onChange: (value: string) => void) {
    return (
      <label>
        <span className={fieldLabelClassName()}>{label}</span>
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
      </label>
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

  return (
    <div className="min-h-screen bg-[var(--cms-bg-elevated)] px-4 py-12 text-[var(--cms-text)] sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full">
        <div className="rounded-[28px] border border-[var(--cms-card-border)] bg-[var(--cms-card-bg)] p-8 shadow-[var(--cms-card-shadow)] sm:p-10 md:p-12 lg:p-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--cms-primary-soft)] bg-[var(--cms-primary-soft)] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--cms-primary-text)]">
                <ShieldCheck className="size-4" />
                Site Context
              </div>
              <h1 className="mt-7 text-4xl font-bold tracking-tight text-[var(--cms-text)] sm:text-5xl md:text-5xl">
                {formState.siteName}
              </h1>
              <p className="mt-5 max-w-4xl text-base leading-8 text-[var(--cms-text-secondary)] sm:text-lg sm:leading-9">
                Premium site settings for {formState.siteId}. Update branding, navigation, metadata,
                and contact details without leaving the Payload admin shell.
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-5 sm:gap-6 md:items-end">
              <div className="flex flex-wrap gap-3 text-sm text-[var(--cms-text-secondary)]">
                <span className="rounded-full border border-[var(--cms-border)] bg-[var(--cms-bg-elevated)] px-4 py-2.5 font-medium">
                  {formState.domain || `${formState.subdomain || 'draft'}.localhost`}
                </span>
                <span className="rounded-full border border-[var(--cms-border)] bg-[var(--cms-bg-elevated)] px-4 py-2.5 font-medium">
                  {formState.timezone || 'UTC'}
                </span>
                <span className="rounded-full border border-[var(--cms-warning-soft)] bg-[var(--cms-warning-soft)] px-4 py-2.5 font-medium text-[var(--cms-warning-text)]">
                  {formState.status}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[var(--cms-primary)] px-7 text-base font-semibold text-white transition hover:bg-[var(--cms-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-14 md:min-h-15"
              >
                {isSaving ? (
                  <ChevronRight className="size-5 animate-pulse" />
                ) : (
                  <Check className="size-5" />
                )}
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2 rounded-[20px] border border-[var(--cms-border)] bg-[var(--cms-bg-elevated)] p-2">
            {tabs.map(({ key, label, icon: Icon }) => {
              const isActive = key === activeTab
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    'inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 text-sm font-medium transition',
                    isActive
                      ? 'bg-[var(--cms-primary-soft)] text-[var(--cms-primary-text)]'
                      : 'text-[var(--cms-text-secondary)] hover:bg-[var(--cms-bg)] hover:text-[var(--cms-text)]',
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {activeTab === 'general' && (
            <SectionCard
              title="General Settings"
              description="Define the core site identity, routing domain, locale, and operational status for this site."
            >
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <label>
                  <span className={fieldLabelClassName()}>Site Name</span>
                  <input
                    value={formState.siteName}
                    onChange={(event) => setField('siteName', event.target.value)}
                    className={fieldInputClassName()}
                  />
                </label>
                <label>
                  <span className={fieldLabelClassName()}>Site Key</span>
                  <input
                    value={formState.siteId}
                    onChange={(event) => setField('siteId', event.target.value)}
                    className={fieldInputClassName()}
                  />
                </label>
                <label>
                  <span className={fieldLabelClassName()}>Domain</span>
                  <input
                    value={formState.domain}
                    onChange={(event) => setField('domain', event.target.value)}
                    className={fieldInputClassName()}
                    placeholder="acme.com"
                  />
                </label>
                <label>
                  <span className={fieldLabelClassName()}>Subdomain</span>
                  <input
                    value={formState.subdomain}
                    onChange={(event) => setField('subdomain', event.target.value)}
                    className={fieldInputClassName()}
                    placeholder="acme"
                  />
                </label>
                <label>
                  <span className={fieldLabelClassName()}>Status</span>
                  <select
                    value={formState.status}
                    onChange={(event) => setField('status', event.target.value)}
                    className={fieldInputClassName()}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </label>
                <label>
                  <span className={fieldLabelClassName()}>Default Language</span>
                  <input
                    value={formState.defaultLanguage}
                    onChange={(event) => setField('defaultLanguage', event.target.value)}
                    className={fieldInputClassName()}
                  />
                </label>
                <label>
                  <span className={fieldLabelClassName()}>Timezone</span>
                  <input
                    value={formState.timezone}
                    onChange={(event) => setField('timezone', event.target.value)}
                    className={fieldInputClassName()}
                  />
                </label>
              </div>
              <label className="mt-5 block">
                <span className={fieldLabelClassName()}>Site Description</span>
                <textarea
                  value={formState.siteDescription}
                  onChange={(event) => setField('siteDescription', event.target.value)}
                  className={cn(fieldInputClassName(), 'min-h-28 resize-y')}
                />
              </label>
            </SectionCard>
          )}

          {activeTab === 'branding' && (
            <SectionCard
              title="Branding System"
              description="Pick the visual identity that will flow through the public frontend and create a clearer brand signature across every site."
            >
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {renderMediaSelect('Logo', formState.logo, (value) => setField('logo', value))}
                {renderMediaSelect('Favicon', formState.favicon, (value) =>
                  setField('favicon', value),
                )}
                <label>
                  <span className={fieldLabelClassName()}>Primary Color</span>
                  <input
                    value={formState.primaryColor}
                    onChange={(event) => setField('primaryColor', event.target.value)}
                    className={fieldInputClassName()}
                  />
                </label>
                <label>
                  <span className={fieldLabelClassName()}>Secondary Color</span>
                  <input
                    value={formState.secondaryColor}
                    onChange={(event) => setField('secondaryColor', event.target.value)}
                    className={fieldInputClassName()}
                  />
                </label>
                <label className="md:col-span-2 xl:col-span-4">
                  <span className={fieldLabelClassName()}>Font Family</span>
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
                </label>
              </div>
            </SectionCard>
          )}

          {activeTab === 'navigation' && (
            <div className="space-y-6">
              <SectionCard
                title="Header Navigation"
                description="Compose a site-specific header with a CTA and feature toggles for builder-level polish."
              >
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <label>
                    <span className={fieldLabelClassName()}>CTA Label</span>
                    <input
                      value={formState.ctaLabel}
                      onChange={(event) => setField('ctaLabel', event.target.value)}
                      className={fieldInputClassName()}
                    />
                  </label>
                  <label className="md:col-span-2 xl:col-span-3">
                    <span className={fieldLabelClassName()}>CTA URL</span>
                    <input
                      value={formState.ctaUrl}
                      onChange={(event) => setField('ctaUrl', event.target.value)}
                      className={fieldInputClassName()}
                    />
                  </label>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    ['showSiteTitle', 'Show site title'],
                    ['showLanguageSwitcher', 'Show language switcher'],
                    ['showThemeToggle', 'Show theme toggle'],
                    ['stickyHeader', 'Sticky header'],
                  ].map(([key, label]) => (
                    <label
                      key={key}
                      className="flex min-h-14 items-center justify-between rounded-2xl border border-[var(--cms-border)] bg-[var(--cms-bg)] px-4 py-3 text-sm text-[var(--cms-text)]"
                    >
                      <span>{label}</span>
                      <input
                        type="checkbox"
                        checked={Boolean(formState[key as keyof SiteSettingsShape])}
                        onChange={(event) =>
                          setField(key as keyof SiteSettingsShape, event.target.checked as never)
                        }
                        className="size-4 accent-[var(--cms-primary)]"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-6">
                  <ArrayEditor
                    title="Navigation Links"
                    description="Primary navigation links for the site header."
                    items={formState.headerNav}
                    onChange={(items) => setField('headerNav', items)}
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Footer Navigation"
                description="Shape the footer experience with deeper links, social presence, and newsletter controls."
              >
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <label className="xl:col-span-2">
                    <span className={fieldLabelClassName()}>Footer Tagline</span>
                    <input
                      value={formState.footerTagline}
                      onChange={(event) => setField('footerTagline', event.target.value)}
                      className={fieldInputClassName()}
                    />
                  </label>
                  <label className="xl:col-span-2">
                    <span className={fieldLabelClassName()}>Copyright Text</span>
                    <input
                      value={formState.copyrightText}
                      onChange={(event) => setField('copyrightText', event.target.value)}
                      className={fieldInputClassName()}
                    />
                  </label>
                </div>
                <label className="mt-5 block">
                  <span className={fieldLabelClassName()}>Footer Note</span>
                  <textarea
                    value={formState.footerNote}
                    onChange={(event) => setField('footerNote', event.target.value)}
                    className={cn(fieldInputClassName(), 'min-h-24 resize-y')}
                  />
                </label>
                <label className="mt-5 flex min-h-14 items-center justify-between rounded-2xl border border-[var(--cms-border)] bg-[var(--cms-bg)] px-4 py-3 text-sm text-[var(--cms-text)]">
                  <span>Show newsletter signup</span>
                  <input
                    type="checkbox"
                    checked={formState.showNewsletterSignup}
                    onChange={(event) => setField('showNewsletterSignup', event.target.checked)}
                    className="size-4 accent-[var(--cms-primary)]"
                  />
                </label>

                <div className="mt-6 space-y-6">
                  <ArrayEditor
                    title="Footer Links"
                    description="Supplementary navigation links for the footer."
                    items={formState.footerLinks}
                    onChange={(items) => setField('footerLinks', items)}
                  />
                  <ArrayEditor
                    title="Social Links"
                    description="Platform-specific social links shown in the footer or contact sections."
                    items={formState.socialLinks}
                    onChange={(items) => setField('socialLinks', items)}
                    includePlatform
                  />
                </div>
              </SectionCard>
            </div>
          )}

          {activeTab === 'seo' && (
            <SectionCard
              title="SEO Defaults"
              description="Set strong baseline metadata for pages that do not override their own titles or social images."
            >
              <label className="block">
                <span className={fieldLabelClassName()}>Default Meta Title</span>
                <input
                  value={formState.defaultMetaTitle}
                  onChange={(event) => setField('defaultMetaTitle', event.target.value)}
                  className={fieldInputClassName()}
                />
              </label>
              <label className="mt-5 block">
                <span className={fieldLabelClassName()}>Default Meta Description</span>
                <textarea
                  value={formState.defaultMetaDescription}
                  onChange={(event) => setField('defaultMetaDescription', event.target.value)}
                  className={cn(fieldInputClassName(), 'min-h-28 resize-y')}
                />
              </label>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {renderMediaSelect('Open Graph Image', formState.ogImage, (value) =>
                  setField('ogImage', value),
                )}
                {renderMediaSelect('Twitter Image', formState.twitterImage, (value) =>
                  setField('twitterImage', value),
                )}
              </div>
              <label className="mt-5 flex min-h-14 items-center justify-between rounded-2xl border border-[var(--cms-border)] bg-[var(--cms-bg)] px-4 py-3 text-sm text-[var(--cms-text)]">
                <span>Allow search engine indexing</span>
                <input
                  type="checkbox"
                  checked={formState.allowIndexing}
                  onChange={(event) => setField('allowIndexing', event.target.checked)}
                  className="size-4 accent-[var(--cms-primary)]"
                />
              </label>
            </SectionCard>
          )}

          {activeTab === 'contact' && (
            <SectionCard
              title="Contact Information"
              description="Publish site-specific contact details instead of sharing one generic system-wide profile."
            >
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <label>
                  <span className={fieldLabelClassName()}>Public Email</span>
                  <input
                    value={formState.publicEmail}
                    onChange={(event) => setField('publicEmail', event.target.value)}
                    className={fieldInputClassName()}
                  />
                </label>
                <label>
                  <span className={fieldLabelClassName()}>Phone</span>
                  <input
                    value={formState.phone}
                    onChange={(event) => setField('phone', event.target.value)}
                    className={fieldInputClassName()}
                  />
                </label>
                <label>
                  <span className={fieldLabelClassName()}>WhatsApp</span>
                  <input
                    value={formState.whatsapp}
                    onChange={(event) => setField('whatsapp', event.target.value)}
                    className={fieldInputClassName()}
                  />
                </label>
              </div>
              <label className="mt-5 block">
                <span className={fieldLabelClassName()}>Address</span>
                <textarea
                  value={formState.address}
                  onChange={(event) => setField('address', event.target.value)}
                  className={cn(fieldInputClassName(), 'min-h-28 resize-y')}
                />
              </label>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  )
}
