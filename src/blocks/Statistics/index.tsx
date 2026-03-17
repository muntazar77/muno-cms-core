interface StatisticsBlockProps {
  heading?: string | null
  style?: string | null
  stats?:
    | {
        id?: string | null
        value: string
        label: string
      }[]
    | null
}

export function StatisticsBlock({ heading, stats, style }: StatisticsBlockProps) {
  if (!stats?.length) return null

  // --- Light variant ---
  if (style === 'light') {
    return (
      <section className="fe-section-light py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {heading && (
            <div className="text-center">
              <p className="fe-eyebrow">BY THE NUMBERS</p>
              <h2 className="fe-heading-section mt-3">{heading}</h2>
            </div>
          )}
          <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4 lg:divide-x lg:divide-[var(--fe-border-subtle)]">
            {stats.map((stat) => (
              <div key={stat.id ?? stat.label} className="text-center lg:px-8">
                <p className="text-5xl font-extrabold text-[var(--fe-primary)] sm:text-6xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium uppercase tracking-wider text-[var(--fe-text-secondary)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // --- Branded variant ---
  if (style === 'branded') {
    return (
      <section className="fe-section-brand py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {heading && (
            <div className="text-center">
              <p className="fe-eyebrow">BY THE NUMBERS</p>
              <h2 className="fe-heading-section mt-3">{heading}</h2>
            </div>
          )}
          <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4 lg:divide-x lg:divide-[var(--fe-border-subtle)]">
            {stats.map((stat) => (
              <div key={stat.id ?? stat.label} className="text-center lg:px-8">
                <p className="text-5xl font-extrabold text-[var(--fe-text-primary)] sm:text-6xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium uppercase tracking-wider text-[var(--fe-text-secondary)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // --- Dark variant (default) ---
  return (
    <section className="fe-bg-gradient-dark relative overflow-hidden py-20 sm:py-28">
      {/* Decorative glow blob */}
      <div className="fe-glow-blob -right-32 -top-32 opacity-30" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {heading && (
          <div className="text-center">
            <p className="fe-eyebrow-on-dark">BY THE NUMBERS</p>
            <h2 className="fe-heading-section mt-3 text-[var(--fe-text-on-dark)]">{heading}</h2>
          </div>
        )}
        <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
          {stats.map((stat) => (
            <div key={stat.id ?? stat.label} className="text-center lg:px-8">
              <p className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-[var(--fe-text-on-dark-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
