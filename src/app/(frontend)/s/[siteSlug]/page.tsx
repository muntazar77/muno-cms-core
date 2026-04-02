import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import type { Media } from '@/payload-types'
import { Header } from '@/components/frontend/Header'
import { Footer } from '@/components/frontend/Footer'
import { RenderBlocks } from '@/components/RenderBlocks'
import { getPage } from '@/lib/getPage'
import { resolveSiteBySiteSlug } from '@/lib/sites'

export const revalidate = 60

interface SiteHomePageProps {
  params: Promise<{ siteSlug: string }>
}

export async function generateMetadata({ params }: SiteHomePageProps): Promise<Metadata> {
  const { siteSlug } = await params
  const site = await resolveSiteBySiteSlug(siteSlug, 0)
  if (!site?.siteId) return { title: 'Site Not Found' }

  const page = await getPage('home', site.siteId)
  if (!page) {
    return {
      title: site.defaultMetaTitle || site.siteName || site.siteId,
      description: site.defaultMetaDescription || site.siteDescription || undefined,
    }
  }

  const ogImage = typeof page.meta?.image === 'object' ? (page.meta.image as Media)?.url : undefined

  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description || undefined,
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  }
}

export default async function SiteHomePage({ params }: SiteHomePageProps) {
  const { siteSlug } = await params
  const site = await resolveSiteBySiteSlug(siteSlug, 1)
  if (!site?.siteId) notFound()

  const page = await getPage('home', site.siteId)
  if (!page) {
    return (
      <>
        <Header site={site} />
        <main className="flex min-h-[60vh] items-center justify-center px-6 py-16">
          <div className="mx-auto max-w-2xl rounded-2xl border border-(--fe-border) bg-(--fe-surface-primary) p-8 text-center shadow-sm">
            <h1 className="fe-heading-display">Home page is not published yet</h1>
            <p className="fe-subheading mt-4">
              The site <strong>{site.siteName || site.siteId}</strong> exists, but it has no
              published page with slug <strong>home</strong>.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href={`/admin/collections/pages/create?siteId=${encodeURIComponent(site.siteId)}`}
                className="fe-btn-primary"
              >
                Create Home Page
              </Link>
              <Link href="/admin/collections/pages" className="fe-btn-secondary">
                Open Pages
              </Link>
            </div>
          </div>
        </main>
        <Footer site={site} />
      </>
    )
  }

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
