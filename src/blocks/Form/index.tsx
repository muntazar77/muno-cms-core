'use client'

import { useState, type FormEvent } from 'react'
import type { Page, Form } from '@/payload-types'

type FormBlockData = Extract<NonNullable<Page['blocks']>[number], { blockType: 'form' }> & {
  style?: 'default' | 'split' | null
  leftPanelHeading?: string | null
  leftPanelDescription?: string | null
  contactItems?: { id?: string | null; icon?: string | null; label: string }[] | null
  submitLabel?: string | null
}

export function FormBlock({
  form,
  heading,
  description,
  style,
  leftPanelHeading,
  leftPanelDescription,
  contactItems,
  submitLabel,
}: FormBlockData) {
  const formData = typeof form === 'object' ? (form as Form) : null

  // --- Split Panel variant ---
  if (style === 'split') {
    return (
      <section className="fe-section-light py-[var(--fe-section-py)] sm:py-[var(--fe-section-py-lg)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left: dark info panel */}
            <div className="fe-bg-gradient-dark rounded-[var(--fe-radius-2xl)] p-10 lg:col-span-5">
              <p className="fe-eyebrow-on-dark">GET IN TOUCH</p>
              {(leftPanelHeading || heading) && (
                <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  {leftPanelHeading || heading}
                </h2>
              )}
              {(leftPanelDescription || description) && (
                <p className="mt-4 text-base leading-relaxed text-white/70">
                  {leftPanelDescription || description}
                </p>
              )}
              {contactItems && contactItems.length > 0 && (
                <div className="mt-8 space-y-4">
                  {contactItems.map((item) => (
                    <div
                      key={item.id ?? item.label}
                      className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3"
                    >
                      {item.icon && <span className="text-base text-white/80">{item.icon}</span>}
                      <span className="text-sm text-white/85">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: form */}
            <div className="lg:col-span-7">
              <FormInner form={formData} submitLabel={submitLabel} />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // --- Default variant ---
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
        <FormInner form={formData} submitLabel={submitLabel} />
      </div>
    </section>
  )
}

function FormInner({ form, submitLabel }: { form: Form | null; submitLabel?: string | null }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  if (!form?.fields?.length) {
    return (
      <div className="fe-card mt-10 p-8 shadow-[var(--fe-shadow-xl)] sm:p-10">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--fe-text-primary)]">
              Full Name
            </label>
            <input
              className="mt-1.5 block w-full rounded-[var(--fe-radius-md)] border border-[var(--fe-border)] bg-[var(--fe-surface-primary)] px-4 py-2.5 text-[var(--fe-text-primary)]"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--fe-text-primary)]">
              Email Address
            </label>
            <input
              className="mt-1.5 block w-full rounded-[var(--fe-radius-md)] border border-[var(--fe-border)] bg-[var(--fe-surface-primary)] px-4 py-2.5 text-[var(--fe-text-primary)]"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--fe-text-primary)]">
              Message
            </label>
            <textarea
              className="mt-1.5 block w-full rounded-[var(--fe-radius-md)] border border-[var(--fe-border)] bg-[var(--fe-surface-primary)] px-4 py-2.5 text-[var(--fe-text-primary)]"
              rows={4}
              placeholder="Tell us about your goal..."
            />
          </div>
          <button type="button" className="fe-btn-primary w-full">
            {submitLabel || 'Send My Inquiry'}
          </button>
        </div>
        <p className="mt-3 text-xs text-[var(--fe-text-tertiary)]">
          Connect a form relation to enable live submissions.
        </p>
      </div>
    )
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form) return
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
          {status === 'submitting' ? 'Submitting...' : submitLabel || 'Send My Inquiry'}
        </button>
      </form>
    </div>
  )
}
