import Link from 'next/link'
import type { Page } from '@/payload-types'

type CTABlockData = Extract<NonNullable<Page['blocks']>[number], { blockType: 'cta' }>

export function CTABlock({ heading, description, buttonLabel, buttonLink, style }: CTABlockData) {
  const isWithBg = style === 'withBackground'
  const isCentered = style === 'centered' || isWithBg

  /* ── Style: withBackground ─────────────────────────── */
  if (isWithBg) {
    return (
      <section className="fe-bg-gradient-dark relative overflow-hidden py-20 sm:py-28">
        {/* Decorative glow */}
        <div className="fe-glow-blob -right-32 -top-32 opacity-30" />
        <div className="fe-glow-blob -bottom-48 -left-48 opacity-20" />

        <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="fe-heading-section text-[var(--fe-text-on-dark)]">{heading}</h2>
            {description && (
              <p className="mt-4 text-lg leading-8 text-[var(--fe-text-on-dark-secondary)]">
                {description}
              </p>
            )}
            {buttonLink && buttonLabel && (
              <div className="mt-8">
                <Link
                  href={buttonLink}
                  className="inline-flex items-center justify-center gap-2 rounded-[var(--fe-radius-md)] bg-white px-7 py-3 text-sm font-semibold text-[var(--fe-primary-dark)] shadow-lg transition hover:bg-[var(--fe-gray-50)]"
                >
                  {buttonLabel}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  /* ── Style: centered ───────────────────────────────── */
  if (isCentered) {
    return (
      <section className="fe-section-brand py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-[var(--fe-radius-2xl)] bg-[var(--fe-surface-primary)] p-12 text-center shadow-[var(--fe-shadow-xl)] sm:p-16">
            <h2 className="fe-heading-section">{heading}</h2>
            {description && (
              <p className="mt-4 text-lg leading-8 text-[var(--fe-text-secondary)]">
                {description}
              </p>
            )}
            {buttonLink && buttonLabel && (
              <div className="mt-8">
                <Link href={buttonLink} className="fe-btn-primary">
                  {buttonLabel}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  /* ── Style: default (left-aligned) ─────────────────── */
  return (
    <section className="fe-section-light py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl border-l-4 border-[var(--fe-primary)] pl-6">
            <h2 className="fe-heading-section">{heading}</h2>
            {description && (
              <p className="mt-4 text-lg leading-8 text-[var(--fe-text-secondary)]">
                {description}
              </p>
            )}
          </div>
          {buttonLink && buttonLabel && (
            <Link href={buttonLink} className="fe-btn-primary shrink-0">
              {buttonLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
