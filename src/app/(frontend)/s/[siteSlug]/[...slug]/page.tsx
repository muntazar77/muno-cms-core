import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Media } from '@/payload-types'
import { Header } from '@/components/frontend/Header'
import { Footer } from '@/components/frontend/Footer'
import { RenderBlocks } from '@/components/RenderBlocks'
import { getPage } from '@/lib/getPage'
import { resolveSiteBySiteSlug } from '@/lib/sites'

export const revalidate = 60

interface SiteSlugPageProps {
  params: Promise<{ siteSlug: string; slug: string[] }>
}

function normalizePageSlug(slugSegments: string[]): string {
  return slugSegments.join('/').replace(/^\/+/, '') || 'home'
}

export async function generateMetadata({ params }: SiteSlugPageProps): Promise<Metadata> {
  const { siteSlug, slug } = await params
  const site = await resolveSiteBySiteSlug(siteSlug, 0)
  if (!site?.siteId) return { title: 'Site Not Found' }

  const pageSlug = normalizePageSlug(slug)
  const page = await getPage(pageSlug, site.siteId)
  if (!page) return {}

  const ogImage = typeof page.meta?.image === 'object' ? (page.meta.image as Media)?.url : undefined

  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description || undefined,
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  }
}

export default async function SiteSlugPage({ params }: SiteSlugPageProps) {
  const { siteSlug, slug } = await params
  const site = await resolveSiteBySiteSlug(siteSlug, 1)
  if (!site?.siteId) notFound()

  const pageSlug = normalizePageSlug(slug)
  const page = await getPage(pageSlug, site.siteId)
  if (!page) notFound()

  const headerVariant = page.branding?.headerVariant ?? 'default'
  const footerVariant = page.branding?.footerVariant ?? 'default'

  return (
    <>
      <Header variant={headerVariant} site={site} />
      <main>
        <RenderBlocks blocks={page.blocks} siteId={page.siteId ?? site.siteId} />
      </main>
      <Footer variant={footerVariant} site={site} />
    </>
  )
}
