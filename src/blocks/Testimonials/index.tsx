import Image from 'next/image'
import { Star } from 'lucide-react'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

interface TestimonialsBlockProps {
  heading?: string | null
  style?: string | null
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

export function TestimonialsBlock({ heading, testimonials, style }: TestimonialsBlockProps) {
  if (!testimonials?.length) return null

  // --- Single variant ---
  if (style === 'single') {
    const t = testimonials[0]
    const avatar = typeof t.avatar === 'object' && t.avatar !== null ? (t.avatar as Media) : null

    return (
      <section className="fe-bg-gradient-brand py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {heading && (
            <div className="text-center">
              <p className="fe-eyebrow">TESTIMONIALS</p>
              <h2 className="fe-heading-section mt-3 text-center">{heading}</h2>
            </div>
          )}
          <div className="mx-auto mt-12 max-w-3xl text-center">
            {/* Large decorative quote marks */}
            <span
              className="block text-7xl font-serif leading-none text-[var(--fe-primary-light)] sm:text-8xl"
              aria-hidden="true"
            >
              &ldquo;
            </span>

            <blockquote className="-mt-6 text-xl leading-relaxed text-[var(--fe-text-primary)] sm:text-2xl">
              {t.quote}
            </blockquote>

            <span
              className="mt-4 block text-7xl font-serif leading-none text-[var(--fe-primary-light)] sm:text-8xl"
              aria-hidden="true"
            >
              &rdquo;
            </span>

            <div className="mt-8 flex flex-col items-center gap-3">
              {avatar?.url ? (
                <Image
                  src={avatar.url}
                  alt={t.author}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-[var(--fe-primary-soft)]"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--fe-primary-soft)] text-lg font-medium text-[var(--fe-primary)]">
                  {t.author[0]}
                </div>
              )}
              <div>
                <p className="text-base font-semibold text-[var(--fe-text-primary)]">{t.author}</p>
                {t.role && <p className="text-sm text-[var(--fe-text-secondary)]">{t.role}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // --- Minimal variant ---
  if (style === 'minimal') {
    return (
      <section className="fe-section-muted py-20 sm:py-28">
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

  // --- Featured Center variant ---
  if (style === 'featured') {
    return (
      <section className="fe-bg-gradient-subtle py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {heading && (
            <div className="text-center">
              <p className="fe-eyebrow">TESTIMONIALS</p>
              <h2 className="fe-heading-section mt-3 text-center">{heading}</h2>
            </div>
          )}
          <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => {
              const avatar =
                typeof t.avatar === 'object' && t.avatar !== null ? (t.avatar as Media) : null
              const isCenterCard = i === 1
              return (
                <div
                  key={t.id ?? t.author}
                  className={cn(
                    'p-8 transition-all',
                    isCenterCard
                      ? 'fe-card-highlighted text-white shadow-2xl lg:-translate-y-5'
                      : 'fe-card',
                  )}
                >
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        className={cn(
                          'h-4 w-4',
                          isCenterCard
                            ? 'fill-amber-300 text-amber-300'
                            : 'fill-amber-400 text-amber-400',
                        )}
                      />
                    ))}
                  </div>
                  <blockquote
                    className={cn(
                      'text-base leading-relaxed',
                      isCenterCard ? 'text-white/80' : 'text-[var(--fe-text-secondary)]',
                    )}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    {avatar?.url ? (
                      <Image
                        src={avatar.url}
                        alt={t.author}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-white/20"
                      />
                    ) : (
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium',
                          isCenterCard
                            ? 'bg-white/10 text-white'
                            : 'bg-[var(--fe-primary-soft)] text-[var(--fe-primary)]',
                        )}
                      >
                        {t.author[0]}
                      </div>
                    )}
                    <div>
                      <p
                        className={cn(
                          'text-sm font-semibold',
                          isCenterCard ? 'text-white' : 'text-[var(--fe-text-primary)]',
                        )}
                      >
                        {t.author}
                      </p>
                      {t.role && (
                        <p
                          className={cn(
                            'text-xs',
                            isCenterCard ? 'text-white/60' : 'text-[var(--fe-text-tertiary)]',
                          )}
                        >
                          {t.role}
                        </p>
                      )}
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

  // --- Cards variant (default) ---
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
