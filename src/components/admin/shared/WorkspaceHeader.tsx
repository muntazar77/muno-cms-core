import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface WorkspaceHeaderStat {
  label: string
  value: string
}

interface WorkspaceHeaderProps {
  eyebrow?: string
  title: string
  description: string
  primaryActionHref?: string
  primaryActionLabel?: string
  stats?: WorkspaceHeaderStat[]
  aside?: ReactNode
}

export default function WorkspaceHeader({
  eyebrow,
  title,
  description,
  primaryActionHref,
  primaryActionLabel,
  stats = [],
  aside,
}: WorkspaceHeaderProps) {
  return (
    <Card className="overflow-hidden rounded-[28px] border-(--cms-card-border) bg-(--cms-card-bg)">
      <div
        className="relative px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
        style={{
          backgroundImage:
            'radial-gradient(circle at top right, var(--cms-primary-soft), transparent 34%), radial-gradient(circle at bottom left, var(--cms-bg-muted), transparent 38%)',
        }}
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
          <div>
            {eyebrow ? (
              <div className="inline-flex items-center rounded-full border border-(--cms-border) bg-(--cms-bg) px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--cms-text-secondary)">
                {eyebrow}
              </div>
            ) : null}

            <div className="mt-4 max-w-4xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <h1 className="text-3xl font-semibold tracking-[-0.03em] text-(--cms-text) sm:text-4xl xl:text-[2.8rem] xl:leading-[1.05]">
                    {title}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-(--cms-text-secondary) sm:text-[15px]">
                    {description}
                  </p>
                </div>

                {primaryActionHref && primaryActionLabel ? (
                  <Link href={primaryActionHref} className="shrink-0">
                    <Button className="h-11 min-w-[164px] gap-2 rounded-2xl bg-(--cms-primary) px-5 text-sm font-semibold text-white shadow-sm shadow-black/5 hover:bg-(--cms-primary-hover)">
                      <Plus className="size-4" />
                      {primaryActionLabel}
                    </Button>
                  </Link>
                ) : null}
              </div>
            </div>

            {stats.length > 0 ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-(--cms-border) bg-(--cms-bg)/90 px-4 py-3 backdrop-blur-sm"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                      {stat.label}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-(--cms-text)">
                      <span className="text-lg font-semibold tracking-[-0.02em]">{stat.value}</span>
                      <ArrowRight className="size-3.5 text-(--cms-text-muted)" />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {aside ? <div className={cn('xl:pt-1')}>{aside}</div> : null}
        </div>
      </div>
    </Card>
  )
}
