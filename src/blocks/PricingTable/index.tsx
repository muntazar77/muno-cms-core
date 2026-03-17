import { cn } from '@/lib/utils'

interface PricingTableBlockProps {
  heading?: string | null
  subheading?: string | null
  plans?:
    | {
        id?: string | null
        name: string
        price: string
        description?: string | null
        features?: string | null
        ctaLabel?: string | null
        ctaLink?: string | null
        highlighted?: boolean | null
      }[]
    | null
}

export function PricingTableBlock({ heading, subheading, plans }: PricingTableBlockProps) {
  if (!plans?.length) return null

  return (
    <section className="fe-section-light py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {heading && (
          <div className="text-center">
            <p className="fe-eyebrow">PRICING</p>
            <h2 className="fe-heading-section mt-3 text-center">{heading}</h2>
          </div>
        )}
        {subheading && (
          <p className="fe-subheading mx-auto mt-4 max-w-2xl text-center">{subheading}</p>
        )}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const featureList = plan.features?.split('\n').filter(Boolean) || []
            const isHighlighted = !!plan.highlighted

            return (
              <div
                key={plan.id ?? plan.name}
                className={cn(
                  'relative p-8',
                  isHighlighted ? 'fe-card-highlighted z-10 lg:scale-105' : 'fe-card',
                )}
              >
                {/* "Most Popular" badge */}
                {isHighlighted && (
                  <span className="fe-badge absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </span>
                )}

                <h3
                  className={cn(
                    'text-lg font-semibold',
                    isHighlighted ? 'text-white' : 'text-[var(--fe-text-primary)]',
                  )}
                >
                  {plan.name}
                </h3>

                <p className="mt-4">
                  <span
                    className={cn(
                      'text-5xl font-extrabold',
                      isHighlighted ? 'text-white' : 'text-[var(--fe-text-primary)]',
                    )}
                  >
                    {plan.price}
                  </span>
                </p>

                {plan.description && (
                  <p
                    className={cn(
                      'mt-4 text-sm',
                      isHighlighted
                        ? 'text-[var(--fe-text-on-dark-secondary)]'
                        : 'text-[var(--fe-text-secondary)]',
                    )}
                  >
                    {plan.description}
                  </p>
                )}

                {/* Divider */}
                <hr className="fe-divider my-6" />

                {featureList.length > 0 && (
                  <ul className="space-y-3">
                    {featureList.map((f, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded-full text-xs',
                            isHighlighted
                              ? 'bg-indigo-500/20 text-indigo-300'
                              : 'bg-[var(--fe-primary-soft)] text-[var(--fe-primary)]',
                          )}
                        >
                          &#10003;
                        </span>
                        <span
                          className={cn(
                            'text-sm',
                            isHighlighted
                              ? 'text-[var(--fe-text-on-dark-secondary)]'
                              : 'text-[var(--fe-text-secondary)]',
                          )}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {plan.ctaLabel && (
                  <a
                    href={plan.ctaLink || '#'}
                    className={cn(
                      isHighlighted
                        ? 'mt-8 block w-full rounded-[var(--fe-radius-md)] bg-white py-3 text-center text-sm font-semibold text-[var(--fe-primary-dark)] shadow-lg transition hover:bg-[var(--fe-gray-50)]'
                        : 'fe-btn-secondary mt-8 w-full',
                    )}
                  >
                    {plan.ctaLabel}
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
