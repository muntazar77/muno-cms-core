import Image from 'next/image'
import type { Media } from '@/payload-types'

interface LogoCloudBlockProps {
  heading?: string | null
  logos?:
    | {
        id?: string | null
        image: (number | null) | Media
        name?: string | null
      }[]
    | null
}

export function LogoCloudBlock({ heading, logos }: LogoCloudBlockProps) {
  if (!logos?.length) return null

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {heading && (
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-500">
            {heading}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo) => {
            const media =
              typeof logo.image === 'object' && logo.image !== null ? (logo.image as Media) : null
            if (!media?.url) return null
            return (
              <Image
                key={logo.id ?? logo.name}
                src={media.url}
                alt={logo.name || 'Logo'}
                width={158}
                height={48}
                className="max-h-12 w-auto object-contain grayscale transition-all hover:grayscale-0"
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
