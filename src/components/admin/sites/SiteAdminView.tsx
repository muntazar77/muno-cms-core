import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { DocumentViewServerProps, ListViewServerProps } from 'payload'
import {
  ArrowRight,
  Briefcase,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  Mail,
  Settings2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getSiteDomain } from '@/lib/sites'
import SiteSettingsEditor from './SiteSettingsEditor'

interface UserWithSite {
  email?: string
  role?: string
  siteId?: string
}

interface SiteDoc {
  id: number | string
  siteId?: string | null
  siteName?: string | null
  siteDescription?: string | null
  domain?: string | null
  subdomain?: string | null
  status?: string | null
  updatedAt?: string | null
  createdAt?: string | null
  defaultLanguage?: string | null
  timezone?: string | null
  primaryColor?: string | null
  secondaryColor?: string | null
  fontFamily?: string | null
  logo?: number | { id?: number | string; filename?: string | null } | null
  favicon?: number | { id?: number | string; filename?: string | null } | null
  ogImage?: number | { id?: number | string; filename?: string | null } | null
  twitterImage?: number | { id?: number | string; filename?: string | null } | null
  headerNav?: Array<{ id?: string; label?: string | null; url?: string | null }> | null
  footerLinks?: Array<{ id?: string; label?: string | null; url?: string | null }> | null
  socialLinks?: Array<{
    id?: string
    platform?: string | null
    label?: string | null
    url?: string | null
  }> | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  showSiteTitle?: boolean | null
  showLanguageSwitcher?: boolean | null
  showThemeToggle?: boolean | null
  stickyHeader?: boolean | null
  footerTagline?: string | null
  footerNote?: string | null
  copyrightText?: string | null
  showNewsletterSignup?: boolean | null
  defaultMetaTitle?: string | null
  defaultMetaDescription?: string | null
  allowIndexing?: boolean | null
  publicEmail?: string | null
  phone?: string | null
  whatsapp?: string | null
  address?: string | null
}

interface SectionConfig {
  label: string
  description: string
  collection: 'pages' | 'media' | 'forms' | 'services'
  createHref: (siteId: string) => string
  editHref: (docId: string) => string
  icon: typeof FileText
}

const sectionConfigs: Record<string, SectionConfig> = {
  pages: {
    label: 'Pages',
    description: 'Create and edit site-specific pages and landing experiences.',
    collection: 'pages',
    createHref: (siteId) => `/admin/collections/pages/create?siteId=${encodeURIComponent(siteId)}`,
    editHref: (docId) => `/admin/collections/pages/${docId}`,
    icon: FileText,
  },
  media: {
    label: 'Media',
    description: 'Manage brand assets, uploads, and reusable visuals for this site.',
    collection: 'media',
    createHref: (siteId) => `/admin/collections/media/create?siteId=${encodeURIComponent(siteId)}`,
    editHref: (docId) => `/admin/collections/media/${docId}`,
    icon: ImageIcon,
  },
  forms: {
    label: 'Forms',
    description: 'Maintain conversion and contact forms tied to this site.',
    collection: 'forms',
    createHref: (siteId) => `/admin/collections/forms/create?siteId=${encodeURIComponent(siteId)}`,
    editHref: (docId) => `/admin/collections/forms/${docId}`,
    icon: Mail,
  },
  services: {
    label: 'Services',
    description: 'Organize service catalog entries and site-specific offerings.',
    collection: 'services',
    createHref: (siteId) =>
      `/admin/collections/services/create?siteId=${encodeURIComponent(siteId)}`,
    editHref: (docId) => `/admin/collections/services/${docId}`,
    icon: Briefcase,
  },
}

const siteStatusBadgeClasses: Record<string, string> = {
  active: 'border-(--cms-success-soft) bg-(--cms-success-soft) text-(--cms-success-text)',
  draft: 'border-(--cms-warning-soft) bg-(--cms-warning-soft) text-(--cms-warning-text)',
  maintenance: 'border-(--cms-danger-soft) bg-(--cms-danger-soft) text-(--cms-danger-text)',
}

const pageStatusBadgeClasses: Record<string, string> = {
  published: 'border-(--cms-success-soft) bg-(--cms-success-soft) text-(--cms-success-text)',
  draft: 'border-(--cms-warning-soft) bg-(--cms-warning-soft) text-(--cms-warning-text)',
}

function isAdmin(user: UserWithSite | null | undefined): boolean {
  return user?.role === 'admin'
}

function formatDate(value?: string | null): string {
  if (!value) return 'Recently updated'
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function toRelationshipId(value: SiteDoc['logo']): string {
  if (!value) return ''
  if (typeof value === 'object') return String(value.id ?? '')
  return String(value)
}

function navHref(siteDocID: string, section: keyof typeof sectionConfigs | 'settings'): string {
  return `/admin/collections/sites/${siteDocID}/${section}`
}

function resolveSection(
  routeSegments: string[] = [],
  docID: string,
): keyof typeof sectionConfigs | 'settings' | undefined {
  const last = routeSegments[routeSegments.length - 1]

  if (!last) return undefined
  if (last === docID) return undefined
  if (last === 'collections' || last === 'sites') return undefined

  if (last === 'settings') return 'settings'
  if (last in sectionConfigs) return last as keyof typeof sectionConfigs

  return undefined
}

function ContextTabs({ siteDocID, activeSection }: { siteDocID: string; activeSection?: string }) {
  const tabs = [
    { key: 'pages', label: 'Pages', href: navHref(siteDocID, 'pages'), icon: FileText },
    { key: 'media', label: 'Media', href: navHref(siteDocID, 'media'), icon: ImageIcon },
    { key: 'forms', label: 'Forms', href: navHref(siteDocID, 'forms'), icon: Mail },
    { key: 'services', label: 'Services', href: navHref(siteDocID, 'services'), icon: Briefcase },
    { key: 'settings', label: 'Settings', href: navHref(siteDocID, 'settings'), icon: Settings2 },
  ]

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {tabs.map(({ key, label, href, icon: Icon }) => {
        const active = (activeSection ?? 'pages') === key
        return (
          <Link
            key={key}
            href={href}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition',
              active
                ? 'border-(--cms-primary) bg-(--cms-primary-soft) text-(--cms-primary-text)'
                : 'border-(--cms-border) bg-(--cms-bg) text-(--cms-text-secondary) hover:bg-(--cms-bg-muted) hover:text-(--cms-text)',
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        )
      })}
    </div>
  )
}

async function findSiteBySiteKey(
  payload: ListViewServerProps['payload'],
  user: UserWithSite,
  siteId: string,
) {
  const result = await payload.find({
    collection: 'sites',
    depth: 0,
    limit: 1,
    user,
    overrideAccess: false,
    where: {
      siteId: { equals: siteId },
    },
  })

  return (result.docs[0] as SiteDoc | undefined) ?? null
}

async function countDocuments(
  payload: ListViewServerProps['payload'],
  user: UserWithSite,
  collection: SectionConfig['collection'],
  siteId: string,
) {
  if (!siteId) return 0

  const result = await payload.find({
    collection,
    depth: 0,
    limit: 0,
    user,
    overrideAccess: false,
    where: {
      and: [
        { siteId: { equals: siteId } },
        { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] },
      ],
    },
  })

  return result.totalDocs
}

async function renderSitesIndex(payload: ListViewServerProps['payload'], user: UserWithSite) {
  const sitesResult = await payload.find({
    collection: 'sites',
    depth: 0,
    limit: 100,
    sort: '-updatedAt',
    user,
    overrideAccess: false,
  })

  const sites = sitesResult.docs as SiteDoc[]
  const pageCounts = await Promise.all(
    sites.map(async (site) => {
      const count = await countDocuments(payload, user, 'pages', String(site.siteId ?? ''))
      return [String(site.id), count] as const
    }),
  )

  const pageCountMap = new Map(pageCounts)

  return (
    <div className="min-h-screen bg-(--cms-bg-elevated) px-4 py-6 text-(--cms-text) sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-full">
        <div className="rounded-2xl border border-(--cms-card-border) bg-(--cms-card-bg) p-6 shadow-(--cms-card-shadow) sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-(--cms-primary-soft) bg-(--cms-primary-soft) px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--cms-primary-text)">
                <FolderKanban className="size-3.5" />
                Multi-Site Workspace
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">All Sites</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-(--cms-text-secondary) md:text-base">
                Navigate sites as products, not as generic settings documents. Each card opens a
                scoped workspace for pages, media, forms, services, and site settings.
              </p>
            </div>

            <Link href="/admin/collections/sites/create">
              <Button className="h-11 rounded-xl bg-(--cms-primary) px-5 text-sm font-semibold text-white hover:bg-(--cms-primary-hover)">
                Create site
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-4 xl:grid-cols-4">
          {sites.map((site) => {
            const siteHref = navHref(String(site.id), 'pages')
            const status = site.status ?? 'draft'

            return (
              <Link key={String(site.id)} href={siteHref} className="group cursor-pointer">
                <Card className="h-full rounded-3xl border-(--cms-card-border) bg-(--cms-card-bg) shadow-(--cms-card-shadow) transition duration-200 group-hover:-translate-y-0.5 group-hover:border-(--cms-primary)">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl text-(--cms-text)">
                          {site.siteName || String(site.siteId ?? site.id)}
                        </CardTitle>
                        <CardDescription className="mt-2 text-sm leading-6 text-(--cms-text-secondary)">
                          {site.siteDescription ||
                            'Site-specific content, settings, and navigation workspace.'}
                        </CardDescription>
                      </div>
                      <Badge
                        className={cn(
                          'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]',
                          siteStatusBadgeClasses[status] ??
                            'border-(--cms-border) bg-(--cms-bg-muted) text-(--cms-text-secondary)',
                        )}
                      >
                        {status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-2xl border border-(--cms-border) bg-(--cms-bg-elevated) p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                        Domain
                      </div>
                      <div className="mt-2 text-sm font-medium text-(--cms-text)">
                        {getSiteDomain(site)}
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[18px] border border-(--cms-border) bg-(--cms-bg-elevated) p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                          Total Pages
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-(--cms-text)">
                          {pageCountMap.get(String(site.id)) ?? 0}
                        </div>
                      </div>
                      <div className="rounded-[18px] border border-(--cms-border) bg-(--cms-bg-elevated) p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                          Updated
                        </div>
                        <div className="mt-2 text-sm font-medium text-(--cms-text)">
                          {formatDate(site.updatedAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-medium text-(--cms-text-secondary) transition group-hover:text-(--cms-primary)">
                      <span>Open site workspace</span>
                      <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

async function renderSection(
  payload: DocumentViewServerProps['payload'],
  user: UserWithSite,
  site: SiteDoc,
  sectionKey: string,
) {
  const configForSection = sectionConfigs[sectionKey]
  if (!configForSection) return null

  const siteKey = String(site.siteId ?? '')
  const siteDocID = String(site.id)
  const result = await payload.find({
    collection: configForSection.collection,
    depth: 1,
    limit: 24,
    sort: '-updatedAt',
    user,
    overrideAccess: false,
    where: {
      and: [
        { siteId: { equals: siteKey } },
        { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] },
      ],
    },
  })

  const docs = result.docs as unknown as Array<Record<string, unknown>>
  const SectionIcon = configForSection.icon
  const isPagesSection = sectionKey === 'pages'

  return (
    <div className="min-h-screen bg-(--cms-bg-elevated) px-4 py-6 text-(--cms-text) sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-full">
      <div className="rounded-2xl border border-(--cms-card-border) bg-(--cms-card-bg) p-6 shadow-(--cms-card-shadow) sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-(--cms-primary-soft) bg-(--cms-primary-soft) px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--cms-primary-text)">
                <SectionIcon className="size-3.5" />
                {configForSection.label}
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                {site.siteName || site.siteId || siteDocID}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-(--cms-text-secondary) md:text-base">
                {configForSection.description}
              </p>
              <ContextTabs siteDocID={siteDocID} activeSection={sectionKey} />
            </div>

            <div className="flex gap-3">
              <Link href={configForSection.createHref(siteKey)}>
                <Button className="h-11 rounded-xl bg-(--cms-primary) px-5 text-sm font-semibold text-white hover:bg-(--cms-primary-hover)">
                  New {configForSection.label.slice(0, -1)}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className={cn('mt-8 grid gap-4', isPagesSection ? 'grid-cols-1' : 'lg:grid-cols-2')}>
          {docs.length === 0 ? (
            <Card className="col-span-full rounded-3xl border-(--cms-card-border) bg-(--cms-card-bg)">
              <CardContent className="px-6 py-12 text-center text-sm text-(--cms-text-secondary)">
                No {configForSection.label.toLowerCase()} exist for this site yet.
              </CardContent>
            </Card>
          ) : (
            docs.map((doc) => (
              <Link key={String(doc.id)} href={configForSection.editHref(String(doc.id))}>
                <Card className="h-full rounded-[20px] border-(--cms-card-border) bg-(--cms-card-bg) transition hover:-translate-y-0.5 hover:border-(--cms-primary)">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="truncate text-base text-(--cms-text)">
                          {String(doc.title ?? doc.alt ?? doc.filename ?? 'Untitled')}
                        </CardTitle>
                        <CardDescription className="mt-1 truncate text-sm text-(--cms-text-secondary)">
                          {isPagesSection
                            ? `/${String(doc.slug ?? '')}`
                            : String(
                                doc.slug ??
                                  doc.mimeType ??
                                  doc.confirmationMessage ??
                                  configForSection.label,
                              )}
                        </CardDescription>
                      </div>

                      <div className="flex items-center gap-3">
                        {'status' in doc ? (
                          <Badge
                            className={cn(
                              'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]',
                              pageStatusBadgeClasses[String(doc.status)] ??
                                'border-(--cms-border) bg-(--cms-bg-muted) text-(--cms-text-secondary)',
                            )}
                          >
                            {String(doc.status)}
                          </Badge>
                        ) : null}

                        <span className="hidden text-xs text-(--cms-text-muted) md:inline">
                          Updated {formatDate(String(doc.updatedAt ?? doc.createdAt ?? ''))}
                        </span>

                        <ArrowRight className="size-4 text-(--cms-text-muted)" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

async function renderSettings(
  payload: DocumentViewServerProps['payload'],
  user: UserWithSite,
  site: SiteDoc,
) {
  const siteKey = String(site.siteId ?? '')
  const media = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 100,
    sort: '-updatedAt',
    user,
    overrideAccess: false,
    where: {
      and: [
        { siteId: { equals: siteKey } },
        { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] },
      ],
    },
  })

  const mediaOptions = (media.docs as unknown as Array<Record<string, unknown>>).map((item) => ({
    id: String(item.id),
    label: String(item.alt ?? item.filename ?? `Media #${String(item.id)}`),
  }))

  return (
    <SiteSettingsEditor
      mediaOptions={mediaOptions}
      site={{
        id: String(site.id),
        siteId: siteKey,
        siteName: site.siteName ?? '',
        siteDescription: site.siteDescription ?? '',
        domain: site.domain ?? '',
        subdomain: site.subdomain ?? '',
        status: site.status ?? 'active',
        defaultLanguage: site.defaultLanguage ?? 'en',
        timezone: site.timezone ?? 'UTC',
        logo: toRelationshipId(site.logo),
        favicon: toRelationshipId(site.favicon),
        primaryColor: site.primaryColor ?? '#2563eb',
        secondaryColor: site.secondaryColor ?? '#0f172a',
        fontFamily: site.fontFamily ?? 'inter',
        headerNav: (site.headerNav ?? []).map((item) => ({
          id: item.id,
          label: item.label ?? '',
          url: item.url ?? '',
        })),
        ctaLabel: site.ctaLabel ?? '',
        ctaUrl: site.ctaUrl ?? '',
        showSiteTitle: site.showSiteTitle ?? true,
        showLanguageSwitcher: site.showLanguageSwitcher ?? false,
        showThemeToggle: site.showThemeToggle ?? false,
        stickyHeader: site.stickyHeader ?? true,
        footerLinks: (site.footerLinks ?? []).map((item) => ({
          id: item.id,
          label: item.label ?? '',
          url: item.url ?? '',
        })),
        socialLinks: (site.socialLinks ?? []).map((item) => ({
          id: item.id,
          platform: item.platform ?? '',
          label: item.label ?? '',
          url: item.url ?? '',
        })),
        showNewsletterSignup: site.showNewsletterSignup ?? false,
        footerTagline: site.footerTagline ?? '',
        footerNote: site.footerNote ?? '',
        copyrightText: site.copyrightText ?? '',
        defaultMetaTitle: site.defaultMetaTitle ?? '',
        defaultMetaDescription: site.defaultMetaDescription ?? '',
        ogImage: toRelationshipId(site.ogImage),
        twitterImage: toRelationshipId(site.twitterImage),
        allowIndexing: site.allowIndexing ?? true,
        publicEmail: site.publicEmail ?? '',
        phone: site.phone ?? '',
        whatsapp: site.whatsapp ?? '',
        address: site.address ?? '',
      }}
    />
  )
}

export async function SitesListView(props: ListViewServerProps) {
  const user = (props.user as UserWithSite | null | undefined) ?? null
  if (!user) redirect('/admin/login')

  if (!isAdmin(user)) {
    if (!user.siteId) {
      return <div className="px-6 py-8 text-(--cms-text)">No site is assigned to this account.</div>
    }

    const assignedSite = await findSiteBySiteKey(props.payload, user, user.siteId)
    if (!assignedSite) {
      return <div className="px-6 py-8 text-(--cms-text)">Site not found or access denied.</div>
    }

    redirect(navHref(String(assignedSite.id), 'pages'))
  }

  return renderSitesIndex(props.payload, user)
}

export async function SiteWorkspaceView(props: DocumentViewServerProps) {
  const user = (props.user as UserWithSite | null | undefined) ?? null
  if (!user) redirect('/admin/login')

  const site = (props.doc as SiteDoc | undefined) ?? null
  if (!site) {
    return <div className="px-6 py-8 text-(--cms-text)">Site not found or access denied.</div>
  }

  const section = resolveSection(props.routeSegments, String(site.id))

  if (section === 'settings') {
    return renderSettings(props.payload, user, site)
  }

  if (section && section in sectionConfigs) {
    return renderSection(props.payload, user, site, section)
  }

  redirect(navHref(String(site.id), 'pages'))
}

export default SitesListView
