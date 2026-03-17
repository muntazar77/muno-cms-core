import Image from 'next/image'
import Link from 'next/link'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

interface HeroWithImageBlockProps {
  eyebrow?: string | null
  heading: string
  subheading?: string | null
  image?: (number | null) | Media
  primaryCtaLabel?: string | null
  primaryCtaLink?: string | null
  secondaryCtaLabel?: string | null
  alignment?: 'left' | 'center' | 'right' | null
}

export function HeroWithImageBlock({
  eyebrow,
  heading,
  subheading,
  image,
  primaryCtaLabel,
  primaryCtaLink,
  secondaryCtaLabel,
  alignment = 'left',
}: HeroWithImageBlockProps) {
  const media = typeof image === 'object' && image !== null ? (image as Media) : null
  const isCenter = alignment === 'center'

  return (
    <section className="fe-bg-gradient-hero relative overflow-hidden py-24 sm:py-32">
      {/* Decorative glow blobs at corners */}
      <div className="fe-glow-blob -left-64 -top-64 opacity-30" />
      <div className="fe-glow-blob -bottom-64 -right-64 opacity-20" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={cn(
            'grid grid-cols-1 items-center gap-16 lg:grid-cols-2',
            alignment === 'right' && 'lg:grid-flow-col-dense',
          )}
        >
          <div className={cn(isCenter && 'text-center lg:col-span-2')}>
            {eyebrow && <span className="fe-badge mb-4 inline-flex rounded-full">{eyebrow}</span>}
            <h1 className="fe-heading-display mt-2">{heading}</h1>
            {subheading && (
              <p className={cn('fe-subheading mt-6', isCenter ? 'mx-auto max-w-lg' : 'max-w-lg')}>
                {subheading}
              </p>
            )}
            <div className={cn('mt-10 flex items-center gap-4', isCenter && 'justify-center')}>
              {primaryCtaLabel && primaryCtaLink && (
                <Link href={primaryCtaLink} className="fe-btn-primary">
                  {primaryCtaLabel}
                </Link>
              )}
              {secondaryCtaLabel && (
                <span className="fe-btn-secondary cursor-pointer">{secondaryCtaLabel} &rarr;</span>
              )}
            </div>
          </div>

          {media?.url && !isCenter && (
            <div className="relative">
              {/* Glow blob behind image */}
              <div className="fe-glow-blob left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--fe-radius-2xl)] shadow-2xl ring-1 ring-[var(--fe-border-subtle)]">
                <Image
                  src={media.url}
                  alt={media.alt || heading}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
