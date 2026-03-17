import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import type { Page } from '@/payload-types'

type TextBlockData = Extract<NonNullable<Page['blocks']>[number], { blockType: 'text' }>

export function TextBlock({ content }: TextBlockData) {
  return (
    <section className="fe-section-light py-16 sm:py-20">
      <div className="prose prose-lg prose-gray mx-auto max-w-3xl px-6 lg:px-8">
        <PayloadRichText data={content} />
      </div>
    </section>
  )
}
