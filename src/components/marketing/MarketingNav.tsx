'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Media, PlatformSetting } from '@/payload-types'

interface MarketingNavProps {
  settings: PlatformSetting | null
}

type NavLink = {
  label: string
  url: string
  openInNewTab?: boolean | null
  id?: string | null
}

export function MarketingNav({ settings }: MarketingNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const productName = settings?.productName || 'MonoCMS'
  const logo =
    typeof settings?.logo === 'object' && settings.logo !== null ? (settings.logo as Media) : null
  const navLinks = (settings?.navLinks as NavLink[] | null) ?? []
  const cta = settings?.navCta
  const ctaLabel = cta?.label || 'Get Started'
  const ctaUrl = cta?.url || '/admin'
  const ctaVariant = cta?.variant || 'primary'

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-(--fe-border) bg-(--fe-surface-primary)/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-(--fe-text-primary) hover:opacity-90 transition-opacity"
        >
          {logo?.url ? (
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-(--fe-surface-secondary) shrink-0">
              <Image
                src={logo.url}
                alt={productName}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </span>
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--fe-primary) text-white text-sm font-black shrink-0">
              M
            </span>
          )}
          <span>{productName}</span>
        </Link>

        {/* Desktop nav links */}
        {navLinks.length > 0 && (
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.id ?? link.url}>
                <Link
                  href={link.url}
                  target={link.openInNewTab ? '_blank' : undefined}
                  rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="px-3 py-2 text-sm font-medium text-(--fe-text-secondary) hover:text-(--fe-text-primary) transition-colors rounded-md hover:bg-(--fe-surface-secondary)"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href={ctaUrl}
            className={cn(
              'hidden sm:inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200',
              ctaVariant === 'primary'
                ? 'bg-(--fe-primary) text-white hover:bg-(--fe-primary-dark) shadow-sm hover:shadow-md'
                : ctaVariant === 'outline'
                  ? 'border border-(--fe-border) text-(--fe-text-primary) hover:bg-(--fe-surface-secondary)'
                  : 'text-(--fe-text-primary) hover:bg-(--fe-surface-secondary)',
            )}
          >
            {ctaLabel}
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg text-(--fe-text-secondary) hover:text-(--fe-text-primary) hover:bg-(--fe-surface-secondary) transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-(--fe-border) bg-(--fe-surface-primary) px-4 pb-4 shadow-lg">
          <ul className="mt-2 flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.id ?? link.url}>
                <Link
                  href={link.url}
                  target={link.openInNewTab ? '_blank' : undefined}
                  rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-(--fe-text-secondary) hover:text-(--fe-text-primary) hover:bg-(--fe-surface-secondary) rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-(--fe-border)">
            <Link
              href={ctaUrl}
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold bg-(--fe-primary) text-white hover:bg-(--fe-primary-dark) transition-colors"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
