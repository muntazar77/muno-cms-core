import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import {
  ArrowRight,
  Briefcase,
  FileText,
  FolderKanban,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  Mail,
  Settings2,
} from 'lucide-react'
import config from '@payload-config'
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
    createHref: (siteId) => `/admin/collections/pages/create?siteId=${siteId}`,
    editHref: (docId) => `/admin/collections/pages/${docId}`,
    icon: FileText,
  },
  media: {
    label: 'Media',
    description: 'Manage brand assets, uploads, and reusable visuals for this site.',
    collection: 'media',
    createHref: (siteId) => `/admin/collections/media/create?siteId=${siteId}`,
    editHref: (docId) => `/admin/collections/media/${docId}`,
    icon: ImageIcon,
  },
  forms: {
    label: 'Forms',
    description: 'Maintain conversion and contact forms tied to this site.',
    collection: 'forms',
    createHref: (siteId) => `/admin/collections/forms/create?siteId=${siteId}`,
    editHref: (docId) => `/admin/collections/forms/${docId}`,
    icon: Mail,
  },
  services: {
    label: 'Services',
    description: 'Organize service catalog entries and site-specific offerings.',
    collection: 'services',
    createHref: (siteId) => `/admin/collections/services/create?siteId=${siteId}`,
    editHref: (docId) => `/admin/collections/services/${docId}`,
    icon: Briefcase,
  },
}

function isAdmin(user: UserWithSite | null): boolean {
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

function navHref(siteId: string, section?: string): string {
  return section ? `/admin/sites/${siteId}/${section}` : `/admin/sites/${siteId}`
}

function ContextTabs({ siteId, activeSection }: { siteId: string; activeSection?: string }) {
  const tabs = [
    { key: 'overview', label: 'Overview', href: navHref(siteId), icon: LayoutDashboard },
    { key: 'pages', label: 'Pages', href: navHref(siteId, 'pages'), icon: FileText },
    { key: 'media', label: 'Media', href: navHref(siteId, 'media'), icon: ImageIcon },
    { key: 'forms', label: 'Forms', href: navHref(siteId, 'forms'), icon: Mail },
    { key: 'services', label: 'Services', href: navHref(siteId, 'services'), icon: Briefcase },
    { key: 'settings', label: 'Settings', href: navHref(siteId, 'settings'), icon: Settings2 },
  ]

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {tabs.map(({ key, label, href, icon: Icon }) => {
        const active = (activeSection ?? 'overview') === key
        return (
          <Link
            key={key}
            href={href}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-medium transition',
              active
                ? 'border-amber-400/40 bg-amber-400/10 text-amber-100'
                : 'border-white/10 bg-white/4 text-slate-300 hover:bg-white/[0.07] hover:text-white',
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

async function getAuthedUser() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  return {
    payload,
    user: (user as UserWithSite | null) ?? null,
  }
}

async function findSite(
  payload: Awaited<ReturnType<typeof getPayload>>,
  user: UserWithSite,
  siteId: string,
) {
  const result = await payload.find({
    collection: 'sites',
    depth: 1,
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
  payload: Awaited<ReturnType<typeof getPayload>>,
  user: UserWithSite,
  collection: SectionConfig['collection'],
  siteId: string,
) {
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

async function renderSitesIndex(
  payload: Awaited<ReturnType<typeof getPayload>>,
  user: UserWithSite,
) {
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
      return [String(site.siteId ?? ''), count] as const
    }),
  )

  const pageCountMap = new Map(pageCounts)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.1),transparent_24%),linear-gradient(180deg,#020617_0%,#0f172a_46%,#111827_100%)] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-4xl border border-white/10 bg-white/4 p-8 shadow-[0_24px_120px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">
                <FolderKanban className="size-3.5" />
                Multi-Site Workspace
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">All Sites</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
                Navigate sites as products, not as generic settings documents. Each card opens a
                scoped workspace for pages, media, forms, services, and site settings.
              </p>
            </div>

            <Link href="/admin/collections/sites/create">
              <Button className="h-11 rounded-2xl bg-amber-400 px-5 text-sm font-semibold text-slate-950 hover:bg-amber-300">
                Create site
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sites.map((site) => {
            const siteKey = String(site.siteId ?? '')
            const siteHref = navHref(siteKey)
            const status = site.status ?? 'draft'

            return (
              <Link key={String(site.id)} href={siteHref} className="group cursor-pointer">
                <Card className="h-full rounded-[28px] border-white/10 bg-slate-950/70 shadow-[0_24px_90px_rgba(2,6,23,0.24)] transition duration-200 group-hover:-translate-y-1 group-hover:border-amber-400/35 group-hover:shadow-[0_32px_100px_rgba(245,158,11,0.12)]">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl text-white">
                          {site.siteName || siteKey}
                        </CardTitle>
                        <CardDescription className="mt-2 text-sm leading-6 text-slate-400">
                          {site.siteDescription ||
                            'Site-specific content, settings, and navigation workspace.'}
                        </CardDescription>
                      </div>
                      <Badge className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                        {status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-white/3 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Domain
                      </div>
                      <div className="mt-2 text-sm font-medium text-white">
                        {getSiteDomain(site)}
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[20px] border border-white/10 bg-white/3 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Total Pages
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-white">
                          {pageCountMap.get(siteKey) ?? 0}
                        </div>
                      </div>
                      <div className="rounded-[20px] border border-white/10 bg-white/3 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Updated
                        </div>
                        <div className="mt-2 text-sm font-medium text-white">
                          {formatDate(site.updatedAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-medium text-slate-200">
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

async function renderSiteOverview(
  payload: Awaited<ReturnType<typeof getPayload>>,
  user: UserWithSite,
  site: SiteDoc,
) {
  const siteId = String(site.siteId ?? '')

  const [pagesCount, mediaCount, formsCount, servicesCount, recentPages] = await Promise.all([
    countDocuments(payload, user, 'pages', siteId),
    countDocuments(payload, user, 'media', siteId),
    countDocuments(payload, user, 'forms', siteId),
    countDocuments(payload, user, 'services', siteId),
    payload.find({
      collection: 'pages',
      depth: 0,
      limit: 5,
      sort: '-updatedAt',
      user,
      overrideAccess: false,
      where: {
        and: [
          { siteId: { equals: siteId } },
          { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] },
        ],
      },
    }),
  ])

  const metrics = [
    { label: 'Pages', value: pagesCount, icon: FileText, href: navHref(siteId, 'pages') },
    { label: 'Media', value: mediaCount, icon: ImageIcon, href: navHref(siteId, 'media') },
    { label: 'Forms', value: formsCount, icon: Mail, href: navHref(siteId, 'forms') },
    { label: 'Services', value: servicesCount, icon: Briefcase, href: navHref(siteId, 'services') },
  ]

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.1),transparent_22%),linear-gradient(180deg,#020617_0%,#0f172a_46%,#111827_100%)] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-4xl border border-white/10 bg-white/4 p-8 shadow-[0_24px_120px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                <Globe className="size-3.5" />
                Site Workspace
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                {site.siteName || siteId}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
                {site.siteDescription || 'Site-specific content and navigation live here.'}
              </p>
              <ContextTabs siteId={siteId} />
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/4 px-3 py-1.5">
                {getSiteDomain(site)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/4 px-3 py-1.5">
                {site.defaultLanguage || 'en'}
              </span>
              <span className="rounded-full border border-white/10 bg-white/4 px-3 py-1.5">
                {site.timezone || 'UTC'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Link key={metric.label} href={metric.href}>
                <Card className="rounded-3xl border-white/10 bg-slate-950/70 transition hover:-translate-y-0.5 hover:border-amber-400/30">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {metric.label}
                      </div>
                      <div className="mt-2 text-3xl font-semibold text-white">{metric.value}</div>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/4 text-amber-200">
                      <Icon className="size-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <Card className="rounded-[28px] border-white/10 bg-slate-950/70">
            <CardHeader>
              <CardTitle className="text-lg text-white">Recent Pages</CardTitle>
              <CardDescription className="text-sm text-slate-400">
                Latest page updates in this site context.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(recentPages.docs as unknown as Array<Record<string, unknown>>).length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-white/10 px-5 py-8 text-sm text-slate-400">
                  No pages yet. Start with a home page for this site.
                </div>
              ) : (
                (recentPages.docs as unknown as Array<Record<string, unknown>>).map((page) => (
                  <Link
                    key={String(page.id)}
                    href={`/admin/collections/pages/${String(page.id)}`}
                    className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/3 px-5 py-4 transition hover:border-amber-400/30 hover:bg-white/5"
                  >
                    <div>
                      <div className="text-sm font-medium text-white">
                        {String(page.title ?? 'Untitled page')}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">/{String(page.slug ?? '')}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-200">
                        {String(page.status ?? 'draft')}
                      </Badge>
                      <ArrowRight className="size-4 text-slate-400" />
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-[28px] border-white/10 bg-slate-950/70">
              <CardHeader>
                <CardTitle className="text-lg text-white">Site Settings</CardTitle>
                <CardDescription className="text-sm text-slate-400">
                  Branding, SEO, and navigation for this site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={navHref(siteId, 'settings')}>
                  <Button className="h-11 w-full rounded-2xl bg-amber-400 text-sm font-semibold text-slate-950 hover:bg-amber-300">
                    Open Settings Workspace
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-white/10 bg-slate-950/70">
              <CardHeader>
                <CardTitle className="text-lg text-white">Navigation Summary</CardTitle>
                <CardDescription className="text-sm text-slate-400">
                  Quick snapshot of the site-specific navigation setup.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/3 px-4 py-3">
                  <span>Header links</span>
                  <span>{site.headerNav?.length ?? 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/3 px-4 py-3">
                  <span>Footer links</span>
                  <span>{site.footerLinks?.length ?? 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/3 px-4 py-3">
                  <span>Social links</span>
                  <span>{site.socialLinks?.length ?? 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

async function renderSection(
  payload: Awaited<ReturnType<typeof getPayload>>,
  user: UserWithSite,
  site: SiteDoc,
  sectionKey: string,
) {
  const configForSection = sectionConfigs[sectionKey]
  if (!configForSection) return null

  const siteId = String(site.siteId ?? '')
  const result = await payload.find({
    collection: configForSection.collection,
    depth: 1,
    limit: 24,
    sort: '-updatedAt',
    user,
    overrideAccess: false,
    where: {
      and: [
        { siteId: { equals: siteId } },
        { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] },
      ],
    },
  })

  const docs = result.docs as unknown as Array<Record<string, unknown>>
  const SectionIcon = configForSection.icon

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.1),transparent_22%),linear-gradient(180deg,#020617_0%,#0f172a_46%,#111827_100%)] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-4xl border border-white/10 bg-white/4 p-8 shadow-[0_24px_120px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">
                <SectionIcon className="size-3.5" />
                {configForSection.label}
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                {site.siteName || siteId}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
                {configForSection.description}
              </p>
              <ContextTabs siteId={siteId} activeSection={sectionKey} />
            </div>

            <div className="flex gap-3">
              <Link href={configForSection.createHref(siteId)}>
                <Button className="h-11 rounded-2xl bg-amber-400 px-5 text-sm font-semibold text-slate-950 hover:bg-amber-300">
                  New {configForSection.label.slice(0, -1)}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {docs.length === 0 ? (
            <Card className="col-span-full rounded-[28px] border-white/10 bg-slate-950/70">
              <CardContent className="px-6 py-12 text-center text-sm text-slate-400">
                No {configForSection.label.toLowerCase()} exist for this site yet.
              </CardContent>
            </Card>
          ) : (
            docs.map((doc) => (
              <Link key={String(doc.id)} href={configForSection.editHref(String(doc.id))}>
                <Card className="h-full rounded-[28px] border-white/10 bg-slate-950/70 transition hover:-translate-y-0.5 hover:border-amber-400/30">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg text-white">
                          {String(doc.title ?? doc.alt ?? doc.filename ?? 'Untitled')}
                        </CardTitle>
                        <CardDescription className="mt-2 text-sm leading-6 text-slate-400">
                          {String(
                            doc.slug ??
                              doc.mimeType ??
                              doc.confirmationMessage ??
                              configForSection.label,
                          )}
                        </CardDescription>
                      </div>
                      {'status' in doc ? (
                        <Badge className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-200">
                          {String(doc.status)}
                        </Badge>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">
                      Updated {formatDate(String(doc.updatedAt ?? doc.createdAt ?? ''))}
                    </span>
                    <ArrowRight className="size-4 text-slate-400" />
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
  payload: Awaited<ReturnType<typeof getPayload>>,
  user: UserWithSite,
  site: SiteDoc,
) {
  const siteId = String(site.siteId ?? '')
  const media = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 100,
    sort: '-updatedAt',
    user,
    overrideAccess: false,
    where: {
      and: [
        { siteId: { equals: siteId } },
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
        siteId,
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

export default async function SiteAdminView({ params }: { params: { segments?: string[] } }) {
  const { payload, user } = await getAuthedUser()
  if (!user) redirect('/admin/login')

  const segments = params?.segments ?? []
  const siteId = segments[1]
  const section = segments[2]

  if (segments.length <= 1) {
    if (!isAdmin(user)) {
      if (!user.siteId) {
        return (
          <div className="px-6 py-8 text-(--cms-text)">No site is assigned to this account.</div>
        )
      }

      redirect(navHref(user.siteId))
    }

    return renderSitesIndex(payload, user)
  }

  if (!siteId) redirect('/admin/sites')

  const site = await findSite(payload, user, siteId)
  if (!site) {
    return <div className="px-6 py-8 text-(--cms-text)">Site not found or access denied.</div>
  }

  if (section === 'settings') {
    return renderSettings(payload, user, site)
  }

  if (section && section in sectionConfigs) {
    return renderSection(payload, user, site, section)
  }

  return renderSiteOverview(payload, user, site)
}
