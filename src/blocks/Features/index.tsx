import type { Page } from '@/payload-types'

type FeaturesBlockData = Extract<NonNullable<Page['blocks']>[number], { blockType: 'features' }>

export function FeaturesBlock({ heading, features }: FeaturesBlockData) {
  if (!features?.length) return null

  return (
    <section className="bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {heading && (
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {heading}
          </h2>
        )}
        <div
          className={`mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 ${!heading ? 'mt-0' : ''}`}
        >
          {features.map((feature) => (
            <div
              key={feature.id ?? feature.title}
              className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
            >
              {feature.icon && (
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-lg text-white">
                  {feature.icon}
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              {feature.description && (
                <p className="mt-2 text-sm leading-6 text-gray-600">{feature.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

