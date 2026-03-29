'use client'
import { Search, Command as CommandIcon } from 'lucide-react'

export default function SearchAction() {
  const openCommandMenu = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))
  }

  return (
    <div className="flex-1 max-w-md mx-4 w-3xl"> 
      <button
        onClick={openCommandMenu}
        className="flex items-center gap-2.5 rounded-xl border border-(--cms-border) bg-(--cms-bg-elevated) px-4 py-2 text-sm text-(--cms-text-muted) hover:bg-(--cms-bg) hover:shadow-sm transition-all w-full"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left text-xs">Search records...</span>
        <kbd className="hidden sm:flex items-center gap-1 rounded-md bg-(--cms-bg) border border-(--cms-border-subtle) px-1.5 py-0.5 text-[10px]">
          <CommandIcon className="size-2.5" />K
        </kbd>
      </button>
    </div>
  )
}