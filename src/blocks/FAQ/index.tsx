'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

interface FAQBlockProps {
  heading?: string | null
  style?: string | null
  items?:
    | {
        id?: string | null
        question: string
        answer: string
      }[]
    | null
}

export function FAQBlock({ heading, items, style }: FAQBlockProps) {
  if (!items?.length) return null

  // --- Grid variant ---
  if (style === 'grid') {
    return (
      <section className="fe-bg-gradient-brand py-[var(--fe-section-py)] sm:py-[var(--fe-section-py-lg)]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          {heading && (
            <>
              <p className="fe-eyebrow text-center">FAQ</p>
              <h2 className="fe-heading-section mt-3 text-center">{heading}</h2>
            </>
          )}

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {items.map((item, index) => (
              <div
                key={item.id ?? index}
                className="rounded-[var(--fe-radius-lg)] border border-[var(--fe-border-subtle)] bg-[var(--fe-surface-primary)] p-6"
              >
                <h3 className="text-base font-semibold text-[var(--fe-text-primary)]">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--fe-text-secondary)]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // --- Accordion variant (default) ---
  return (
    <section className="fe-bg-gradient-brand py-[var(--fe-section-py)] sm:py-[var(--fe-section-py-lg)]">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {heading && (
          <>
            <p className="fe-eyebrow text-center">FAQ</p>
            <h2 className="fe-heading-section mt-3 text-center">{heading}</h2>
          </>
        )}

        <Accordion.Root type="single" collapsible className="mt-12 space-y-3">
          {items.map((item, index) => (
            <Accordion.Item
              key={item.id ?? index}
              value={item.id ?? `faq-${index}`}
              className="overflow-hidden rounded-[var(--fe-radius-lg)] border border-[var(--fe-border-subtle)] bg-[var(--fe-surface-primary)] transition-colors data-[state=open]:border-[var(--fe-primary-light)]"
            >
              <Accordion.Trigger className="group flex w-full items-center justify-between px-6 py-5 text-left text-base font-semibold text-[var(--fe-text-primary)] transition-colors hover:text-[var(--fe-primary)]">
                {item.question}
                <ChevronDown className="h-5 w-5 shrink-0 text-[var(--fe-text-muted)] transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
              <Accordion.Content className="fe-accordion-content overflow-hidden">
                <div className="px-6 pb-5 text-sm leading-relaxed text-[var(--fe-text-secondary)]">
                  {item.answer}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  )
}
