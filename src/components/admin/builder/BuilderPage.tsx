import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import BuilderView from './BuilderView'
import type { BuilderField } from './FieldRenderer'
import type { BuilderBlock } from './BuilderProvider'

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

export default async function BuilderPage({ params }: { params: { segments: string[] } }) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')

  // Route: /admin/pages/:id/builder → segments = ['pages', id, 'builder']
  const id = params?.segments?.[1]
  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[var(--cms-text-muted)]">Page ID is required.</p>
      </div>
    )
  }

  let page: any
  try {
    page = await payload.findByID({
      collection: 'pages',
      id: Number(id),
      depth: 0,
    })
  } catch {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[var(--cms-text-muted)]">Page not found.</p>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[var(--cms-text-muted)]">Page not found.</p>
      </div>
    )
  }

  const blockFieldsMap: Record<string, BuilderField[]> = {}
  for (const blockConfig of allBlockConfigs) {
    blockFieldsMap[blockConfig.slug] = serializeFields(
      blockConfig.fields as unknown as Record<string, unknown>[],
    )
  }

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
