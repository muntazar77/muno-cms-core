'use client'

import { useState, type FormEvent } from 'react'
import type { Page, Form } from '@/payload-types'

type FormBlockData = Extract<NonNullable<Page['blocks']>[number], { blockType: 'form' }>

export function FormBlock({ form, heading, description }: FormBlockData) {
  const formData = typeof form === 'object' ? (form as Form) : null

  if (!formData?.fields?.length) return null

  return (
    <section className="fe-section-brand py-[var(--fe-section-py)] sm:py-[var(--fe-section-py-lg)]">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        {heading && (
          <>
            <p className="fe-eyebrow text-center">GET IN TOUCH</p>
            <h2 className="fe-heading-section mt-3 text-center">{heading}</h2>
          </>
        )}
        {description && <p className="fe-subheading mt-4 text-center">{description}</p>}
        <FormInner form={formData} />
      </div>
    </section>
  )
}

function FormInner({ form }: { form: Form }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')

    const data = Object.fromEntries(new FormData(e.currentTarget))

    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: form.id, data }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="fe-card mt-10 p-8 text-center shadow-[var(--fe-shadow-xl)] sm:p-10">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-medium text-[var(--fe-text-primary)]">
          {form.confirmationMessage || 'Thank you! Your submission has been received.'}
        </p>
      </div>
    )
  }

  const inputClasses =
    'block w-full rounded-[var(--fe-radius-md)] border border-[var(--fe-border)] bg-[var(--fe-surface-primary)] px-4 py-2.5 text-[var(--fe-text-primary)] shadow-sm placeholder:text-[var(--fe-text-muted)] focus:border-[var(--fe-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--fe-primary-ghost)] transition-colors'

  return (
    <div className="fe-card mt-10 p-8 shadow-[var(--fe-shadow-xl)] sm:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields?.map((field) => (
          <div key={field.id ?? field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-[var(--fe-text-primary)]"
            >
              {field.label}
              {field.required && <span className="ml-0.5 text-[var(--fe-primary)]">*</span>}
            </label>
            <div className="mt-1.5">
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  required={field.required ?? false}
                  rows={4}
                  className={inputClasses}
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  required={field.required ?? false}
                  className={inputClasses}
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type === 'email' ? 'email' : field.type === 'file' ? 'file' : 'text'}
                  required={field.required ?? false}
                  className={inputClasses}
                />
              )}
            </div>
          </div>
        ))}

        {status === 'error' && (
          <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="fe-btn-primary w-full disabled:opacity-50"
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
