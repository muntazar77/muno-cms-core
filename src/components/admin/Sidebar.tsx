'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Image as ImageIcon,
  Users,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  Briefcase,
  ClipboardList,
  Inbox,
  Settings,
  Trash2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth, useConfig } from '@payloadcms/ui'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

// Map collection slugs → icons. Falls back to LayoutDashboard.
const COLLECTION_ICONS: Record<string, LucideIcon> = {
  users: Users,
  media: ImageIcon,
  pages: FileText,
  services: Briefcase,
  forms: ClipboardList,
  'form-submissions': Inbox,
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
}: {
  href: string
  icon: LucideIcon
  label: string
  active: boolean
  collapsed: boolean
}) {
  const link = (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium no-underline transition-all duration-150',
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
        collapsed && 'justify-center px-2',
      )}
    >
      <Icon className={cn('shrink-0', collapsed ? 'size-[18px]' : 'size-[16px]')} />
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

function SidebarInner({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname()
  const { user, logOut } = useAuth()
  const { config } = useConfig()
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'AD'

  // Filter out Payload internal collections (prefixed with "payload-")
  const collections = (config?.collections ?? []).filter((col) => !col.slug.startsWith('payload-'))

  return (
    <div className="flex h-full flex-col border-r border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
      {/* Header */}
      <div
        className={cn(
          'flex h-[52px] shrink-0 items-center border-b border-gray-100 dark:border-gray-800',
          collapsed ? 'justify-center gap-0 px-2' : 'gap-2.5 px-3',
        )}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
          <LayoutDashboard className="size-[15px]" />
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
              <p className="truncate text-[13px] font-semibold leading-tight text-gray-900 dark:text-gray-50">
                Muno CMS
              </p>
              <p className="text-[10.5px] leading-tight text-gray-400 dark:text-gray-500">
                Content Management
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className="flex size-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <PanelLeftOpen className="size-[15px]" />
              ) : (
                <PanelLeftClose className="size-[15px]" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
            Menu
          </p>
        )}

        {/* Dashboard */}
        <NavLink
          href="/admin"
          icon={LayoutDashboard}
          label="Dashboard"
          active={pathname === '/admin'}
          collapsed={collapsed}
        />

        {/* Collections — auto-generated from config */}
        {collections.map((col) => {
          const href = `/admin/collections/${col.slug}`
          const label = String(col.labels?.plural ?? col.slug)
          const Icon = COLLECTION_ICONS[col.slug] ?? LayoutDashboard
          const active = pathname === href || pathname.startsWith(href + '/')

          return (
            <NavLink
              key={col.slug}
              href={href}
              icon={Icon}
              label={label}
              active={active}
              collapsed={collapsed}
            />
          )
        })}

        {/* Globals */}
        {!collapsed && (
          <p className="mb-2 mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
            Settings
          </p>
        )}
        <NavLink
          href="/admin/globals/site-settings"
          icon={Settings}
          label="Site Settings"
          active={pathname.startsWith('/admin/globals/site-settings')}
          collapsed={collapsed}
        />
        <NavLink
          href="/admin/trash"
          icon={Trash2}
          label="Trash"
          active={pathname === '/admin/trash'}
          collapsed={collapsed}
        />
      </nav>

      {/* Footer: user */}
      <div
        className={cn(
          'shrink-0 border-t border-gray-100 p-3 dark:border-gray-800',
          collapsed ? 'flex justify-center' : 'flex items-center gap-2.5',
        )}
      >
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
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden"
            >
              <p className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-gray-900 dark:text-gray-100">
                {user?.email ?? '—'}
              </p>
              <button
                onClick={() => void logOut()}
                title="Log out"
                className="flex size-7 shrink-0 items-center justify-center rounded-md border-0 bg-transparent text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-gray-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              >
                <LogOut className="size-[14px]" />
                <span className="sr-only">Log out</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) setCollapsed(saved === 'true')
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed))
    document.documentElement.dataset.navCollapsed = String(collapsed)
  }, [collapsed])

  return <SidebarInner collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
}
