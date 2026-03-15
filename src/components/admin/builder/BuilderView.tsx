'use client'

import { useEffect, useCallback } from 'react'
import { Monitor, Tablet, Smartphone, Save, Loader2, ArrowLeft } from 'lucide-react'
import { BuilderProvider, useBuilder, type BuilderBlock } from './BuilderProvider'
import { BlockLibrary } from './BlockLibrary'
import { BuilderCanvas } from './BuilderCanvas'
import { BlockSettings } from './BlockSettings'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
      <TooltipProvider delayDuration={200}>
        <div className="builder-root">
          <BuilderToolbar pageTitle={pageTitle} pageId={pageId} />
          <div className="grid grid-cols-[280px_1fr_320px] flex-1 min-h-0 overflow-hidden">
            <BlockLibrary />
            <BuilderCanvas />
            <BlockSettings blockFieldsMap={blockFieldsMap} />
          </div>
        </div>
      </TooltipProvider>
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
    <header className="h-11 shrink-0 border-b border-[var(--cms-border)] bg-[var(--cms-bg)] flex items-center justify-between px-3">
      {/* Left: Back + title */}
      <div className="flex items-center gap-2 min-w-[200px]">
        <a
          href={`/admin/collections/pages/${pageId}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </a>
        <Separator orientation="vertical" className="!h-4" />
        <span className="text-sm font-semibold text-[var(--cms-text)] truncate max-w-[180px]">
          {pageTitle}
        </span>
      </div>

      {/* Center: Device toggles */}
      <div className="flex items-center gap-0.5 rounded-lg border border-[var(--cms-border-subtle)] bg-[var(--cms-bg-elevated)] p-0.5">
        {devices.map(({ mode, icon: Icon, label }) => (
          <Tooltip key={mode}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setDeviceMode(mode)}
                className={`p-1.5 rounded-md transition-all ${
                  deviceMode === mode
                    ? 'bg-[var(--cms-bg)] text-[var(--cms-text)] shadow-sm'
                    : 'text-[var(--cms-text-muted)] hover:text-[var(--cms-text-secondary)]'
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Right: Save */}
      <div className="flex items-center gap-2 min-w-[200px] justify-end">
        {isDirty && !isSaving && (
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Unsaved</span>
        )}
        <Button onClick={handleSave} disabled={isSaving || !isDirty} size="sm">
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </header>
  )
}
