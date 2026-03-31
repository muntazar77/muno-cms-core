import Image from 'next/image'
import Link from 'next/link'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

interface Stat {
  id?: string | null
  value: string
  label: string
  description?: string | null
  color?: 'blue' | 'green' | 'purple' | 'amber' | null
}

interface FeatureHighlight {
  id?: string | null
  icon?: string | null
  title: string
  description?: string | null
}

interface HeroEditorialBlockProps {
  eyebrow?: string | null
  heading: string
  highlightedWord?: string | null
  subheading?: string | null
  badgeLabel?: string | null
  primaryCtaLabel?: string | null
  primaryCtaLink?: string | null
  secondaryCtaLabel?: string | null
  secondaryCtaLink?: string | null
  stats?: Stat[] | null
  mainImage?: (number | null) | Media
  sideImages?: { id?: string | null; image: number | Media; caption?: string | null }[] | null
  topOverlayCard?: { cardLabel?: string | null; cardText?: string | null } | null
  bottomOverlayCard?: {
    cardLabel?: string | null
    itemTitle?: string | null
    itemDescription?: string | null
  } | null
  featureHighlights?: FeatureHighlight[] | null
}

const statColorMap: Record<string, string> = {
  blue: 'text-[var(--fe-primary)]',
  green: 'text-emerald-600',
  purple: 'text-violet-600',
  amber: 'text-amber-600',
}

export function HeroEditorialBlock({
  eyebrow,
  heading,
  highlightedWord,
  subheading,
  badgeLabel,
  primaryCtaLabel,
  primaryCtaLink,
  secondaryCtaLabel,
  secondaryCtaLink,
  stats,
  mainImage,
  sideImages,
  topOverlayCard,
  bottomOverlayCard,
  featureHighlights,
}: HeroEditorialBlockProps) {
  const mainMedia =
    typeof mainImage === 'object' && mainImage !== null ? (mainImage as Media) : null
  const firstSideImage =
    sideImages && sideImages.length > 0
      ? typeof sideImages[0]?.image === 'object' && sideImages[0].image !== null
        ? (sideImages[0].image as Media)
        : null
      : null

  const headline = renderHeadingWithHighlight(heading, highlightedWord)

  return (
    <section className="hero-bleed section-noise relative overflow-hidden px-4 pt-36 sm:px-6 lg:px-8 lg:pt-44">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 pb-20 lg:grid-cols-12 lg:gap-12 lg:pb-28">
        <div className="lg:col-span-6 lg:pt-10">
          {(badgeLabel || eyebrow) && (
            <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-[var(--fe-primary-soft)] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--fe-primary)] shadow-sm">
              <span aria-hidden="true">✦</span>
              {badgeLabel || eyebrow}
            </div>
          )}

          <h1 className="font-headline max-w-3xl text-5xl font-extrabold leading-[0.96] tracking-tight text-[var(--fe-text-primary)] sm:text-6xl lg:text-7xl xl:text-[5rem]">
            {headline}
          </h1>
          {subheading && (
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--fe-text-secondary)] sm:text-xl">
              {subheading}
            </p>
          )}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {primaryCtaLabel && primaryCtaLink && (
              <Link
                href={primaryCtaLink}
                className="rounded-2xl bg-gradient-to-br from-[var(--fe-primary)] to-[var(--fe-primary-dark)] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5"
              >
                {primaryCtaLabel}
              </Link>
            )}
            {secondaryCtaLabel && secondaryCtaLink && (
              <Link
                href={secondaryCtaLink}
                className="rounded-2xl bg-amber-200 px-8 py-4 text-base font-bold text-amber-900 shadow-sm transition hover:-translate-y-0.5"
              >
                {secondaryCtaLabel}
              </Link>
            )}
          </div>

          {stats && stats.length > 0 && (
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.id ?? stat.label} className="rounded-3xl bg-white p-5 shadow-sm">
                  <p className={cn('text-3xl font-extrabold', statColorMap[stat.color ?? 'blue'])}>
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--fe-text-primary)]">
                    {stat.label}
                  </p>
                  {stat.description && (
                    <p className="mt-2 text-xs leading-6 text-[var(--fe-text-tertiary)]">
                      {stat.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative mx-auto max-w-2xl lg:ml-auto">
            {(topOverlayCard?.cardLabel || topOverlayCard?.cardText) && (
              <div className="absolute -top-8 right-6 z-20 rounded-3xl bg-white px-5 py-4 shadow-xl">
                {topOverlayCard.cardLabel && (
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--fe-text-tertiary)]">
                    {topOverlayCard.cardLabel}
                  </p>
                )}
                {topOverlayCard.cardText && (
                  <p className="mt-2 text-xl font-extrabold text-[var(--fe-primary)]">
                    {topOverlayCard.cardText}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-12 gap-4 lg:gap-5">
              <div className="col-span-7 overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl">
                {mainMedia?.url ? (
                  <Image
                    src={mainMedia.url}
                    alt={mainMedia.alt || heading}
                    width={1200}
                    height={900}
                    className="h-[430px] w-full rounded-[1.4rem] object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-[430px] items-center justify-center rounded-[1.4rem] bg-[var(--fe-gray-100)] text-sm text-[var(--fe-text-muted)]">
                    Main image placeholder
                  </div>
                )}
              </div>

              <div className="col-span-5 flex flex-col gap-4">
                <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-sm">
                  {firstSideImage?.url ? (
                    <Image
                      src={firstSideImage.url}
                      alt={firstSideImage.alt || ''}
                      width={900}
                      height={600}
                      className="h-[204px] w-full rounded-[1.2rem] object-cover"
                      sizes="(max-width: 1024px) 50vw, 30vw"
                    />
                  ) : (
                    <div className="flex h-[204px] items-center justify-center rounded-[1.2rem] bg-[var(--fe-gray-100)] text-sm text-[var(--fe-text-muted)]">
                      Side image placeholder
                    </div>
                  )}
                </div>

                <div className="rounded-[2rem] bg-[var(--fe-primary)] p-6 text-white shadow-2xl">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">
                      Student journey
                    </p>
                    <span aria-hidden="true">↘</span>
                  </div>
                  <p className="mt-4 text-2xl font-extrabold leading-tight">
                    A calmer, clearer process from first call to arrival.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-indigo-100">
                    {(featureHighlights && featureHighlights.length > 0
                      ? featureHighlights
                      : [
                          { id: '1', title: 'Application strategy' },
                          { id: '2', title: 'Document review' },
                          { id: '3', title: 'Embassy prep' },
                          { id: '4', title: 'Arrival guidance' },
                        ]
                    )
                      .slice(0, 4)
                      .map((feat) => (
                        <div key={feat.id ?? feat.title} className="rounded-2xl bg-white/10 p-4">
                          {feat.title}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {(bottomOverlayCard?.cardLabel || bottomOverlayCard?.itemTitle) && (
              <div className="absolute -bottom-8 left-2 z-20 hidden max-w-xs rounded-[1.75rem] bg-white p-5 shadow-xl sm:block">
                {bottomOverlayCard.cardLabel && (
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--fe-text-tertiary)]">
                    {bottomOverlayCard.cardLabel}
                  </p>
                )}
                <div className="mt-4 flex items-start gap-3">
                  <span className="rounded-full bg-amber-100 p-2 text-[18px] text-amber-700">
                    ✓
                  </span>
                  <div>
                    {bottomOverlayCard.itemTitle && (
                      <p className="font-semibold text-[var(--fe-primary)]">
                        {bottomOverlayCard.itemTitle}
                      </p>
                    )}
                    {bottomOverlayCard.itemDescription && (
                      <p className="text-sm leading-6 text-[var(--fe-text-secondary)]">
                        {bottomOverlayCard.itemDescription}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function renderHeadingWithHighlight(heading: string, highlightedWord?: string | null) {
  if (!highlightedWord || !heading.includes(highlightedWord)) {
    return heading
  }

  const [before, ...rest] = heading.split(highlightedWord)
  const after = rest.join(highlightedWord)

  return (
    <>
      {before}
      <span className="highlight-word italic">{highlightedWord}</span>
      {after}
    </>
  )
}
