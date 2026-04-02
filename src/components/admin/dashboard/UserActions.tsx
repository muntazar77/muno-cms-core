'use client'
import { Bell, LogOut, Settings2 } from 'lucide-react'
import { useAuth } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from '../ThemeToggle'
import AccountAvatar from '@/components/admin/account/AccountAvatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function UserActions() {
  const { user, logOut } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const fullName =
    user && typeof user === 'object' && 'fullName' in user ? String(user.fullName ?? '') : ''
  const email = user?.email ?? ''
  const avatar =
    user && typeof user === 'object' && 'avatar' in user
      ? (user.avatar as string | { url?: string | null } | null)
      : null
  const avatarUrl =
    avatar && typeof avatar === 'object' ? (avatar.url ?? null) : typeof avatar === 'string' ? avatar : null

  async function handleLogout() {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      await logOut()
      router.replace('/admin/login')
      router.refresh()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="flex shrink-0 items-center justify-end gap-1.5 pl-2 sm:gap-2">
      {/* Notifications */}
      <button
        className="relative flex size-9 items-center justify-center rounded-xl border-0 bg-transparent text-(--cms-text-secondary) transition-all hover:bg-(--cms-bg-muted) hover:text-(--cms-text)"
        aria-label="Notifications"
      >
        <Bell className="size-4.25" />
        <span className="absolute right-2 top-2 size-1.5 rounded-full bg-(--cms-danger)" />
      </button>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Open account menu"
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--cms-primary)"
          >
            <AccountAvatar fullName={fullName} email={email} imageUrl={avatarUrl} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-60 rounded-xl border-(--cms-border) bg-(--cms-card-bg) p-2 shadow-lg"
        >
          <DropdownMenuLabel className="px-2 py-1.5">
            <p className="truncate text-xs font-semibold text-(--cms-text)">{fullName || 'Account'}</p>
            <p className="truncate text-[11px] font-normal text-(--cms-text-muted)">{email || '—'}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1 bg-(--cms-border-subtle)" />
          <DropdownMenuItem
            className="rounded-lg text-(--cms-text-secondary)"
            onSelect={(event) => {
              event.preventDefault()
              router.push('/admin/account')
            }}
          >
            <Settings2 className="mr-2 size-4" />
            My Account
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 bg-(--cms-border-subtle)" />
          <DropdownMenuItem
            className="rounded-lg text-(--cms-danger-text) focus:bg-(--cms-danger-soft) focus:text-(--cms-danger-text)"
            onSelect={(event) => {
              event.preventDefault()
              void handleLogout()
            }}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 size-4" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}