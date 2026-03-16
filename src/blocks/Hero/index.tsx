import Image from 'next/image'
import Link from 'next/link'
import type { Page, Media } from '@/payload-types'

type HeroBlockData = Extract<NonNullable<Page['blocks']>[number], { blockType: 'hero' }>

export function HeroBlock({ heading, subheading, image, ctaLabel, ctaLink }: HeroBlockData) {
  const media = typeof image === 'object' && image !== null ? (image as Media) : null

  return (
    <section className="relative overflow-hidden bg-amber-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-16 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {heading}
            </h1>
            {subheading && <p className="mt-6 text-lg leading-8 text-gray-600">{subheading}</p>}
            {ctaLabel && ctaLink && (
              <div className="mt-10">
                <Link
                  href={ctaLink}
                  className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                >
                  {ctaLabel}
                </Link>
              </div>
            )}
          </div>
          {media?.url && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={media.url}
                alt={media.alt || heading}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
