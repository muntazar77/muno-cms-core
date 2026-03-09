'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Settings, LogOut, Database, FileImage } from 'lucide-react'
import { useAuth, useConfig } from '@payloadcms/ui'

/**
 * Map collection slugs to icons
 */
const COLLECTION_ICONS: Record<string, React.ElementType> = {
  users: Database,
  media: FileImage,
}

function getCollectionLabel(label: unknown, fallback: string): string {
  if (typeof label === 'string') return label
  if (typeof label === 'function') {
    try {
      return (label as () => string)()
    } catch {
      return fallback
    }
  }
  return fallback
}

/**
 * Navigation link component with active state styling
 */
function NavLink({
  href,
  title,
  icon: Icon,
  isActive,
}: {
  href: string
  title: string
  icon: React.ElementType
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium no-underline transition-colors duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="size-5" />
      <span>{title}</span>
    </Link>
  )
}

/**
 * Sidebar content - Payload CMS integrated
 */
function SidebarContent() {
  const pathname = usePathname()
  const { user, logOut } = useAuth()
  const { config } = useConfig()

  const collections = config.collections ?? []
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : '--'

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="flex h-full flex-col bg-white text-gray-900">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-6">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
          <LayoutDashboard className="size-5" />
        </div>
        <div>
          <h1 className="m-0 text-sm font-semibold text-gray-900">Student Services</h1>
          <p className="m-0 text-xs text-gray-600">Management System</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          Main Menu
        </p>

        <div className="flex flex-col gap-1">
          {/* Dashboard */}
          <NavLink
            href="/admin"
            title="Dashboard"
            icon={LayoutDashboard}
            isActive={isActive('/admin', true)}
          />

          {/* Collections */}
          {collections.map((col) => {
            const slug = col.slug
            const href = `/admin/collections/${slug}`
            const Icon = COLLECTION_ICONS[slug] ?? Database
            const label = getCollectionLabel(col.labels.plural, slug)

            return (
              <NavLink key={slug} href={href} title={label} icon={Icon} isActive={isActive(href)} />
            )
          })}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 px-3 py-4">
        <div className="mb-4">
          <NavLink
            href="/admin/account"
            title="Account Settings"
            icon={Settings}
            isActive={isActive('/admin/account')}
          />
        </div>

        {/* User Profile / Logout */}
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100">
            <span className="text-sm font-semibold text-blue-600">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="m-0 truncate text-sm font-medium text-gray-900">
              {user?.email ?? 'Unknown'}
            </p>
            <p className="m-0 truncate text-xs text-gray-600">Admin</p>
          </div>
          <button
            onClick={() => void logOut()}
            title="Log out"
            className="flex h-7 w-7 items-center justify-center rounded-xl border-0 bg-transparent text-gray-500 transition-colors hover:text-red-600"
          >
            <LogOut className="size-4" />
            <span className="sr-only">Log out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Payload Nav override: return nav content only.
 * Do not use fixed positioning here because Payload already controls layout.
 */
export default function Sidebar() {
  return <SidebarContent />
}
