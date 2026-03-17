import Image from 'next/image'
import { Star } from 'lucide-react'
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
    <section className="fe-bg-gradient-subtle py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {heading && (
          <div className="text-center">
            <p className="fe-eyebrow">TESTIMONIALS</p>
            <h2 className="fe-heading-section mt-3 text-center">{heading}</h2>
          </div>
        )}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => {
            const avatar =
              typeof t.avatar === 'object' && t.avatar !== null ? (t.avatar as Media) : null
            return (
              <div key={t.id ?? t.author} className="fe-card p-8">
                {/* Decorative quote mark */}
                <span
                  className="text-5xl font-serif leading-none text-[var(--fe-primary-light)]"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                {/* 5-star rating */}
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <blockquote className="text-base leading-relaxed text-[var(--fe-text-secondary)]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="mt-6 flex items-center gap-3">
                  {avatar?.url ? (
                    <Image
                      src={avatar.url}
                      alt={t.author}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--fe-primary-soft)]"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--fe-primary-soft)] text-sm font-medium text-[var(--fe-primary)]">
                      {t.author[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[var(--fe-text-primary)]">
                      {t.author}
                    </p>
                    {t.role && <p className="text-xs text-[var(--fe-text-tertiary)]">{t.role}</p>}
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
