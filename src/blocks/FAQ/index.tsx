'use client'

import { useState } from 'react'

interface FAQBlockProps {
  heading?: string | null
  items?:
    | {
        id?: string | null
        question: string
        answer: string
      }[]
    | null
}

export function FAQBlock({ heading, items }: FAQBlockProps) {
  if (!items?.length) return null

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {heading && (
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {heading}
          </h2>
        )}
        <div className="mt-12 divide-y divide-gray-200">
          {items.map((item, index) => (
            <AccordionItem key={item.id ?? index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="py-5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-base font-semibold text-gray-900">{question}</span>
        <span className="ml-4 shrink-0 text-gray-400">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="mt-3 text-sm leading-6 text-gray-600">{answer}</p>}
    </div>
  )
}
