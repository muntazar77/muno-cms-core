import type { Page } from '@/payload-types'

type FeaturesBlockData = Extract<NonNullable<Page['blocks']>[number], { blockType: 'features' }>

export function FeaturesBlock({ heading, features, style }: FeaturesBlockData) {
  if (!features?.length) return null

  // --- List variant ---
  if (style === 'list') {
    return (
      <section className="fe-section-light py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {heading && (
            <div className="text-center">
              <p className="fe-eyebrow">FEATURES</p>
              <h2 className="fe-heading-section mt-3 text-center">{heading}</h2>
            </div>
          )}
          <div className={`mx-auto mt-12 max-w-3xl ${!heading ? 'mt-0' : ''}`}>
            {features.map((feature) => (
              <div
                key={feature.id ?? feature.title}
                className="flex items-start gap-6 border-b border-[var(--fe-border-subtle)] py-6 last:border-b-0"
              >
                {feature.icon && (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--fe-radius-md)] bg-[var(--fe-primary-soft)] text-lg text-[var(--fe-primary)]">
                    {feature.icon}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-[var(--fe-text-primary)]">
                    {feature.title}
                  </h3>
                  {feature.description && (
                    <p className="mt-1 text-sm leading-relaxed text-[var(--fe-text-secondary)]">
                      {feature.description}
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

  // --- Minimal variant ---
  if (style === 'minimal') {
    return (
      <section className="fe-bg-gradient-subtle py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {heading && (
            <div className="text-center">
              <p className="fe-eyebrow">FEATURES</p>
              <h2 className="fe-heading-section mt-3 text-center">{heading}</h2>
            </div>
          )}
          <div
            className={`mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 ${!heading ? 'mt-0' : ''}`}
          >
            {features.map((feature) => (
              <div key={feature.id ?? feature.title} className="p-4">
                {feature.icon && (
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--fe-radius-md)] bg-[var(--fe-primary-soft)] text-lg text-[var(--fe-primary)]">
                    {feature.icon}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-[var(--fe-text-primary)]">
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--fe-text-secondary)]">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
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
            <p className="fe-eyebrow">FEATURES</p>
            <h2 className="fe-heading-section mt-3 text-center">{heading}</h2>
          </div>
        )}
        <div
          className={`mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 ${!heading ? 'mt-0' : ''}`}
        >
          {features.map((feature) => (
            <div key={feature.id ?? feature.title} className="fe-card p-8">
              {feature.icon && (
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--fe-radius-md)] bg-[var(--fe-primary-soft)] text-lg text-[var(--fe-primary)]">
                  {feature.icon}
                </div>
              )}
              <h3 className="text-lg font-semibold text-[var(--fe-text-primary)]">
                {feature.title}
              </h3>
              {feature.description && (
                <p className="mt-2 text-sm leading-relaxed text-[var(--fe-text-secondary)]">
                  {feature.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
