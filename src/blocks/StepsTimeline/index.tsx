interface StepsTimelineBlockProps {
  heading?: string | null
  subheading?: string | null
  style?: string | null
  steps?:
    | {
        id?: string | null
        title: string
        description?: string | null
      }[]
    | null
}

export function StepsTimelineBlock({ heading, subheading, steps, style }: StepsTimelineBlockProps) {
  if (!steps?.length) return null

  // --- Cards variant ---
  if (style === 'cards') {
    return (
      <section className="fe-section-light py-[var(--fe-section-py)] sm:py-[var(--fe-section-py-lg)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {heading && (
            <>
              <p className="fe-eyebrow text-center">HOW IT WORKS</p>
              <h2 className="fe-heading-section mt-3 text-center">{heading}</h2>
            </>
          )}
          {subheading && (
            <p className="fe-subheading mx-auto mt-4 max-w-xl text-center">{subheading}</p>
          )}

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.id ?? index} className="fe-card p-6 text-center">
                <div className="mx-auto mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fe-primary)] text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-[var(--fe-text-primary)]">
                  {step.title}
                </h3>
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

  // --- Timeline variant (default) ---
  return (
    <section className="fe-section-light py-[var(--fe-section-py)] sm:py-[var(--fe-section-py-lg)]">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {heading && (
          <>
            <p className="fe-eyebrow text-center">HOW IT WORKS</p>
            <h2 className="fe-heading-section mt-3 text-center">{heading}</h2>
          </>
        )}
        {subheading && (
          <p className="fe-subheading mx-auto mt-4 max-w-xl text-center">{subheading}</p>
        )}

        <div className="mt-16 space-y-0">
          {steps.map((step, index) => (
            <div key={step.id ?? index} className="relative flex gap-6 pb-12 last:pb-0">
              {/* Timeline line */}
              {index < steps.length - 1 && (
                <div className="absolute left-5 top-12 h-full w-px bg-gradient-to-b from-[var(--fe-primary)] to-[var(--fe-primary-light)]" />
              )}

              {/* Step number circle */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--fe-primary)] text-sm font-bold text-white shadow-lg shadow-indigo-500/25 ring-4 ring-[var(--fe-primary-soft)]">
                {index + 1}
              </div>

              {/* Step content */}
              <div className="flex-1 rounded-[var(--fe-radius-lg)] bg-[var(--fe-surface-secondary)] p-6">
                <h3 className="text-lg font-semibold text-[var(--fe-text-primary)]">
                  {step.title}
                </h3>
                {step.description && (
                  <p className="mt-1 text-sm leading-relaxed text-[var(--fe-text-secondary)]">
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
