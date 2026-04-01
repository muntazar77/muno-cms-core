import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderBlocks } from '@/components/RenderBlocks'
import { MarketingHomeDemoContent } from '@/components/marketing/MarketingHomeDemoContent'
import type { MarketingPage, PlatformSetting, Media } from '@/payload-types'

export const revalidate = 60

async function getHomePage(): Promise<MarketingPage | null> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'marketing-pages',
      where: {
        and: [{ isHome: { equals: true } }, { status: { equals: 'published' } }],
      },
      limit: 1,
      depth: 2,
    })
    return (result.docs[0] as MarketingPage) ?? null
  } catch {
    return null
  }
}

async function getPlatformSettings(): Promise<PlatformSetting | null> {
  try {
    const payload = await getPayload({ config })
    return (await payload.findGlobal({ slug: 'platform-settings', depth: 1 })) as PlatformSetting
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getHomePage(), getPlatformSettings()])

  const title =
    page?.meta?.title ?? settings?.defaultSeoTitle ?? 'MonoCMS — Multi-Site Website Builder'
  const description =
    page?.meta?.description ??
    settings?.defaultSeoDescription ??
    'Build and manage multiple client websites from one powerful dashboard.'

  const ogImageUrl =
    typeof page?.meta?.ogImage === 'object'
      ? (page.meta.ogImage as Media)?.url
      : typeof settings?.ogImage === 'object'
        ? (settings.ogImage as Media)?.url
        : undefined

  return {
    title,
    description,
    openGraph: ogImageUrl ? { images: [{ url: ogImageUrl }] } : undefined,
  }
}

export default async function MarketingHomePage() {
  const page = await getHomePage()

  if (!page) {
    return <MarketingHomeDemoContent />
  }

  return <RenderBlocks blocks={page.blocks} />
}
