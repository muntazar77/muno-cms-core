import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Page, Media } from '@/payload-types'

type GalleryBlockData = Extract<NonNullable<Page['blocks']>[number], { blockType: 'gallery' }>

export function GalleryBlock({ heading, images }: GalleryBlockData) {
  if (!images?.length) return null

  return (
    <section className="fe-section-muted py-[var(--fe-section-py)] sm:py-[var(--fe-section-py-lg)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {heading && (
          <>
            <p className="fe-eyebrow text-center">GALLERY</p>
            <h2 className="fe-heading-section mb-12 mt-3 text-center">{heading}</h2>
          </>
        )}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((item, index) => {
            const media = typeof item.image === 'object' ? (item.image as Media) : null
            if (!media?.url) return null

            const isFeatured = index === 0 && images.length >= 4

            return (
              <figure
                key={item.id ?? media.id}
                className={cn(
                  'group relative overflow-hidden rounded-[var(--fe-radius-xl)] shadow-[var(--fe-shadow-md)]',
                  isFeatured && 'sm:col-span-2 sm:row-span-2',
                )}
              >
                <div
                  className={cn(
                    'relative overflow-hidden',
                    isFeatured ? 'aspect-square' : 'aspect-[4/3]',
                  )}
                >
                  <Image
                    src={media.url}
                    alt={media.alt || item.caption || ''}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes={
                      isFeatured
                        ? '(max-width: 640px) 100vw, 66vw'
                        : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    }
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {item.caption && (
                      <span className="text-sm font-medium text-white">{item.caption}</span>
                    )}
                  </div>
                </div>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
