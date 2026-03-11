import Image from 'next/image'
import type { Page, Media } from '@/payload-types'

type GalleryBlockData = Extract<NonNullable<Page['blocks']>[number], { blockType: 'gallery' }>

export function GalleryBlock({ heading, images }: GalleryBlockData) {
  if (!images?.length) return null

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {heading && (
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {heading}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((item) => {
            const media = typeof item.image === 'object' ? (item.image as Media) : null
            if (!media?.url) return null
            return (
              <figure key={item.id ?? media.id} className="group overflow-hidden rounded-2xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={media.url}
                    alt={media.alt || item.caption || ''}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                {item.caption && (
                  <figcaption className="mt-2 px-1 text-sm text-gray-500">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
