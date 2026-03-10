'use client'

import { useTheme } from '@payloadcms/ui'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'flex size-8 items-center justify-center rounded-lg border-0 bg-transparent',
        'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
        'dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
        'transition-colors',
        className,
      )}
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun className="size-[15px]" /> : <Moon className="size-[15px]" />}
    </button>
  )
}
