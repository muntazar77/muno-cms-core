'use client'

import { useBuilder } from './BuilderProvider'
import { FieldRenderer, type BuilderField } from './FieldRenderer'
import { getBlockMeta } from '@/blocks/registry'
import { Settings, X } from 'lucide-react'

interface BlockSettingsProps {
  blockFieldsMap: Record<string, BuilderField[]>
}

export function BlockSettings({ blockFieldsMap }: BlockSettingsProps) {
  const { state, updateBlock, removeBlock, selectBlock, getSelectedBlock } = useBuilder()
  const selectedBlock = getSelectedBlock()

  if (!selectedBlock) {
    return (
      <aside className="w-[320px] shrink-0 border-l border-gray-200 bg-white flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
          <Settings className="h-6 w-6 text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-400">No block selected</p>
        <p className="text-xs text-gray-300 mt-1">
          Click a block on the canvas to edit its settings
        </p>
      </aside>
    )
  }

  const meta = getBlockMeta(selectedBlock.blockType)
  const fields = blockFieldsMap[selectedBlock.blockType] || []

  return (
    <aside className="w-[320px] shrink-0 border-l border-gray-200 bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {meta && (
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${meta.color}15`,
                color: meta.color,
              }}
            >
              <meta.icon className="h-3.5 w-3.5" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {meta?.label || selectedBlock.blockType}
            </h3>
          </div>
        </div>
        <button
          onClick={() => selectBlock(null)}
          className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
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
          <p className="text-sm text-gray-400 text-center py-4">
            No configurable fields for this block
          </p>
        )}
      </div>

      {/* Footer actions */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => removeBlock(selectedBlock.id)}
          type="button"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          Remove Block
        </button>
      </div>
    </aside>
  )
}
