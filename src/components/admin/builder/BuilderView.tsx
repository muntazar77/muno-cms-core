'use client'

import { useEffect, useCallback } from 'react'
import { ArrowLeft, Monitor, Tablet, Smartphone, Save, Loader2 } from 'lucide-react'
import { BuilderProvider, useBuilder, type BuilderBlock } from './BuilderProvider'
import { BlockLibrary } from './BlockLibrary'
import { BuilderCanvas } from './BuilderCanvas'
import { BlockSettings } from './BlockSettings'
import type { BuilderField } from './FieldRenderer'

interface BuilderViewProps {
  pageId: number
  pageTitle: string
  initialBlocks: BuilderBlock[]
  blockFieldsMap: Record<string, BuilderField[]>
}

export default function BuilderView({
  pageId,
  pageTitle,
  initialBlocks,
  blockFieldsMap,
}: BuilderViewProps) {
  return (
    <BuilderProvider pageId={pageId} initialBlocks={initialBlocks}>
      <div className="builder-root fixed inset-0 z-[9999] flex flex-col bg-white">
        <BuilderToolbar pageTitle={pageTitle} pageId={pageId} />
        <div className="flex flex-1 overflow-hidden">
          <BlockLibrary />
          <BuilderCanvas />
          <BlockSettings blockFieldsMap={blockFieldsMap} />
        </div>
      </div>
    </BuilderProvider>
  )
}

function BuilderToolbar({ pageTitle, pageId }: { pageTitle: string; pageId: number }) {
  const { state, setDeviceMode, saveBlocks } = useBuilder()
  const { deviceMode, isDirty, isSaving } = state

  const handleSave = useCallback(async () => {
    if (isSaving) return
    await saveBlocks()
  }, [isSaving, saveBlocks])

  // Keyboard shortcut: Cmd/Ctrl + S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  const devices = [
    { mode: 'desktop' as const, icon: Monitor, label: 'Desktop' },
    { mode: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
  ]

  return (
    <header className="h-14 shrink-0 border-b border-gray-200 bg-white flex items-center justify-between px-4">
      {/* Left: Back link */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <a
          href={`/admin/collections/pages/${pageId}`}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Page
        </a>
      </div>

      {/* Center: Page title + device toggles */}
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{pageTitle}</h1>
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
          {devices.map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setDeviceMode(mode)}
              title={label}
              className={`p-1.5 rounded-md transition-all ${
                deviceMode === mode
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Save button */}
      <div className="flex items-center gap-3 min-w-[200px] justify-end">
        {isDirty && !isSaving && (
          <span className="text-xs text-amber-500 font-medium">Unsaved changes</span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </header>
  )
}
