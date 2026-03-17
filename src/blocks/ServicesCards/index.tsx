import Link from 'next/link'

interface ServicesCardsBlockProps {
  heading?: string | null
  subheading?: string | null
  services?:
    | {
        id?: string | null
        title: string
        description?: string | null
        icon?: string | null
        link?: string | null
      }[]
    | null
}

export function ServicesCardsBlock({ heading, subheading, services }: ServicesCardsBlockProps) {
  if (!services?.length) return null

  return (
    <section className="fe-section-muted py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {heading && (
          <div className="text-center">
            <p className="fe-eyebrow">SERVICES</p>
            <h2 className="fe-heading-section mt-3 text-center">{heading}</h2>
          </div>
        )}
        {subheading && (
          <p className="fe-subheading mx-auto mt-4 max-w-2xl text-center">{subheading}</p>
        )}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id ?? service.title}
              className="fe-card group border-t-2 border-t-transparent p-8 transition-all hover:border-t-[var(--fe-primary)]"
            >
              {service.icon && (
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[var(--fe-radius-md)] bg-[var(--fe-primary-soft)] text-2xl text-[var(--fe-primary)]">
                  {service.icon}
                </div>
              )}
              <h3 className="text-lg font-semibold text-[var(--fe-text-primary)]">
                {service.title}
              </h3>
              {service.description && (
                <p className="mt-2 text-sm leading-relaxed text-[var(--fe-text-secondary)]">
                  {service.description}
                </p>
              )}
              {service.link && (
                <Link
                  href={service.link}
                  className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--fe-primary)]"
                >
                  Learn more
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
