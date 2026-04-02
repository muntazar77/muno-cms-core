import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPage } from '@/lib/getPage'
import { RenderBlocks } from '@/components/RenderBlocks'
import { Header } from '@/components/frontend/Header'
import { Footer } from '@/components/frontend/Footer'
import type { Media } from '@/payload-types'
import { getCurrentSite } from '@/lib/sites'

export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const site = await getCurrentSite(0)
  if (!site?.siteId) return {}

  const page = await getPage(slug, site.siteId)
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
  const site = await getCurrentSite(1)
  if (!site?.siteId) notFound()

  const page = await getPage(slug, site.siteId)

  if (!page) notFound()

  const headerVariant = page.branding?.headerVariant ?? 'default'
  const footerVariant = page.branding?.footerVariant ?? 'default'

  return (
    <>
      <Header variant={headerVariant} site={site} />
      <main>
        <RenderBlocks blocks={page.blocks} siteId={page.siteId ?? undefined} />
      </main>
      <Footer variant={footerVariant} site={site} />
    </>
  )
}
