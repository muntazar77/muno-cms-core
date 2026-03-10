'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  ClipboardList,
  Users,
  Settings,
  Plus,
  Upload,
  Search,
  MoveRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandItem {
  label: string
  icon: React.ElementType
  shortcut?: string
  action: () => void
  group: string
}

export default function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const navigate = useCallback(
    (href: string) => {
      router.push(href)
      setOpen(false)
    },
    [router],
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const items: CommandItem[] = [
    {
      group: 'Navigate',
      label: 'Dashboard',
      icon: LayoutDashboard,
      action: () => navigate('/admin'),
    },
    {
      group: 'Navigate',
      label: 'Pages',
      icon: FileText,
      action: () => navigate('/admin/collections/pages'),
    },
    {
      group: 'Navigate',
      label: 'Media',
      icon: ImageIcon,
      action: () => navigate('/admin/collections/media'),
    },
    {
      group: 'Navigate',
      label: 'Applications',
      icon: ClipboardList,
      action: () => navigate('/admin/collections/applications'),
    },
    {
      group: 'Navigate',
      label: 'Users',
      icon: Users,
      action: () => navigate('/admin/collections/users'),
    },
    {
      group: 'Navigate',
      label: 'Settings',
      icon: Settings,
      action: () => navigate('/admin/account'),
    },
    {
      group: 'Create',
      label: 'Create Page',
      icon: Plus,
      shortcut: '⌘N',
      action: () => navigate('/admin/collections/pages/create'),
    },
    {
      group: 'Create',
      label: 'Upload Media',
      icon: Upload,
      action: () => navigate('/admin/collections/media/create'),
    },
    {
      group: 'Create',
      label: 'Add User',
      icon: Users,
      action: () => navigate('/admin/collections/users/create'),
    },
  ]

  const groups = Array.from(new Set(items.map((i) => i.group)))

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false)
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
        <Command className="[&_[cmdk-input-wrapper]]:border-b [&_[cmdk-input-wrapper]]:border-gray-100">
          {/* Search header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <Search className="size-4 text-gray-400 shrink-0" />
            <Command.Input
              placeholder="Search commands..."
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
              autoFocus
            />
            <div className="flex items-center gap-1">
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                ESC
              </kbd>
            </div>
          </div>

          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-gray-400">
              No results found.
            </Command.Empty>

            {groups.map((group) => (
              <Command.Group
                key={group}
                heading={group}
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-gray-400"
              >
                {items
                  .filter((i) => i.group === group)
                  .map((item) => {
                    const Icon = item.icon
                    return (
                      <Command.Item
                        key={item.label}
                        value={item.label}
                        onSelect={item.action}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 cursor-pointer',
                          'data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-700',
                          'transition-colors',
                        )}
                      >
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 data-[selected=true]:bg-blue-100">
                          <Icon className="size-3.5" />
                        </div>
                        <span className="flex-1">{item.label}</span>
                        {item.shortcut && (
                          <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                            {item.shortcut}
                          </kbd>
                        )}
                        <MoveRight className="size-3 text-gray-300 opacity-0 group-data-[selected=true]:opacity-100" />
                      </Command.Item>
                    )
                  })}
              </Command.Group>
            ))}
          </Command.List>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2.5 flex items-center gap-4 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-gray-100 px-1 font-medium text-gray-500">↑↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-gray-100 px-1 font-medium text-gray-500">↵</kbd> select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-gray-100 px-1 font-medium text-gray-500">⌘K</kbd> toggle
            </span>
          </div>
        </Command>
      </div>
    </div>
  )
}
