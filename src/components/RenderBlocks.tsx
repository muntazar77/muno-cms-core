import type { Page } from '@/payload-types'
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
}

export function RenderBlocks({ blocks }: { blocks: Page['blocks'] }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => {
        const Component = blockComponents[block.blockType]
        if (!Component) return null
        return <Component key={block.id ?? index} {...block} />
      })}
    </>
  )
}
