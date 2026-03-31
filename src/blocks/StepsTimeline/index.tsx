import { cn } from '@/lib/utils'

interface StepItem {
  id?: string | null
  stepLabel?: string | null
  title: string
  description?: string | null
  icon?: string | null
  numberOverride?: string | null
  isHighlighted?: boolean | null
}

interface StepsTimelineBlockProps {
  eyebrow?: string | null
  heading?: string | null
  description?: string | null
  subheading?: string | null
  style?: string | null
  steps?: StepItem[] | null
}

export function StepsTimelineBlock({
  eyebrow,
  heading,
  description,
  subheading,
  steps,
  style,
}: StepsTimelineBlockProps) {
  if (!steps?.length) return null

  const intro = description || subheading
  const variant = style || 'default'

  if (variant === 'alt' || variant === 'timeline') {
    return (
      <section className="fe-section-light py-[var(--fe-section-py)] sm:py-[var(--fe-section-py-lg)]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          {heading && (
            <>
              <p className="fe-eyebrow text-center">{eyebrow || 'HOW IT WORKS'}</p>
              <h2 className="fe-heading-section mt-3 text-center">{heading}</h2>
            </>
          )}
          {intro && <p className="fe-subheading mx-auto mt-4 max-w-2xl text-center">{intro}</p>}

          <div className="mt-16 space-y-0">
            {steps.map((step, index) => (
              <div key={step.id ?? index} className="relative flex gap-6 pb-12 last:pb-0">
                {index < steps.length - 1 && (
                  <div className="absolute left-5 top-12 h-full w-px bg-gradient-to-b from-[var(--fe-primary)] to-[var(--fe-primary-light)]" />
                )}
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-lg ring-4',
                    step.isHighlighted
                      ? 'bg-amber-300 text-amber-900 ring-amber-100'
                      : 'bg-[var(--fe-primary)] text-white ring-[var(--fe-primary-soft)]',
                  )}
                >
                  {step.icon || step.numberOverride || String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 rounded-[var(--fe-radius-xl)] border border-[var(--fe-border-subtle)] bg-white p-6 shadow-sm">
                  {step.stepLabel && (
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--fe-text-tertiary)]">
                      {step.stepLabel}
                    </p>
                  )}
                  <h3 className="mt-3 text-xl font-extrabold text-[var(--fe-text-primary)]">
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="mt-2 text-sm leading-7 text-[var(--fe-text-secondary)]">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'cards') {
    return (
      <section className="fe-section-light py-[var(--fe-section-py)] sm:py-[var(--fe-section-py-lg)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {heading && (
            <>
              <p className="fe-eyebrow text-center">{eyebrow || 'HOW IT WORKS'}</p>
              <h2 className="fe-heading-section mt-3 text-center">{heading}</h2>
            </>
          )}
          {intro && <p className="fe-subheading mx-auto mt-4 max-w-xl text-center">{intro}</p>}

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.id ?? index} className="fe-card p-6 text-center">
                <div className="mx-auto mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fe-primary)] text-sm font-bold text-white">
                  {step.icon || step.numberOverride || String(index + 1)}
                </div>
                {step.stepLabel && (
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--fe-text-tertiary)]">
                    {step.stepLabel}
                  </p>
                )}
                <h3 className="mt-3 text-lg font-semibold text-[var(--fe-text-primary)]">{step.title}</h3>
                {step.description && (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--fe-text-secondary)]">
                    {step.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="fe-section-light py-[var(--fe-section-py)] sm:py-[var(--fe-section-py-lg)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.24em] text-amber-700">
            {eyebrow || 'How it works'}
          </p>
          {heading && (
            <h2 className="text-4xl font-extrabold tracking-tight text-[var(--fe-text-primary)] sm:text-5xl">
              {heading}
            </h2>
          )}
          {intro && <p className="mt-5 text-base leading-8 text-[var(--fe-text-secondary)]">{intro}</p>}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const isHighlighted = step.isHighlighted || index === steps.length - 1

            return (
              <article
                key={step.id ?? index}
                className={cn(
                  'rounded-[2rem] p-7 shadow-sm',
                  isHighlighted
                    ? 'bg-gradient-to-br from-amber-300 to-amber-200 text-amber-900'
                    : 'bg-[var(--fe-surface-secondary)] text-[var(--fe-text-primary)]',
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-extrabold shadow-sm',
                      isHighlighted ? 'bg-white/70 text-amber-900' : 'bg-white text-[var(--fe-primary)]',
                    )}
                  >
                    {step.icon || step.numberOverride || String(index + 1).padStart(2, '0')}
                  </div>
                  {step.stepLabel && (
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-current/70">
                      {step.stepLabel}
                    </p>
                  )}
                </div>
                <h3 className="mt-6 text-2xl font-extrabold tracking-tight">{step.title}</h3>
                {step.description && (
                  <p
                    className={cn(
                      'mt-3 text-sm leading-7',
                      isHighlighted ? 'text-amber-950/80' : 'text-[var(--fe-text-secondary)]',
                    )}
                  >
                    {step.description}
                  </p>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
