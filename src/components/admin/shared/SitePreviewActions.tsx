'use client'

import { useState } from 'react'
import { Copy, ExternalLink, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface SitePreviewActionsProps {
  previewURL: string
  liveURL: string
}

export default function SitePreviewActions({ previewURL, liveURL }: SitePreviewActionsProps) {
  const [isCopying, setIsCopying] = useState(false)
  const hasLiveURL = liveURL !== '#'

  async function copyPreviewURL() {
    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(previewURL)
      toast.success('Preview URL copied.')
    } catch {
      toast.error('Unable to copy preview URL.')
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={previewURL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-(--cms-border) bg-(--cms-bg) px-4 text-sm font-medium text-(--cms-text) no-underline transition hover:border-(--cms-primary) hover:text-(--cms-primary)"
      >
        <Eye className="size-4" />
        Preview Site
      </a>
      {hasLiveURL ? (
        <a
          href={liveURL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-(--cms-border) bg-(--cms-bg) px-4 text-sm font-medium text-(--cms-text) no-underline transition hover:border-(--cms-primary) hover:text-(--cms-primary)"
        >
          <ExternalLink className="size-4" />
          Open Live Site
        </a>
      ) : (
        <span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) px-4 text-sm font-medium text-(--cms-text-muted)">
          <ExternalLink className="size-4" />
          Live URL Unassigned
        </span>
      )}
      <button
        type="button"
        onClick={() => void copyPreviewURL()}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-(--cms-border) bg-(--cms-bg) px-4 text-sm font-medium text-(--cms-text) transition hover:border-(--cms-primary) hover:text-(--cms-primary)"
      >
        <Copy className="size-4" />
        {isCopying ? 'Copying...' : 'Copy Preview URL'}
      </button>
    </div>
  )
}
