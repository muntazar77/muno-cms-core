import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderBlocks } from '@/components/RenderBlocks'
import type { MarketingPage, Media } from '@/payload-types'

export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return []
}

async function getMarketingPage(slug: string): Promise<MarketingPage | null> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'marketing-pages',
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
      },
      limit: 1,
      depth: 2,
    })
    return (result.docs[0] as MarketingPage) ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getMarketingPage(slug)
  if (!page) return {}

  const ogImageUrl =
    typeof page.meta?.ogImage === 'object' ? (page.meta.ogImage as Media)?.url : undefined

  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description || undefined,
    openGraph: ogImageUrl ? { images: [{ url: ogImageUrl }] } : undefined,
  }
}

export default async function MarketingSlugPage({ params }: PageProps) {
  const { slug } = await params
  const page = await getMarketingPage(slug)

  if (!page) notFound()

  return <RenderBlocks blocks={page.blocks} />
}
