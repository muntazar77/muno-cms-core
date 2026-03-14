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
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {heading && (
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600">{subheading}</p>
        )}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const featureList = plan.features?.split('\n').filter(Boolean) || []
            return (
              <div
                key={plan.id ?? plan.name}
                className={`rounded-2xl p-8 ring-1 ${
                  plan.highlighted
                    ? 'bg-gray-900 text-white ring-gray-900 shadow-xl'
                    : 'bg-white ring-gray-200'
                }`}
              >
                <h3
                  className={`text-lg font-semibold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}
                >
                  {plan.name}
                </h3>
                <p className="mt-4">
                  <span
                    className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}
                  >
                    {plan.price}
                  </span>
                </p>
                {plan.description && (
                  <p
                    className={`mt-4 text-sm ${plan.highlighted ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    {plan.description}
                  </p>
                )}
                {featureList.length > 0 && (
                  <ul className="mt-6 space-y-2">
                    {featureList.map((f, i) => (
                      <li
                        key={i}
                        className={`flex items-center gap-2 text-sm ${plan.highlighted ? 'text-gray-300' : 'text-gray-600'}`}
                      >
                        <span className={plan.highlighted ? 'text-green-400' : 'text-green-600'}>
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {plan.ctaLabel && (
                  <a
                    href={plan.ctaLink || '#'}
                    className={`mt-8 block rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                      plan.highlighted
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
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
