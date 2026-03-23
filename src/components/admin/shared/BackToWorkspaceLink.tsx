import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface BackToWorkspaceLinkProps {
  href: string
  label: string
}

export default function BackToWorkspaceLink({ href, label }: BackToWorkspaceLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-(--cms-border) bg-(--cms-bg) px-3 text-sm font-medium text-(--cms-text-secondary) no-underline transition hover:bg-(--cms-bg-elevated) hover:text-(--cms-text)"
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  )
}
