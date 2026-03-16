import Image from 'next/image'
import Link from 'next/link'
import type { Page, Media } from '@/payload-types'
import { cn } from '@/lib/utils'

type HeroBlockData = Extract<NonNullable<Page['blocks']>[number], { blockType: 'hero' }>

export function HeroBlock({
  heading,
  subheading,
  image,
  primaryCTA,
  secondaryCTA,
  layout = 'centered',
  backgroundStyle = 'none',
}: HeroBlockData) {
  const media = typeof image === 'object' && image !== null ? (image as Media) : null

  const renderButtons = () => {
    if (!primaryCTA?.label && !secondaryCTA?.label) return null
    return (
      <div
        className={cn(
          'mt-10 flex items-center gap-x-6 gap-y-4 flex-wrap',
          layout === 'centered' ? 'justify-center' : 'justify-start'
        )}
      >
        {primaryCTA?.label && primaryCTA?.url && (
          <Link
            href={primaryCTA.url}
            className="rounded-xl bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {primaryCTA.label}
          </Link>
        )}
        {secondaryCTA?.label && secondaryCTA?.url && (
          <Link
            href={secondaryCTA.url}
            className="text-sm font-semibold leading-6 text-gray-900 transition-colors hover:text-gray-600 dark:text-gray-50 dark:hover:text-gray-300"
          >
            {secondaryCTA.label} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    )
  }

  const backgroundClass = cn('relative overflow-hidden', {
    'bg-white dark:bg-gray-950': backgroundStyle === 'none',
    'bg-gray-50 dark:bg-gray-900': backgroundStyle === 'pattern',
    'bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950':
      backgroundStyle === 'gradient',
  })

  // Pattern overlay if selected
  const renderBackgroundPattern = () => {
    if (backgroundStyle !== 'pattern') return null
    return (
      <svg
        className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 dark:stroke-gray-800 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="pattern-hero"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#pattern-hero)" />
      </svg>
    )
  }

  // Centered Layout
  if (layout === 'centered') {
    return (
      <section className={cn(backgroundClass, 'py-24 sm:py-32')}>
        {renderBackgroundPattern()}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
              {heading}
            </h1>
            {subheading && (
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                {subheading}
              </p>
            )}
            {renderButtons()}
          </div>
          {media?.url && (
            <div className="mx-auto mt-16 max-w-5xl sm:mt-24 relative rounded-2xl p-2 lg:p-4 bg-gray-900/5 ring-1 ring-inset ring-gray-900/10">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-2xl">
                <Image
                  src={media.url}
                  alt={media.alt || heading}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }

  // Split Layout
  return (
    <section className={cn(backgroundClass, 'py-24 sm:py-32')}>
      {renderBackgroundPattern()}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={cn(
            'mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-16 gap-y-16 lg:max-w-none lg:grid-cols-2 lg:mx-0',
            layout === 'split-right' && 'lg:pl-8'
          )}
        >
          <div className={cn(layout === 'split-right' && 'lg:order-last lg:pl-4')}>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
              {heading}
            </h1>
            {subheading && (
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                {subheading}
              </p>
            )}
            {renderButtons()}
          </div>
          {media?.url ? (
            <div
              className={cn(
                'relative aspect-[4/3] w-full max-w-xl lg:max-w-none rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-900/10 dark:ring-white/10 mx-auto'
              )}
            >
              <Image
                src={media.url}
                alt={media.alt || heading}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          ) : (
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-2xl dark:bg-gray-800"></div>
          )}
        </div>
      </div>
    </section>
  )
}
