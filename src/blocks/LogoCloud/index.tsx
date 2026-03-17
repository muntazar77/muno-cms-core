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
    <section className="fe-section-light py-[var(--fe-section-py-sm)]">
      <hr className="fe-divider" />
      <div className="mx-auto max-w-7xl px-6 py-[var(--fe-section-py-sm)] lg:px-8">
        {heading && <p className="fe-eyebrow text-center text-[var(--fe-text-muted)]">{heading}</p>}
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-x-16 gap-y-8"
          style={{
            maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage:
              'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
          }}
        >
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
                className="max-h-12 w-auto object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              />
            )
          })}
        </div>
      </div>
      <hr className="fe-divider" />
    </section>
  )
}
