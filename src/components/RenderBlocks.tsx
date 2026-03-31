import type { Page } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { HeroBlock } from '@/blocks/Hero'
import { TextBlock } from '@/blocks/Text'
import { FeaturesBlock } from '@/blocks/Features'
import { GalleryBlock } from '@/blocks/Gallery'
import { CTABlock } from '@/blocks/CTA'
import { FormBlock } from '@/blocks/Form'
import { HeroWithImageBlock } from '@/blocks/HeroWithImage'
import { ServicesCardsBlock } from '@/blocks/ServicesCards'
import { StepsTimelineBlock } from '@/blocks/StepsTimeline'
import { StatisticsBlock } from '@/blocks/Statistics'
import { TestimonialsBlock } from '@/blocks/Testimonials'
import { LogoCloudBlock } from '@/blocks/LogoCloud'
import { PricingTableBlock } from '@/blocks/PricingTable'
import { FAQBlock } from '@/blocks/FAQ'
import { HeroEditorialBlock } from '@/blocks/HeroEditorial'
import { ServicesBentoBlock } from '@/blocks/ServicesBento'
import { SplitContentBlock } from '@/blocks/SplitContent'

type Block = NonNullable<Page['blocks']>[number]

/* eslint-disable @typescript-eslint/no-explicit-any */
const blockComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroBlock,
  text: TextBlock,
  features: FeaturesBlock,
  gallery: GalleryBlock,
  cta: CTABlock,
  form: FormBlock,
  heroWithImage: HeroWithImageBlock,
  servicesCards: ServicesCardsBlock,
  stepsTimeline: StepsTimelineBlock,
  statistics: StatisticsBlock,
  testimonials: TestimonialsBlock,
  logoCloud: LogoCloudBlock,
  pricingTable: PricingTableBlock,
  faq: FAQBlock,
  heroEditorial: HeroEditorialBlock,
  servicesBento: ServicesBentoBlock,
  splitContent: SplitContentBlock,
}

async function fetchDynamicServices(siteId: string | undefined, limit: number) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'services',
    where: {
      and: [
        ...(siteId ? [{ siteId: { equals: siteId } }] : []),
        { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] },
      ],
    },
    limit,
    depth: 0,
    sort: 'title',
  })
  return result.docs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
    description: typeof doc.description === 'string' ? doc.description : null,
    icon: null,
    link: doc.slug ? `/services/${doc.slug}` : null,
  }))
}

export async function RenderBlocks({
  blocks,
  siteId,
}: {
  blocks: Page['blocks']
  siteId?: string
}) {
  if (!blocks?.length) return null

  // Pre-fetch dynamic services for any servicesCards blocks in dynamic mode
  const resolvedExtras: Record<number, Record<string, unknown>> = {}
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (block.blockType === 'servicesCards' && 'mode' in block && block.mode === 'dynamic') {
      const limit = 'limit' in block && typeof block.limit === 'number' ? block.limit : 12
      resolvedExtras[i] = {
        resolvedServices: await fetchDynamicServices(siteId, limit),
      }
    }
  }

  return (
    <>
      {blocks.map((block, index) => {
        const Component = blockComponents[block.blockType]
        if (!Component) return null
        const extra = resolvedExtras[index] ?? {}
        return <Component key={block.id ?? index} {...block} {...extra} siteId={siteId} />
      })}
    </>
  )
}
