'use client'

import { useBuilder } from './BuilderProvider'
import { getBlockMeta } from '@/blocks/registry'
import { ChevronUp, ChevronDown, Trash2, GripVertical, Layers } from 'lucide-react'
import type { ComponentType } from 'react'

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

/* eslint-disable @typescript-eslint/no-explicit-any */
const blockComponents: Record<string, ComponentType<any>> = {
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

const DEVICE_WIDTHS: Record<string, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
}

export function BuilderCanvas() {
  const { state, selectBlock, removeBlock, moveBlock } = useBuilder()
  const { blocks, selectedBlockId, deviceMode } = state

  return (
    <main className="flex-1 bg-gray-100 overflow-auto flex flex-col min-w-0">
      <div className="flex-1 p-6 flex justify-center">
        <div
          className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 self-start"
          style={{
            width: DEVICE_WIDTHS[deviceMode],
            maxWidth: '100%',
            minHeight: '60vh',
          }}
        >
          {blocks.length === 0 ? (
            <EmptyCanvas />
          ) : (
            blocks.map((block, index) => {
              const Component = blockComponents[block.blockType]
              const isSelected = block.id === selectedBlockId
              const meta = getBlockMeta(block.blockType)

              return (
                <div
                  key={block.id}
                  onClick={() => selectBlock(block.id)}
                  className={`relative group cursor-pointer transition-shadow ${
                    isSelected
                      ? 'ring-2 ring-blue-500 ring-inset z-10'
                      : 'hover:ring-2 hover:ring-blue-200 hover:ring-inset'
                  }`}
                >
                  {/* Block toolbar */}
                  <div
                    className={`absolute top-2 right-2 z-20 flex items-center gap-0.5 bg-white rounded-md shadow-md border border-gray-200 transition-opacity ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (index > 0) moveBlock(index, index - 1)
                      }}
                      disabled={index === 0}
                      className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
                      title="Move up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (index < blocks.length - 1) moveBlock(index, index + 1)
                      }}
                      disabled={index === blocks.length - 1}
                      className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
                      title="Move down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <div className="w-px h-4 bg-gray-200" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeBlock(block.id)
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove block"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Block type label */}
                  <div
                    className={`absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium shadow-sm transition-opacity ${
                      isSelected
                        ? 'opacity-100 bg-blue-500 text-white'
                        : 'opacity-0 group-hover:opacity-100 bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    <GripVertical className="h-3 w-3" />
                    {meta?.label || block.blockType}
                  </div>

                  {/* Render block component */}
                  <div className="pointer-events-none">
                    {Component ? (
                      <Component {...block} />
                    ) : (
                      <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
                        <Layers className="h-5 w-5" />
                        <span className="text-sm">{meta?.label || block.blockType}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}

function EmptyCanvas() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <Layers className="h-8 w-8 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-400 mb-1">No blocks yet</h3>
      <p className="text-sm text-gray-400 max-w-xs">
        Click a block from the library on the left to start building your page
      </p>
    </div>
  )
}
