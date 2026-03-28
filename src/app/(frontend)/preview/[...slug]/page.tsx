import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSiteBySiteId } from '@/lib/sites'
import { getPage } from '@/lib/getPage'
import { RenderBlocks } from '@/components/RenderBlocks'
import { Header } from '@/components/frontend/Header'
import { Footer } from '@/components/frontend/Footer'
import type { Media } from '@/payload-types'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PreviewPageProps {
  params: Promise<{ slug: string[] }>
}

function parsePreviewParams(slugSegments: string[]) {
  const siteSlug = slugSegments[0]
  const pageSlug = slugSegments.length > 1 ? slugSegments.slice(1).join('/') : 'home'
  return { siteSlug, pageSlug }
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const { slug } = await params
  const { siteSlug, pageSlug } = parsePreviewParams(slug)
  const site = await getSiteBySiteId(siteSlug, 0)
  if (!site) return { title: 'Preview — Site Not Found' }

  const page = await getPage(pageSlug, siteSlug)
  const siteName = site.siteName || siteSlug

  if (!page) return { title: `Preview — ${siteName}` }

  const ogImage =
    typeof page.meta?.image === 'object' ? (page.meta.image as Media)?.url : undefined

  return {
    title: `Preview — ${page.meta?.title || page.title} | ${siteName}`,
    description: page.meta?.description || undefined,
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params
  const { siteSlug, pageSlug } = parsePreviewParams(slug)
  const site = await getSiteBySiteId(siteSlug, 1)

  if (!site) notFound()

  const page = await getPage(pageSlug, siteSlug)

  if (!page) {
    return (
      <>
        <PreviewBanner siteName={site.siteName || siteSlug} />
        <Header site={site} />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
          <h1 className="fe-heading-display">Page Not Found</h1>
          <p className="fe-subheading mt-4">
            No published page with slug &quot;{pageSlug}&quot; exists for this site.{' '}
            <Link
              href="/admin/collections/pages/create"
              className="font-medium text-[var(--fe-primary)] underline underline-offset-4 hover:text-[var(--fe-primary-dark)]"
            >
              Create one
            </Link>
          </p>
        </div>
        <Footer site={site} />
      </>
    )
  }

  const headerVariant = page.branding?.headerVariant ?? 'default'
  const footerVariant = page.branding?.footerVariant ?? 'default'

  return (
    <>
      <PreviewBanner siteName={site.siteName || siteSlug} />
      <Header variant={headerVariant} site={site} />
      <main>
        <RenderBlocks blocks={page.blocks} siteId={page.siteId ?? undefined} />
      </main>
      <Footer variant={footerVariant} site={site} />
    </>
  )
}

function PreviewBanner({ siteName }: { siteName: string }) {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-3 bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm">
      <span>Preview Mode — {siteName}</span>
      <Link
        href="/admin"
        className="rounded-md bg-white/20 px-3 py-0.5 text-xs font-semibold transition-colors hover:bg-white/30"
      >
        Back to Admin
      </Link>
    </div>
  )
}
