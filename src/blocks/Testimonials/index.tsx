import Image from 'next/image'
import type { Media } from '@/payload-types'

interface TestimonialsBlockProps {
  heading?: string | null
  testimonials?:
    | {
        id?: string | null
        quote: string
        author: string
        role?: string | null
        avatar?: (number | null) | Media
      }[]
    | null
}

export function TestimonialsBlock({ heading, testimonials }: TestimonialsBlockProps) {
  if (!testimonials?.length) return null

  return (
    <section className="bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {heading && (
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {heading}
          </h2>
        )}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => {
            const avatar =
              typeof t.avatar === 'object' && t.avatar !== null ? (t.avatar as Media) : null
            return (
              <div
                key={t.id ?? t.author}
                className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100"
              >
                <blockquote className="text-sm leading-6 text-gray-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  {avatar?.url ? (
                    <Image
                      src={avatar.url}
                      alt={t.author}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                      {t.author[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.author}</p>
                    {t.role && <p className="text-xs text-gray-500">{t.role}</p>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
