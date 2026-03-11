import type { Page } from '@/payload-types'
import { HeroBlock } from '@/blocks/Hero'
import { TextBlock } from '@/blocks/Text'
import { FeaturesBlock } from '@/blocks/Features'
import { GalleryBlock } from '@/blocks/Gallery'
import { CTABlock } from '@/blocks/CTA'
import { FormBlock } from '@/blocks/Form'

type Block = NonNullable<Page['blocks']>[number]

const blockComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroBlock,
  text: TextBlock,
  features: FeaturesBlock,
  gallery: GalleryBlock,
  cta: CTABlock,
  form: FormBlock,
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
