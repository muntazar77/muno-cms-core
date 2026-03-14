import Image from 'next/image'
import Link from 'next/link'
import type { Media } from '@/payload-types'

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
    <section className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 items-center gap-16 lg:grid-cols-2 ${alignment === 'right' ? 'lg:grid-flow-col-dense' : ''}`}
        >
          <div className={isCenter ? 'text-center lg:col-span-2' : ''}>
            {eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {heading}
            </h1>
            {subheading && <p className="mt-6 text-lg leading-8 text-gray-600">{subheading}</p>}
            <div className={`mt-10 flex items-center gap-4 ${isCenter ? 'justify-center' : ''}`}>
              {primaryCtaLabel && primaryCtaLink && (
                <Link
                  href={primaryCtaLink}
                  className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800"
                >
                  {primaryCtaLabel}
                </Link>
              )}
              {secondaryCtaLabel && (
                <span className="text-sm font-semibold text-gray-900">
                  {secondaryCtaLabel} &rarr;
                </span>
              )}
            </div>
          </div>
          {media?.url && !isCenter && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={media.url}
                alt={media.alt || heading}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
