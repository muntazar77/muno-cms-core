'use client'

import { useState, type FormEvent } from 'react'
import type { Page, Form } from '@/payload-types'

type FormBlockData = Extract<NonNullable<Page['blocks']>[number], { blockType: 'form' }>

export function FormBlock({ form, heading, description }: FormBlockData) {
  const formData = typeof form === 'object' ? (form as Form) : null

  if (!formData?.fields?.length) return null

  return (
    <section className="bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        {heading && (
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {heading}
          </h2>
        )}
        {description && <p className="mt-4 text-center text-lg text-gray-600">{description}</p>}
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
      <div className="mt-10 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
        <p className="text-lg font-medium text-gray-900">
          {form.confirmationMessage || 'Thank you! Your submission has been received.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      {form.fields?.map((field) => (
        <div key={field.id ?? field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-900">
            {field.label}
            {field.required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
          <div className="mt-1.5">
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                required={field.required ?? false}
                rows={4}
                className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                required={field.required ?? false}
                className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
        className="w-full rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
