'use client'

import { useBuilder } from './BuilderProvider'
import { FieldRenderer, type BuilderField } from './FieldRenderer'
import { getBlockMeta } from '@/blocks/registry'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Settings, X, Trash2 } from 'lucide-react'

interface BlockSettingsProps {
  blockFieldsMap: Record<string, BuilderField[]>
}

export function BlockSettings({ blockFieldsMap }: BlockSettingsProps) {
  const { updateBlock, removeBlock, selectBlock, getSelectedBlock } = useBuilder()
  const selectedBlock = getSelectedBlock()

  if (!selectedBlock) {
    return (
      <aside className="flex flex-col items-center justify-center text-center p-6 border-l border-[var(--cms-border)]">
        <div className="w-12 h-12 rounded-xl bg-[var(--cms-bg-muted)] flex items-center justify-center mb-3">
          <Settings className="h-5 w-5 text-[var(--cms-text-muted)]" />
        </div>
        <p className="text-sm font-medium text-[var(--cms-text-secondary)]">No block selected</p>
        <p className="text-xs text-[var(--cms-text-muted)] mt-1">
          Click a block on the canvas to edit
        </p>
      </aside>
    )
  }

  const meta = getBlockMeta(selectedBlock.blockType)
  const fields = blockFieldsMap[selectedBlock.blockType] || []

  return (
    <aside className="flex flex-col overflow-hidden border-l border-[var(--cms-border)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--cms-border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {meta && (
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${meta.color}12`,
                color: meta.color,
              }}
            >
              <meta.icon className="h-3.5 w-3.5" />
            </div>
          )}
          <h3 className="text-xs font-semibold text-[var(--cms-text)] truncate">
            {meta?.label || selectedBlock.blockType}
          </h3>
        </div>
        <button
          onClick={() => selectBlock(null)}
          className="p-1 rounded-md text-[var(--cms-text-muted)] hover:text-[var(--cms-text)] hover:bg-[var(--cms-bg-muted)] transition-colors shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {fields.length > 0 ? (
          fields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={selectedBlock[field.name]}
              onChange={(val) => updateBlock(selectedBlock.id, { [field.name]: val })}
            />
          ))
        ) : (
          <p className="text-sm text-[var(--cms-text-muted)] text-center py-4">
            No configurable fields
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--cms-border-subtle)]">
        <Button
          onClick={() => removeBlock(selectedBlock.id)}
          variant="destructive"
          size="sm"
          className="w-full"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove Block
        </Button>
      </div>
    </aside>
  )
}
