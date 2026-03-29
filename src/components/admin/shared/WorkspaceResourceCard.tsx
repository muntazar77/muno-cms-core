import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, Hammer, PenLine } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import SoftDeleteButton from './SoftDeleteButton'

type ResourceStatusTone = 'success' | 'warning' | 'neutral'

interface WorkspaceResourceMeta {
  label: string
  value: string
}

interface WorkspaceResourceCardProps {
  title: string
  subtitle: string
  href: string
  statusLabel: string
  statusTone: ResourceStatusTone
  icon: LucideIcon
  meta: WorkspaceResourceMeta[]
  editHref: string
  builderHref?: string
  deleteCollection?: string
  deleteDocId?: string
}

const statusToneStyles: Record<ResourceStatusTone, string> = {
  success: 'bg-(--cms-success-soft) text-(--cms-success-text)',
  warning: 'bg-(--cms-warning-soft) text-(--cms-warning-text)',
  neutral: 'bg-(--cms-bg-muted) text-(--cms-text-secondary)',
}

export default function WorkspaceResourceCard({
  title,
  subtitle,
  href,
  statusLabel,
  statusTone,
  icon: Icon,
  meta,
  editHref,
  builderHref,
  deleteCollection,
  deleteDocId,
}: WorkspaceResourceCardProps) {
  return (
    <Card className="group rounded-3xl border-(--cms-card-border) bg-(--cms-card-bg) p-0 transition duration-200 hover:-translate-y-0.5 hover:border-(--cms-primary)">
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-(--cms-bg-muted) text-(--cms-text-secondary)">
                <Icon className="size-4.5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={href}
                    className="truncate text-base font-semibold tracking-[-0.02em] text-(--cms-text) transition hover:text-(--cms-primary) sm:text-[17px]"
                  >
                    {title}
                  </Link>
                  <Badge
                    className={cn(
                      'shrink-0 border-0 text-[10px] font-semibold uppercase tracking-[0.12em]',
                      statusToneStyles[statusTone],
                    )}
                  >
                    {statusLabel}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-sm text-(--cms-text-secondary)">{subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
            <Link href={editHref}>
              <Button
                variant="outline"
                size="sm"
                className="h-10 gap-2 rounded-xl border-(--cms-border) bg-(--cms-bg) px-3 text-(--cms-text-secondary) hover:text-(--cms-text)"
              >
                <PenLine className="size-4" />
                Edit
              </Button>
            </Link>
            {builderHref ? (
              <Link href={builderHref}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 gap-2 rounded-xl border-(--cms-border) bg-(--cms-bg) px-3 text-(--cms-text-secondary) hover:border-(--cms-primary) hover:text-(--cms-primary)"
                >
                  <Hammer className="size-4" />
                  Builder
                </Button>
              </Link>
            ) : null}
            {deleteCollection && deleteDocId ? (
              <SoftDeleteButton  collection={deleteCollection} docId={deleteDocId} label="Page"  />
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 border-t border-(--cms-border-subtle) pt-4 sm:grid-cols-3">
          {meta.map((item) => (
            <div key={item.label} className="rounded-2xl bg-(--cms-bg-muted) px-3.5 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                {item.label}
              </p>
              <p className="mt-1 text-sm font-medium text-(--cms-text)">{item.value}</p>
            </div>
          ))}
        </div>

        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm font-medium text-(--cms-primary) transition hover:text-(--cms-primary-hover)"
        >
          Open page
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </Card>
  )
}
