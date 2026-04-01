import React from 'react'
import Link from 'next/link'
import { Twitter, Linkedin, Github, Instagram, Youtube } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlatformSetting } from '@/payload-types'

interface MarketingFooterProps {
  settings: PlatformSetting | null
}

type FooterColumn = {
  heading: string
  links?: { label: string; url: string; id?: string | null }[] | null
  id?: string | null
}

type LegalLink = { label: string; url: string; id?: string | null }
type SocialLink = { platform: 'twitter' | 'linkedin' | 'github' | 'instagram' | 'youtube'; url: string; id?: string | null }

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  youtube: Youtube,
}

const ANNOUNCEMENT_VARIANTS: Record<string, string> = {
  info: 'bg-(--fe-primary) text-white',
  success: 'bg-emerald-600 text-white',
  warning: 'bg-amber-500 text-white',
}

export function MarketingFooter({ settings }: MarketingFooterProps) {
  const productName = settings?.productName || 'MonoCMS'
  const tagline = settings?.tagline || 'Build & manage multiple websites from one dashboard.'
  const footerColumns = (settings?.footerColumns as FooterColumn[] | null) ?? []
  const legalLinks = (settings?.footerLegalLinks as LegalLink[] | null) ?? []
  const socialLinks = (settings?.socialLinks as SocialLink[] | null) ?? []
  const announcement = settings?.announcementBar

  const copyrightRaw = settings?.copyrightText || '© {year} MonoCMS. All rights reserved.'
  const copyright = copyrightRaw.replace('{year}', String(new Date().getFullYear()))

  return (
    <>
      {/* Announcement bar */}
      {announcement?.enabled && announcement.message && (
        <div
          className={cn(
            'w-full text-center text-sm font-medium py-2.5 px-4',
            ANNOUNCEMENT_VARIANTS[announcement.variant ?? 'info'] ?? ANNOUNCEMENT_VARIANTS.info,
          )}
        >
          <span>{announcement.message}</span>
          {announcement.linkLabel && announcement.linkUrl && (
            <Link
              href={announcement.linkUrl}
              className="ml-2 underline underline-offset-2 font-semibold hover:opacity-80 transition-opacity"
            >
              {announcement.linkLabel} →
            </Link>
          )}
        </div>
      )}

      <footer className="border-t border-(--fe-border) bg-(--fe-surface-primary)">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">

          {/* Top row: brand + columns */}
          <div
            className={cn(
              'grid gap-10',
              footerColumns.length > 0
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(auto-fill,minmax(140px,1fr))]'
                : 'grid-cols-1',
            )}
          >
            {/* Brand column */}
            <div className="max-w-xs">
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-base text-(--fe-text-primary) hover:opacity-90 transition-opacity"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-(--fe-primary) text-white text-xs font-black shrink-0">
                  M
                </span>
                <span>{productName}</span>
              </Link>
              <p className="mt-3 text-sm text-(--fe-text-secondary) leading-relaxed">
                {tagline}
              </p>

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="mt-5 flex items-center gap-2.5">
                  {socialLinks.map((s) => {
                    const Icon = SOCIAL_ICONS[s.platform]
                    if (!Icon) return null
                    return (
                      <Link
                        key={s.id ?? s.url}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.platform}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-(--fe-text-muted) hover:text-(--fe-text-primary) hover:bg-(--fe-surface-secondary) transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Link columns */}
            {footerColumns.map((col) => (
              <div key={col.id ?? col.heading}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-(--fe-text-primary) mb-4">
                  {col.heading}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {(col.links ?? []).map((link) => (
                    <li key={link.id ?? link.url}>
                      <Link
                        href={link.url}
                        className="text-sm text-(--fe-text-secondary) hover:text-(--fe-text-primary) transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom row: copyright + legal links */}
          <div className="mt-10 pt-8 border-t border-(--fe-border) flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-(--fe-text-muted)">{copyright}</p>

            {legalLinks.length > 0 && (
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
                {legalLinks.map((link) => (
                  <li key={link.id ?? link.url}>
                    <Link
                      href={link.url}
                      className="text-xs text-(--fe-text-muted) hover:text-(--fe-text-secondary) transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </footer>
    </>
  )
}
