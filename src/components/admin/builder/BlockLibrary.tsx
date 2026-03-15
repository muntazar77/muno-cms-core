'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { BLOCK_REGISTRY, BLOCK_CATEGORIES } from '@/blocks/registry'
import { useBuilder } from './BuilderProvider'

export function BlockLibrary() {
  const [search, setSearch] = useState('')
  const { addBlock } = useBuilder()

  const filtered = BLOCK_REGISTRY.filter(
    (b) =>
      b.label.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()),
  )

  const categories = BLOCK_CATEGORIES.filter((cat) => filtered.some((b) => b.category === cat.id))

  return (
    <aside className="flex flex-col overflow-hidden border-r border-[var(--cms-border)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--cms-border-subtle)]">
        <h2 className="text-xs font-semibold text-[var(--cms-text)] mb-2">Blocks</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--cms-text-muted)]" />
          <Input
            placeholder="Search blocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Block categories */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {categories.map((cat) => (
          <div key={cat.id}>
            <h3 className="text-[10px] font-semibold text-[var(--cms-text-muted)] uppercase tracking-wider px-1 mb-2">
              {cat.label}
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {filtered
                .filter((b) => b.category === cat.id)
                .map((block) => (
                  <button
                    key={block.slug}
                    onClick={() => addBlock(block.slug)}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border border-[var(--cms-border-subtle)] bg-[var(--cms-bg)] hover:border-blue-500/50 hover:shadow-sm transition-all text-center group cursor-pointer"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${block.color}12`,
                        color: block.color,
                      }}
                    >
                      <block.icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-medium text-[var(--cms-text-secondary)] group-hover:text-[var(--cms-text)] leading-tight transition-colors">
                      {block.label}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-[var(--cms-text-muted)]">
            No blocks found
          </div>
        )}
      </div>
    </aside>
  )
}
