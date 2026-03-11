import Link from 'next/link'
import type { Page } from '@/payload-types'

type CTABlockData = Extract<NonNullable<Page['blocks']>[number], { blockType: 'cta' }>

export function CTABlock({ heading, description, buttonLabel, buttonLink, style }: CTABlockData) {
  const isWithBg = style === 'withBackground'
  const isCentered = style === 'centered' || isWithBg

  return (
    <section className={`py-20 sm:py-28 ${isWithBg ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <div className={`mx-auto max-w-7xl px-6 lg:px-8 ${isCentered ? 'text-center' : ''}`}>
        <div
          className={
            isCentered
              ? 'mx-auto max-w-2xl'
              : 'flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between'
          }
        >
          <div className={isCentered ? '' : 'max-w-xl'}>
            <h2
              className={`text-3xl font-bold tracking-tight sm:text-4xl ${isWithBg ? 'text-white' : 'text-gray-900'}`}
            >
              {heading}
            </h2>
            {description && (
              <p
                className={`mt-4 text-lg leading-8 ${isWithBg ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {description}
              </p>
            )}
            {isCentered && (
              <div className="mt-8">
                <Link
                  href={buttonLink}
                  className={`inline-block rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition-colors ${
                    isWithBg
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {buttonLabel}
                </Link>
              </div>
            )}
          </div>
          {!isCentered && (
            <Link
              href={buttonLink}
              className="shrink-0 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800"
            >
              {buttonLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
