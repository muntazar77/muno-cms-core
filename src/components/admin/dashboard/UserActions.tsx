'use client'
import { Bell } from 'lucide-react'
import { useAuth } from '@payloadcms/ui'
import { ThemeToggle } from '../ThemeToggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function UserActions() {
  const { user } = useAuth()
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'AD'

  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
    <button
          className="relative flex size-9 items-center justify-center rounded-xl border-0 bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-gray-100 transition-all"
          aria-label="Notifications"
        >
          <Bell className="size-4.25" />
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-red-500" />
        </button>
      <ThemeToggle />

      <Avatar className="size-8 border-2 border-white shadow-sm">
        <AvatarFallback className="bg-gradient-to-tr from-indigo-500 to-purple-500 text-[10px] text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}