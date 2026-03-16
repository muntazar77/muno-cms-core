import type { Page } from '@/payload-types'
import { cn } from '@/lib/utils'
import { CheckCircle2, Zap, Shield, Star, Heart, Users, Settings, Globe, Book } from 'lucide-react'

type FeaturesBlockData = Extract<NonNullable<Page['blocks']>[number], { blockType: 'features' }>

const iconMap: Record<string, React.ReactNode> = {
  check: <CheckCircle2 className="h-6 w-6" />,
  lightning: <Zap className="h-6 w-6" />,
  shield: <Shield className="h-6 w-6" />,
  star: <Star className="h-6 w-6" />,
  heart: <Heart className="h-6 w-6" />,
  users: <Users className="h-6 w-6" />,
  settings: <Settings className="h-6 w-6" />,
  globe: <Globe className="h-6 w-6" />,
  book: <Book className="h-6 w-6" />,
}

export function FeaturesBlock({
  heading,
  subheading,
  columns = '3',
  backgroundStyle = 'light',
  features,
}: FeaturesBlockData) {
  if (!features?.length) return null

  const backgroundClass = cn('py-24 sm:py-32', {
    'bg-white dark:bg-gray-950': backgroundStyle === 'light',
    'bg-gray-50 dark:bg-gray-900': backgroundStyle === 'muted',
    'bg-gray-900 dark:bg-black text-white': backgroundStyle === 'dark',
  })

  const gridClass = cn('mx-auto mt-16 max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none grid grid-cols-1 gap-x-8 gap-y-16', {
    'sm:grid-cols-2': columns === '2',
    'sm:grid-cols-2 lg:grid-cols-3': columns === '3',
    'sm:grid-cols-2 lg:grid-cols-4': columns === '4',
  })

  const isDark = backgroundStyle === 'dark'

  return (
    <section className={backgroundClass}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {heading && (
            <h2
              className={cn(
                'text-3xl font-bold tracking-tight sm:text-4xl',
                isDark ? 'text-white' : 'text-gray-900 dark:text-white'
              )}
            >
              {heading}
            </h2>
          )}
          {subheading && (
            <p
              className={cn(
                'mt-6 text-lg leading-8',
                isDark ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
              )}
            >
              {subheading}
            </p>
          )}
        </div>
        
        <dl className={gridClass}>
          {features.map((feature, i) => {
            const Icon = feature.icon && iconMap[feature.icon] ? iconMap[feature.icon] : iconMap.check
            return (
              <div key={feature.id ?? i} className="flex flex-col relative pl-16">
                <dt
                  className={cn(
                    'text-base font-semibold leading-7',
                    isDark ? 'text-white' : 'text-gray-900 dark:text-white'
                  )}
                >
                  <div
                    className={cn(
                      'absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl shadow-sm',
                      isDark
                        ? 'bg-white/10 ring-1 ring-white/20 text-white'
                        : 'bg-gray-900 text-white dark:bg-primary dark:text-gray-950'
                    )}
                  >
                    {Icon}
                  </div>
                  {feature.title}
                </dt>
                {feature.description && (
                  <dd
                    className={cn(
                      'mt-2 text-base leading-7',
                      isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                    )}
                  >
                    {feature.description}
                  </dd>
                )}
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
