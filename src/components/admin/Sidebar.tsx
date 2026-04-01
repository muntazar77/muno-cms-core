'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Image as ImageIcon,
  Users,
  Inbox,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  Briefcase,
  Settings,
  Trash2,
  Globe,
  Mail,
  ExternalLink,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth, useConfig } from '@payloadcms/ui'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

function isClientSiteWorkspacePath(pathname: string): boolean {
  return /^\/admin\/collections\/sites\/[^/?#]+(?:\/(dashboard|pages|media|forms|submissions|services|settings))?$/.test(
    pathname,
  )
}

function isClientWorkspacePath(pathname: string): boolean {
  if (pathname === '/admin/account' || pathname === '/admin/trash') return true
  return isClientSiteWorkspacePath(pathname)
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
  onNavigate,
}: {
  href: string
  icon: LucideIcon
  label: string
  active: boolean
  collapsed: boolean
  onNavigate?: () => void
}) {
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium no-underline transition-all duration-150',
        active
          ? 'bg-(--cms-primary) text-white shadow-sm shadow-black/10'
          : 'text-(--cms-text-secondary) hover:bg-(--cms-bg-muted) hover:text-(--cms-text)',
        collapsed && 'justify-center px-2',
      )}
    >
      <Icon className={cn('shrink-0', collapsed ? 'size-4.5' : 'size-4')} />
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }
  return link
}

function SidebarInner({
  collapsed,
  onToggle,
  onNavigate,
  mobileMode = false,
}: {
  collapsed: boolean
  onToggle: () => void
  onNavigate?: () => void
  mobileMode?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logOut } = useAuth()
  async function handleLogOut() {
    await logOut()
    router.replace('/admin/login')
    router.refresh()
  }

  const { config } = useConfig()
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'AD'
  const userRole = user && 'role' in user ? String(user.role ?? '') : ''
  const userSiteId =
    user && 'siteId' in user ? String((user as { siteId?: string }).siteId ?? '') : ''
  const isSuperAdmin = userRole === 'super-admin'

  // ── Resolve client's site doc ID and siteId slug ───────────────────
  const [clientSiteDocId, setClientSiteDocId] = useState<string>('')
  const [clientSiteSlug, setClientSiteSlug] = useState<string>('')
  const siteDataInitRef = useRef(false)

  // Read cached site data synchronously before paint to prevent nav flicker
  useLayoutEffect(() => {
    if (siteDataInitRef.current || isSuperAdmin || !userSiteId) return
    siteDataInitRef.current = true
    try {
      const cachedDocId = sessionStorage.getItem('muno-client-site-doc-id') || ''
      const cachedSlug = sessionStorage.getItem('muno-client-site-slug') || ''
      if (cachedDocId) setClientSiteDocId(cachedDocId)
      if (cachedSlug) setClientSiteSlug(cachedSlug)
    } catch {
      /* SSR guard */
    }
  }, [isSuperAdmin, userSiteId])

  // Validate with API and update cache
  useEffect(() => {
    if (isSuperAdmin || !userSiteId) return
    const apiRoute = (config?.routes?.api as string | undefined) ?? '/api'
    fetch(
      `${apiRoute}/sites?where[siteId][equals]=${encodeURIComponent(userSiteId)}&limit=1&depth=0`,
      {
        credentials: 'include',
      },
    )
      .then((res) => res.json())
      .then((data) => {
        const doc = data?.docs?.[0]
        if (doc?.id) {
          const docId = String(doc.id)
          setClientSiteDocId(docId)
          try {
            sessionStorage.setItem('muno-client-site-doc-id', docId)
          } catch {}
        }
        if (doc?.siteId) {
          const slug = String(doc.siteId)
          setClientSiteSlug(slug)
          try {
            sessionStorage.setItem('muno-client-site-slug', slug)
          } catch {}
        }
      })
      .catch(() => {})
  }, [isSuperAdmin, userSiteId, config?.routes?.api])

  // ── Super-admin: detect active site from URL and resolve its siteId ─
  const siteRouteMatch = pathname?.match(/^\/admin\/collections\/sites\/([^/?#]+)/)
  const matchedSiteSegment = siteRouteMatch?.[1] ?? ''
  const activeSiteDocID = ['create', 'versions', 'version', 'api', 'preview'].includes(
    matchedSiteSegment,
  )
    ? ''
    : matchedSiteSegment

  const [activeSiteSlug, setActiveSiteSlug] = useState<string>('')

  useEffect(() => {
    if (!isSuperAdmin || !activeSiteDocID) {
      setActiveSiteSlug('')
      return
    }
    const apiRoute = (config?.routes?.api as string | undefined) ?? '/api'
    fetch(`${apiRoute}/sites/${activeSiteDocID}?depth=0`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.siteId) setActiveSiteSlug(String(data.siteId))
      })
      .catch(() => setActiveSiteSlug(''))
  }, [isSuperAdmin, activeSiteDocID, config?.routes?.api])

  // ── Build site context links (for both roles) ─────────────────────
  const siteDocId = isSuperAdmin ? activeSiteDocID : clientSiteDocId
  const previewSiteSlug = isSuperAdmin ? activeSiteSlug : clientSiteSlug
  const siteContextLinks = siteDocId
    ? [
        {
          href: `/admin/collections/sites/${siteDocId}/pages`,
          label: 'Pages',
          icon: FileText,
        },
        {
          href: `/admin/collections/sites/${siteDocId}/media`,
          label: 'Media',
          icon: ImageIcon,
        },
        {
          href: `/admin/collections/sites/${siteDocId}/forms`,
          label: 'Forms',
          icon: Mail,
        },
        {
          href: `/admin/collections/sites/${siteDocId}/submissions`,
          label: 'Submissions',
          icon: Inbox,
        },
        {
          href: `/admin/collections/sites/${siteDocId}/services`,
          label: 'Services',
          icon: Briefcase,
        },
      ]
    : []

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r border-(--cms-sidebar-border) bg-(--cms-sidebar-bg)',
        !mobileMode && 'md:sticky md:top-0 md:h-dvh',
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex h-13 shrink-0 items-center border-b border-(--cms-border-subtle)',
          collapsed ? 'justify-center gap-0 px-2' : 'gap-2.5 px-3',
        )}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
          <LayoutDashboard className="size-3.75" />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="min-w-0 flex-1 overflow-hidden"
            >
              <p className="truncate text-[13px] font-semibold leading-tight text-(--cms-text)">
                Muno CMS
              </p>
              <p className="text-[10.5px] leading-tight text-(--cms-text-muted)">
                Content Management
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {!mobileMode && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggle}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-(--cms-text-muted) transition-colors hover:bg-(--cms-bg-muted) hover:text-(--cms-text)"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {collapsed ? (
                  <PanelLeftOpen className="size-3.75" />
                ) : (
                  <PanelLeftClose className="size-3.75" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-(--cms-text-muted)">
            Menu
          </p>
        )}

        {/* ── Super-admin navigation ──────────────────────────────── */}
        {isSuperAdmin && (
          <>
            <NavLink
              href="/admin"
              icon={LayoutDashboard}
              label="Dashboard"
              active={pathname === '/admin'}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
            <NavLink
              href="/admin/collections/sites"
              icon={Globe}
              label="All Sites"
              active={Boolean(pathname?.startsWith('/admin/collections/sites'))}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />

            {siteContextLinks.length > 0 && !collapsed && (
              <p className="mb-2 mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-(--cms-text-muted)">
                Site Context
              </p>
            )}
            {siteContextLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                active={pathname === link.href || Boolean(pathname?.startsWith(link.href + '/'))}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
            {previewSiteSlug && (
              <NavLink
                href={`/preview/${previewSiteSlug}`}
                icon={ExternalLink}
                label="Preview Site"
                active={false}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            )}

            {!collapsed && (
              <p className="mb-2 mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-(--cms-text-muted)">
                Admin
              </p>
            )}
            <NavLink
              href="/admin/collections/users"
              icon={Users}
              label="Users"
              active={Boolean(pathname?.startsWith('/admin/collections/users'))}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
            <NavLink
              href="/admin/collections/form-submissions"
              icon={Inbox}
              label="Submissions"
              active={Boolean(pathname?.startsWith('/admin/collections/form-submissions'))}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />

            {!collapsed && (
              <p className="mb-2 mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-(--cms-text-muted)">
                Platform
              </p>
            )}
            <NavLink
              href="/admin/collections/marketing-pages"
              icon={FileText}
              label="Marketing Pages"
              active={Boolean(pathname?.startsWith('/admin/collections/marketing-pages'))}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
            <NavLink
              href="/admin/globals/platform-settings"
              icon={Settings}
              label="Platform Settings"
              active={Boolean(pathname?.startsWith('/admin/globals/platform-settings'))}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
            <NavLink
              href="/admin/trash"
              icon={Trash2}
              label="Trash"
              active={pathname === '/admin/trash'}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          </>
        )}

        {/* ── Client navigation ───────────────────────────────────── */}
        {!isSuperAdmin && (
          <>
            {siteDocId ? (
              <>
                <NavLink
                  href={`/admin/collections/sites/${siteDocId}/dashboard`}
                  icon={LayoutDashboard}
                  label="Dashboard"
                  active={
                    pathname === `/admin/collections/sites/${siteDocId}` ||
                    pathname === `/admin/collections/sites/${siteDocId}/dashboard`
                  }
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />

                {!collapsed && (
                  <p className="mb-2 mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-(--cms-text-muted)">
                    Content
                  </p>
                )}
                {siteContextLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    icon={link.icon}
                    label={link.label}
                    active={
                      pathname === link.href || Boolean(pathname?.startsWith(link.href + '/'))
                    }
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                  />
                ))}

                {previewSiteSlug && (
                  <NavLink
                    href={`/preview/${previewSiteSlug}`}
                    icon={ExternalLink}
                    label="Preview Site"
                    active={false}
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                  />
                )}

                {!collapsed && (
                  <p className="mb-2 mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-(--cms-text-muted)">
                    Manage
                  </p>
                )}
                <NavLink
                  href={`/admin/collections/sites/${siteDocId}/settings`}
                  icon={Settings}
                  label="Settings"
                  active={Boolean(
                    pathname?.startsWith(`/admin/collections/sites/${siteDocId}/settings`),
                  )}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
                <NavLink
                  href="/admin/trash"
                  icon={Trash2}
                  label="Trash"
                  active={pathname === '/admin/trash'}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              </>
            ) : (
              <NavLink
                href="/admin"
                icon={LayoutDashboard}
                label="Dashboard"
                active={pathname === '/admin'}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            )}
          </>
        )}
      </nav>

      {/* Footer: user */}
      <div
        className={cn(
          'shrink-0 border-t border-(--cms-border-subtle)',
          collapsed ? 'flex flex-col items-center gap-2 p-2' : 'p-3',
        )}
      >
        {collapsed ? (
          /* Collapsed: avatar + logout below */
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="size-8 shrink-0 cursor-pointer">
                  <AvatarFallback className="bg-blue-100 text-[11px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-[12px] font-medium">{user?.email}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => void handleLogOut()}
                  className="flex size-8 items-center justify-center rounded-lg text-(--cms-text-muted) transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                >
                  <LogOut className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          </>
        ) : (
          /* Expanded: full user row + logout button */
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="bg-blue-100 text-[11px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-medium text-(--cms-text)">
                  {user?.email ?? '—'}
                </p>
                <p className="text-[10px] text-(--cms-text-muted)">
                  {isSuperAdmin ? 'Administrator' : 'Client'}
                </p>
              </div>
            </div>
            <button
              onClick={() => void handleLogOut()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-(--cms-border)  py-2 text-[12px] font-medium text-(--cms-text-secondary) transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-900/40 dark:hover:bg-red-900/20 dark:hover:text-red-300"
            >
              <LogOut className="size-3.5" />
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Sidebar() {
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const userRole = user && 'role' in user ? String(user.role ?? '') : ''
  const clientWorkspace = userRole === 'client' && isClientWorkspacePath(pathname ?? '')
  const clientSiteWorkspace = userRole === 'client' && isClientSiteWorkspacePath(pathname ?? '')

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) setCollapsed(saved === 'true')
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed))
    document.documentElement.dataset.navCollapsed = String(collapsed)
  }, [collapsed])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const root = document.documentElement

    root.dataset.adminRole = userRole || 'unknown'
    root.dataset.clientWorkspace = String(clientWorkspace)
    root.dataset.clientSiteWorkspace = String(clientSiteWorkspace)
    root.dataset.clientMobileNavOpen = String(clientWorkspace && mobileOpen)

    return () => {
      delete root.dataset.adminRole
      delete root.dataset.clientWorkspace
      delete root.dataset.clientSiteWorkspace
      delete root.dataset.clientMobileNavOpen
    }
  }, [userRole, clientWorkspace, clientSiteWorkspace, mobileOpen])

  return (
    <>
      <div className="hidden h-full md:block">
        <SidebarInner collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      </div>

      <div
        className="fixed left-3 top-3 z-50 md:hidden"
        style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className={cn(
              'flex size-11 items-center justify-center rounded-2xl bg-(--cms-primary) text-white shadow-lg shadow-black/20 transition hover:bg-(--cms-primary-hover)',
              mobileOpen && 'pointer-events-none opacity-0',
            )}
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[86vw] max-w-[320px] overflow-hidden p-0"
            showCloseButton
          >
            <SidebarInner
              collapsed={false}
              onToggle={() => {}}
              onNavigate={() => setMobileOpen(false)}
              mobileMode
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
