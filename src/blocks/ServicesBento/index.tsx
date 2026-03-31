import Image from 'next/image'
import Link from 'next/link'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

interface BentoItem {
  id?: string | null
  icon?: string | null
  title: string
  description?: string | null
  badge?: string | null
  ctaLabel?: string | null
  ctaLink?: string | null
  image?: (number | null) | Media
  isFeatured?: boolean | null
  theme?: 'light' | 'dark' | null
  iconStyle?: 'primarySoft' | 'secondarySoft' | 'surfaceHigh' | 'darkGlass' | null
  details?: { id?: string | null; detail: string }[] | null
  tags?: { id?: string | null; tag: string }[] | null
}

interface ServicesBentoBlockProps {
  eyebrow?: string | null
  heading: string
  description?: string | null
  ctaLabel?: string | null
  ctaLink?: string | null
  items?: BentoItem[] | null
}

export function ServicesBentoBlock({
  eyebrow,
  heading,
  description,
  ctaLabel,
  ctaLink,
  items,
}: ServicesBentoBlockProps) {
  if (!items?.length) return null

  const featured = items.find((i) => i.isFeatured)
  const dark = items.find((i) => !i.isFeatured && i.theme === 'dark')
  const regular = items.filter((i) => i !== featured && i !== dark)

  return (
    <section className="bg-[var(--fe-surface-secondary)] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            {eyebrow && (
              <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.24em] text-amber-700">
                {eyebrow}
              </p>
            )}
            <h2 className="text-4xl font-extrabold tracking-tight text-[var(--fe-text-primary)] sm:text-5xl">
              {heading}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pl-10">
            {description && (
              <p className="text-base leading-8 text-[var(--fe-text-secondary)]">{description}</p>
            )}
            {ctaLabel && ctaLink && (
              <Link
                href={ctaLink}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--fe-primary)]"
              >
                {ctaLabel}
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-12">
          {featured && <FeaturedCard item={featured} />}
          {dark && <DarkStrategyCard item={dark} />}
          {regular.slice(0, 3).map((item) => (
            <CompactCard key={item.id ?? item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedCard({ item }: { item: BentoItem }) {
  const media = typeof item.image === 'object' && item.image !== null ? (item.image as Media) : null

  return (
    <article className="md:col-span-7 rounded-[2rem] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl lg:p-8">
      <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <IconBadge icon={item.icon} iconStyle={item.iconStyle} />
          <h3 className="mt-5 text-3xl font-extrabold tracking-tight text-[var(--fe-text-primary)]">
            {item.title}
          </h3>
          {item.description && (
            <p className="mt-4 max-w-xl text-base leading-8 text-[var(--fe-text-secondary)]">
              {item.description}
            </p>
          )}
          {(item.badge || item.ctaLabel) && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--fe-surface-secondary)] px-4 py-2 text-sm font-bold text-[var(--fe-primary)]">
              {item.badge || item.ctaLabel}
              <span aria-hidden="true">→</span>
            </div>
          )}
        </div>
        <div className="overflow-hidden rounded-[1.6rem] bg-[var(--fe-surface-secondary)] p-3">
          {media?.url ? (
            <Image
              src={media.url}
              alt={media.alt || item.title}
              width={1000}
              height={700}
              className="h-64 w-full rounded-[1.2rem] object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-[1.2rem] bg-[var(--fe-gray-100)] text-sm text-[var(--fe-text-muted)]">
              Featured image placeholder
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

function DarkStrategyCard({ item }: { item: BentoItem }) {
  return (
    <article className="md:col-span-5 rounded-[2rem] bg-[var(--fe-primary)] p-8 text-white shadow-2xl">
      <IconBadge icon={item.icon} iconStyle="darkGlass" />
      <h3 className="mt-6 text-3xl font-extrabold tracking-tight">{item.title}</h3>
      {item.description && (
        <p className="mt-4 text-base leading-8 text-indigo-100">{item.description}</p>
      )}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {(item.details && item.details.length > 0
          ? item.details.map((d) => d.detail)
          : item.tags?.map((t) => t.tag) || []
        )
          .slice(0, 4)
          .map((label) => (
            <div key={label} className="rounded-2xl bg-white/10 p-4 text-sm text-indigo-100">
              {label}
            </div>
          ))}
      </div>
    </article>
  )
}

function CompactCard({ item }: { item: BentoItem }) {
  return (
    <article className="md:col-span-4 rounded-[2rem] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-sm">
      <IconBadge icon={item.icon} iconStyle={item.iconStyle} compact />
      <h3 className="mt-5 text-2xl font-extrabold text-[var(--fe-text-primary)]">{item.title}</h3>
      {item.description && (
        <p className="mt-3 text-sm leading-7 text-[var(--fe-text-secondary)]">{item.description}</p>
      )}
      {item.ctaLabel && item.ctaLink && (
        <Link
          href={item.ctaLink}
          className="mt-4 inline-flex text-sm font-semibold text-[var(--fe-primary)]"
        >
          {item.ctaLabel}
        </Link>
      )}
    </article>
  )
}

function IconBadge({
  icon,
  iconStyle,
  compact,
}: {
  icon?: string | null
  iconStyle?: BentoItem['iconStyle']
  compact?: boolean
}) {
  const classes = {
    primarySoft: 'bg-indigo-100 text-[var(--fe-primary)]',
    secondarySoft: 'bg-amber-100 text-amber-700',
    surfaceHigh: 'bg-[var(--fe-surface-secondary)] text-[var(--fe-primary)]',
    darkGlass: 'bg-white/10 text-indigo-200',
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-2xl text-[26px]',
        compact ? 'h-12 w-12' : 'h-14 w-14',
        classes[iconStyle || 'primarySoft'],
      )}
    >
      {icon || '✦'}
    </div>
  )
}
