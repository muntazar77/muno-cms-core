import Image from 'next/image'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

interface Feature {
  id?: string | null
  icon?: string | null
  title: string
  description?: string | null
}

interface SplitImage {
  id?: string | null
  image: number | Media
  caption?: string | null
}

interface SplitContentBlockProps {
  eyebrow?: string | null
  heading: string
  description?: string | null
  theme?: 'light' | 'brand' | null
  imagePosition?: 'left' | 'right' | null
  calloutText?: string | null
  showSkewAccent?: boolean | null
  features?: Feature[] | null
  images?: SplitImage[] | null
}

export function SplitContentBlock({
  eyebrow,
  heading,
  description,
  theme = 'light',
  imagePosition = 'right',
  calloutText,
  showSkewAccent,
  features,
  images,
}: SplitContentBlockProps) {
  const isBrand = theme === 'brand'
  const imagesFirst = imagePosition === 'left'

  const contentSide = (
    <div className="lg:col-span-5">
      {eyebrow && <p className={cn('fe-eyebrow', isBrand && 'fe-eyebrow-on-dark')}>{eyebrow}</p>}
      <h2 className={cn('fe-heading-section mt-3', isBrand && 'text-white')}>{heading}</h2>
      {description && (
        <p className={cn('fe-subheading mt-4', isBrand && 'text-white/70')}>{description}</p>
      )}

      {features && features.length > 0 && (
        <div className="mt-10 space-y-6">
          {features.map((feat) => (
            <div key={feat.id ?? feat.title} className="flex items-start gap-4">
              {feat.icon && (
                <span
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--fe-radius-md)] text-lg',
                    isBrand
                      ? 'bg-white/10 text-white'
                      : 'bg-[var(--fe-primary-soft)] text-[var(--fe-primary)]',
                  )}
                >
                  {feat.icon}
                </span>
              )}
              <div>
                <h3
                  className={cn(
                    'text-base font-semibold',
                    isBrand ? 'text-white' : 'text-[var(--fe-text-primary)]',
                  )}
                >
                  {feat.title}
                </h3>
                {feat.description && (
                  <p
                    className={cn(
                      'mt-1 text-sm leading-relaxed',
                      isBrand ? 'text-white/60' : 'text-[var(--fe-text-secondary)]',
                    )}
                  >
                    {feat.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const imageSide = (
    <div className="lg:col-span-7">
      {images && images.length > 0 && (
        <div className={cn('grid gap-4', images.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
          {images.map((item) => {
            const media =
              typeof item.image === 'object' && item.image !== null ? (item.image as Media) : null
            if (!media?.url) return null
            return (
              <div key={item.id ?? media.id} className="relative">
                <div className="aspect-[4/3] overflow-hidden rounded-[var(--fe-radius-xl)] ring-1 ring-[var(--fe-border-subtle)]">
                  <Image
                    src={media.url}
                    alt={media.alt || heading}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 35vw"
                  />
                </div>
                {item.caption && (
                  <p
                    className={cn(
                      'mt-2 text-center text-xs',
                      isBrand ? 'text-white/50' : 'text-[var(--fe-text-tertiary)]',
                    )}
                  >
                    {item.caption}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  if (isBrand) {
    return (
      <section className="relative overflow-hidden bg-[var(--fe-primary)] px-4 py-24 sm:px-6 lg:px-8">
        {(showSkewAccent ?? true) && (
          <div className="absolute right-[-12%] top-0 h-full w-[42%] -skew-x-12 bg-white/10" />
        )}
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">{contentSide}</div>
          <div className="lg:col-span-7">
            {images && images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 lg:gap-5">
                <div className="space-y-4 pt-10">
                  {renderTrustImage(images[0], heading, true)}
                  <div className="rounded-[2rem] bg-amber-200 p-6 text-amber-900 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.2em]">
                      What makes it different
                    </p>
                    <p className="mt-3 text-2xl font-extrabold leading-tight">
                      {calloutText || 'Editorial clarity, practical action, and less noise.'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {renderTrustImage(images[1], heading, false, 'h-52')}
                  {renderTrustImage(images[2], heading, false, 'h-80')}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-white/10 p-8 text-center text-sm text-white/70">
                Add trust-section images to complete this layout.
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 sm:py-28 fe-section-light">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          {imagesFirst ? (
            <>
              {imageSide}
              {contentSide}
            </>
          ) : (
            <>
              {contentSide}
              {imageSide}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function renderTrustImage(
  item: SplitImage | null | undefined,
  heading: string,
  padded: boolean,
  fixedHeightClass?: string,
) {
  const media =
    item && typeof item.image === 'object' && item.image !== null ? (item.image as Media) : null

  return (
    <div className={cn('rounded-[2rem] bg-white/10 shadow-sm', padded ? 'p-3' : 'p-3')}>
      {media?.url ? (
        <Image
          src={media.url}
          alt={media.alt || heading}
          width={1000}
          height={700}
          className={cn(
            'w-full rounded-[1.35rem] object-cover',
            fixedHeightClass || (padded ? 'h-72' : 'h-72'),
          )}
          sizes="(max-width: 1024px) 100vw, 35vw"
        />
      ) : (
        <div
          className={cn(
            'flex w-full items-center justify-center rounded-[1.35rem] bg-white/20 text-sm text-white/70',
            fixedHeightClass || (padded ? 'h-72' : 'h-72'),
          )}
        >
          Image placeholder
        </div>
      )}
    </div>
  )
}
