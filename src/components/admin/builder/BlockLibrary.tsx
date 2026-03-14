'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { BLOCK_REGISTRY, BLOCK_CATEGORIES } from '@/blocks/registry'
import { useBuilder } from './BuilderProvider'
import { Input } from '@/components/ui/input'

export function BlockLibrary() {
  const [search, setSearch] = useState('')
  const { addBlock } = useBuilder()

  const filtered = BLOCK_REGISTRY.filter(
    (b) =>
      b.label.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()),
  )

  const grouped = BLOCK_CATEGORIES.filter((cat) => filtered.some((b) => b.category === cat.id))

  return (
    <aside className="w-[280px] shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search blocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {grouped.map((cat) => (
          <div key={cat.id}>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">
              {cat.label}
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {filtered
                .filter((b) => b.category === cat.id)
                .map((block) => (
                  <button
                    key={block.slug}
                    onClick={() => addBlock(block.slug)}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50/60 transition-all text-center group cursor-pointer"
                  >
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${block.color}15`,
                        color: block.color,
                      }}
                    >
                      <block.icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-medium text-gray-600 group-hover:text-gray-900 leading-tight">
                      {block.label}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-400">No blocks found</div>
        )}
      </div>
    </aside>
  )
}
