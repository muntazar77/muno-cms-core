'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'

/**
 * Full-page custom login that renders via Payload's `beforeLogin` slot.
 * Covers Payload's entire default login UI with z-[9999].
 * Handles auth via direct REST API call and uses window.location.href
 * for the most reliable redirect (bypasses all React router timing issues).
 */
export default function MonoLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        const msg =
          body?.errors?.[0]?.message ||
          body?.message ||
          'Invalid email or password.'
        setError(msg)
        setLoading(false)
        return
      }

      // Auth cookie is set. Full page load to /admin — most reliable redirect.
      window.location.href = '/admin'
    } catch {
      setError('Unable to reach the server. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f0f4ff]">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 30%, rgba(37,99,235,0.08), transparent 50%), radial-gradient(circle at 80% 70%, rgba(99,102,241,0.06), transparent 50%)',
        }}
      />

      {/* Login card */}
      <div className="relative w-full max-w-[420px] mx-4 rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[17px] font-black text-white"
            style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
            }}
          >
            M
          </div>
          <div>
            <p className="text-[15px] font-extrabold leading-tight tracking-tight text-[#0f172a]">
              MonoCMS
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748b]">
              Platform Console
            </p>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-xl font-bold tracking-tight text-[#0f172a] mb-1">
          Sign in to your workspace
        </h1>
        <p className="text-[13px] text-[#64748b] mb-6">
          Enter your credentials to continue.
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="mono-email"
              className="mb-1.5 block text-[13px] font-medium text-[#334155]"
            >
              Email
            </label>
            <input
              id="mono-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="h-11 w-full rounded-xl border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#0f172a] outline-none transition-shadow placeholder:text-[#94a3b8] focus:border-[#3b82f6] focus:ring-[3px] focus:ring-[rgba(59,130,246,0.12)] disabled:opacity-60"
              placeholder="you@company.com"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="mono-password"
              className="mb-1.5 block text-[13px] font-medium text-[#334155]"
            >
              Password
            </label>
            <input
              id="mono-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="h-11 w-full rounded-xl border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#0f172a] outline-none transition-shadow placeholder:text-[#94a3b8] focus:border-[#3b82f6] focus:ring-[3px] focus:ring-[rgba(59,130,246,0.12)] disabled:opacity-60"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-[#2563eb] text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Signing in…
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Footer link */}
        <div className="mt-4 text-center">
          <Link
            href="/admin/forgot"
            className="text-[13px] text-[#64748b] hover:text-[#2563eb] transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  )
}
