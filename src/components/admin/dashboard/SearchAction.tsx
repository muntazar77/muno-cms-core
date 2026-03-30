'use client'
import { Search, Command as CommandIcon } from 'lucide-react'

export default function SearchAction() {
  const openCommandMenu = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))
  }

  return (
    <div className="flex min-w-0 flex-1 items-center pr-2 sm:pr-3">
      <button
        onClick={openCommandMenu}
        className="flex h-10 w-full max-w-140 items-center gap-2.5 rounded-xl border border-(--cms-border) bg-(--cms-bg-elevated) px-3.5 text-sm text-(--cms-text-muted) transition-all hover:bg-(--cms-bg) hover:shadow-sm"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 truncate text-left text-xs">Search records, pages, media...</span>
        <kbd className="hidden items-center gap-1 rounded-md border border-(--cms-border-subtle) bg-(--cms-bg) px-1.5 py-0.5 text-[10px] sm:flex">
          <CommandIcon className="size-2.5" />K
        </kbd>
      </button>
    </div>
  )
}