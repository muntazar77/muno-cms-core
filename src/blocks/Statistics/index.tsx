interface StatisticsBlockProps {
  heading?: string | null
  stats?:
    | {
        id?: string | null
        value: string
        label: string
      }[]
    | null
}

export function StatisticsBlock({ heading, stats }: StatisticsBlockProps) {
  if (!stats?.length) return null

  return (
    <section className="bg-gray-900 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {heading && (
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {heading}
          </h2>
        )}
        <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id ?? stat.label} className="text-center">
              <p className="text-4xl font-bold text-white sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
