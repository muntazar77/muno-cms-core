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
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id ?? service.title}
              className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
            >
              {service.icon && (
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                  {service.icon}
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
              {service.description && (
                <p className="mt-2 text-sm leading-6 text-gray-600">{service.description}</p>
              )}
              {service.link && (
                <p className="mt-4 text-sm font-medium text-blue-600">Learn more &rarr;</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
