import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPage } from '@/lib/getPage'
import { RenderBlocks } from '@/components/RenderBlocks'
import { Header } from '@/components/frontend/Header'
import { Footer } from '@/components/frontend/Footer'
import type { Media } from '@/payload-types'
import { getCurrentSite } from '@/lib/sites'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite(0)
  if (!site?.siteId) return { title: 'Site Not Found' }

  const page = await getPage('home', site.siteId)
  if (!page) return { title: site.defaultMetaTitle || site.siteName || 'Site Home' }

  const ogImage = typeof page.meta?.image === 'object' ? (page.meta.image as Media)?.url : undefined

  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description || undefined,
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  }
}

export default async function HomePage() {
  const site = await getCurrentSite(1)
  if (!site?.siteId) notFound()

  const page = await getPage('home', site.siteId)
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
