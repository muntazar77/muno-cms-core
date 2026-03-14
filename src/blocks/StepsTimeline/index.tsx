interface StepsTimelineBlockProps {
  heading?: string | null
  subheading?: string | null
  steps?:
    | {
        id?: string | null
        title: string
        description?: string | null
      }[]
    | null
}

export function StepsTimelineBlock({ heading, subheading, steps }: StepsTimelineBlockProps) {
  if (!steps?.length) return null

  return (
    <section className="bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {heading && (
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-gray-600">{subheading}</p>
        )}
        <div className="mt-12 space-y-0">
          {steps.map((step, index) => (
            <div key={step.id ?? index} className="relative flex gap-6 pb-10 last:pb-0">
              {/* Timeline line */}
              {index < steps.length - 1 && (
                <div className="absolute left-5 top-10 h-full w-px bg-gray-200" />
              )}
              {/* Step number */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                {index + 1}
              </div>
              <div className="pt-1.5">
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                {step.description && (
                  <p className="mt-1 text-sm leading-6 text-gray-600">{step.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
