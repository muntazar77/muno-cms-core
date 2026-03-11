import type { Metadata } from 'next'
import { getPage } from '@/lib/getPage'
import { RenderBlocks } from '@/components/RenderBlocks'
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Welcome to Muno CMS
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Create a page with slug &quot;home&quot; in the{' '}
          <Link
            href="/admin/collections/pages/create"
            className="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-700"
          >
            admin panel
          </Link>{' '}
          to get started.
        </p>
      </div>
    )
  }

  return (
    <article>
      <RenderBlocks blocks={page.blocks} />
    </article>
  )
}
