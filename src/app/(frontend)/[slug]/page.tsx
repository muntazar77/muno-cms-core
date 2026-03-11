import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPage, getAllPageSlugs } from '@/lib/getPage'

export const revalidate = 60
import { RenderBlocks } from '@/components/RenderBlocks'
import type { Media } from '@/payload-types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()
  return slugs.filter((slug) => slug !== 'home').map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return {}

  const ogImage = typeof page.meta?.image === 'object' ? (page.meta.image as Media)?.url : undefined

  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description || undefined,
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) notFound()

  return (
    <article>
      <RenderBlocks blocks={page.blocks} />
    </article>
  )
}
