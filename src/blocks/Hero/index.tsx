import Image from 'next/image'
import Link from 'next/link'
import type { Page, Media } from '@/payload-types'

type HeroBlockData = Extract<NonNullable<Page['blocks']>[number], { blockType: 'hero' }>

export function HeroBlock({ heading, subheading, image, ctaLabel, ctaLink }: HeroBlockData) {
  const media = typeof image === 'object' && image !== null ? (image as Media) : null

  return (
    <section className="fe-bg-gradient-hero fe-bg-grid relative overflow-hidden py-24 sm:py-32 lg:py-40">
      {/* Decorative glow blobs */}
      <div className="fe-glow-blob -top-40 -right-40 opacity-60" aria-hidden="true" />
      <div className="fe-glow-blob -bottom-60 -left-40 opacity-40" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-16 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div>
            <h1 className="fe-heading-display">{heading}</h1>
            {subheading && <p className="fe-subheading mt-6 max-w-lg">{subheading}</p>}
            {ctaLabel && ctaLink && (
              <div className="mt-10">
                <Link href={ctaLink} className="fe-btn-primary">
                  {ctaLabel}
                </Link>
              </div>
            )}
          </div>
          {media?.url && (
            <div className="relative">
              <div
                className="fe-glow-blob left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"
                aria-hidden="true"
              />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--fe-radius-2xl)] shadow-2xl ring-1 ring-[var(--fe-border-subtle)]">
                <Image
                  src={media.url}
                  alt={media.alt || heading}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
