import type { Metadata } from 'next'
import { getPage } from '@/lib/getPage'
import { RenderBlocks } from '@/components/RenderBlocks'
import { Header } from '@/components/frontend/Header'
import { Footer } from '@/components/frontend/Footer'
import type { Media } from '@/payload-types'
import Link from 'next/link'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('home')
  if (!page) return { title: 'Home' }

  const ogImage = typeof page.meta?.image === 'object' ? (page.meta.image as Media)?.url : undefined

  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description || undefined,
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  }
}

export default async function HomePage() {
  const page = await getPage('home')

  if (!page) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <h1 className="fe-heading-display">Welcome to Muno CMS</h1>
          <p className="fe-subheading mt-4">
            Create a page with slug &quot;home&quot; in the{' '}
            <Link
              href="/admin/collections/pages/create"
              className="font-medium text-[var(--fe-primary)] underline underline-offset-4 hover:text-[var(--fe-primary-dark)]"
            >
              admin panel
            </Link>{' '}
            to get started.
          </p>
        </div>
        <Footer />
      </>
    )
  }

  const headerVariant = page.branding?.headerVariant ?? 'default'
  const footerVariant = page.branding?.footerVariant ?? 'default'

  return (
    <>
      <Header variant={headerVariant} />
      <main>
        <RenderBlocks blocks={page.blocks} siteId={page.siteId ?? undefined} />
      </main>
      <Footer variant={footerVariant} />
    </>
  )
}
