import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import BuilderView from '@/components/admin/builder/BuilderView'
import type { BuilderField } from '@/components/admin/builder/FieldRenderer'
import type { BuilderBlock } from '@/components/admin/builder/BuilderProvider'

import {
  HeroBlock,
  TextBlock,
  FeaturesBlock,
  GalleryBlock,
  CTABlock,
  FormBlock,
  HeroWithImageBlock,
  ServicesCardsBlock,
  StepsTimelineBlock,
  StatisticsBlock,
  TestimonialsBlock,
  LogoCloudBlock,
  PricingTableBlock,
  FAQBlock,
} from '@/blocks'

const allBlockConfigs = [
  HeroBlock,
  TextBlock,
  FeaturesBlock,
  GalleryBlock,
  CTABlock,
  FormBlock,
  HeroWithImageBlock,
  ServicesCardsBlock,
  StepsTimelineBlock,
  StatisticsBlock,
  TestimonialsBlock,
  LogoCloudBlock,
  PricingTableBlock,
  FAQBlock,
]

/** Convert Payload field definitions to serializable BuilderField objects */
function serializeFields(fields: Record<string, unknown>[]): BuilderField[] {
  return fields
    .filter((f: any) => f.name && f.type)
    .map((f: any) => {
      const serialized: BuilderField = {
        name: f.name,
        type: f.type,
      }

      if (typeof f.label === 'string') serialized.label = f.label
      if (f.required) serialized.required = true
      if (f.defaultValue !== undefined && typeof f.defaultValue !== 'function')
        serialized.defaultValue = f.defaultValue
      if (f.relationTo) serialized.relationTo = f.relationTo
      if (f.admin?.description) serialized.description = f.admin.description

      if (f.options) {
        serialized.options = f.options.map((o: unknown) =>
          typeof o === 'string'
            ? { label: o, value: o }
            : { label: (o as any).label, value: (o as any).value },
        )
      }

      if (f.fields) {
        serialized.fields = serializeFields(f.fields)
      }

      return serialized
    })
}

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })

  // Check authentication
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) {
    redirect('/admin/login')
  }

  // Fetch page data
  let page: any
  try {
    page = await payload.findByID({
      collection: 'pages',
      id: Number(id),
      depth: 0,
    })
  } catch {
    notFound()
  }

  if (!page) notFound()

  // Build block fields map from Payload block configs
  const blockFieldsMap: Record<string, BuilderField[]> = {}
  for (const blockConfig of allBlockConfigs) {
    blockFieldsMap[blockConfig.slug] = serializeFields(
      blockConfig.fields as unknown as Record<string, unknown>[],
    )
  }

  // Normalize blocks for the builder state
  const initialBlocks: BuilderBlock[] = (page.blocks || []).map((block: any) => ({
    ...block,
    id: block.id || Math.random().toString(36).substring(2, 10),
  }))

  return (
    <BuilderView
      pageId={page.id}
      pageTitle={page.title}
      initialBlocks={initialBlocks}
      blockFieldsMap={blockFieldsMap}
    />
  )
}
