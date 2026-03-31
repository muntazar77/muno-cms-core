import Link from 'next/link'
import { getCurrentSite } from '@/lib/sites'

type FooterVariant = 'default' | 'centered' | 'minimal' | 'columns' | 'editorial' | null | undefined

interface NavLink {
  label: string
  url: string
}

interface FooterProps {
  variant?: FooterVariant
  site?: Awaited<ReturnType<typeof getCurrentSite>>
}

export async function Footer({ variant = 'default', site: siteProp }: FooterProps) {
  const site = siteProp ?? (await getCurrentSite(0))

  const siteName = site?.siteName || 'Muno CMS'
  const email = site?.publicEmail
  const phone = site?.phone
  const tagline = site?.footerTagline || 'Building the modern web, one block at a time.'
  const footerNote = site?.footerNote
  const footerLinks: NavLink[] = ((site?.footerLinks ?? []) as NavLink[]).filter(
    (item) => item.label && item.url,
  )
  const socialLinks = (site?.socialLinks ?? []) as Array<{
    platform?: string | null
    label?: string | null
    url?: string | null
  }>
  const year = new Date().getFullYear()
  const v = variant && variant !== 'default' ? variant : 'editorial'

  // Fallback links when none configured
  const fallbackLinks: NavLink[] = [
    { label: 'About', url: '#' },
    { label: 'Services', url: '#' },
    { label: 'Pricing', url: '#' },
    { label: 'Contact', url: '#' },
  ]
  const links = footerLinks.length > 0 ? footerLinks : fallbackLinks

  if (v === 'minimal') {
    return (
      <footer className="border-t border-(--fe-border-subtle) bg-(--fe-surface-primary) py-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <span className="text-xs font-medium text-(--fe-text-primary)">{siteName}</span>
            <p className="text-xs text-(--fe-text-muted)">
              &copy; {year} {siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    )
  }

  if (v === 'centered') {
    return (
      <footer className="fe-bg-gradient-subtle border-t border-[var(--fe-border-subtle)] py-12">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <span className="text-lg font-bold text-(--fe-text-primary)">{siteName}</span>
          {tagline && <p className="mt-2 text-sm text-(--fe-text-secondary)">{tagline}</p>}
          <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {links.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className="text-sm text-[var(--fe-text-secondary)] transition-colors hover:text-[var(--fe-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {socialLinks.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {socialLinks.map((link) => (
                <Link
                  key={`${link.platform}-${link.url}`}
                  href={link.url || '#'}
                  className="rounded-full border border-(--fe-border-subtle) px-3 py-1.5 text-xs text-(--fe-text-secondary) transition-colors hover:text-(--fe-primary)"
                >
                  {link.label || link.platform || 'Social'}
                </Link>
              ))}
            </div>
          )}
          <hr className="fe-divider my-8" />
          <p className="text-xs text-(--fe-text-muted)">
            &copy; {year} {siteName}. All rights reserved.
          </p>
        </div>
      </footer>
    )
  }

  if (v === 'columns') {
    return (
      <footer className="fe-bg-gradient-dark py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <span className="text-base font-bold text-[var(--fe-text-on-dark)]">{siteName}</span>
              {tagline && (
                <p className="mt-3 text-sm leading-relaxed text-[var(--fe-text-on-dark-secondary)]">
                  {tagline}
                </p>
              )}
              {footerNote && (
                <p className="mt-3 text-sm leading-relaxed text-[var(--fe-text-on-dark-muted)]">
                  {footerNote}
                </p>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="mt-3 block text-sm text-[var(--fe-primary-light)] transition-colors hover:text-white"
                >
                  {email}
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="mt-1 block text-sm text-[var(--fe-text-on-dark-secondary)] transition-colors hover:text-white"
                >
                  {phone}
                </a>
              )}
            </div>

            {/* Nav links split across 2 columns */}
            <div className="col-span-2 md:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--fe-text-on-dark-muted)]">
                Navigation
              </h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
                {links.map((link) => (
                  <li key={link.url}>
                    <Link
                      href={link.url}
                      className="text-sm text-[var(--fe-text-on-dark-secondary)] transition-colors hover:text-[var(--fe-text-on-dark)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {socialLinks.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <Link
                      key={`${link.platform}-${link.url}`}
                      href={link.url || '#'}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[var(--fe-text-on-dark-secondary)] transition-colors hover:text-white"
                    >
                      {link.label || link.platform || 'Social'}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <hr className="fe-divider mt-12 opacity-20" />
          <p className="mt-8 text-center text-xs text-[var(--fe-text-on-dark-muted)]">
            &copy; {year} {siteName}. All rights reserved.
          </p>
        </div>
      </footer>
    )
  }

  if (v === 'editorial') {
    const showBanner = site?.footerShowCtaBanner === true
    const bannerHeading = site?.footerCtaHeading
    const bannerDesc = site?.footerCtaDescription
    const bannerBtnLabel = site?.footerCtaButtonLabel
    const bannerBtnUrl = site?.footerCtaButtonUrl
    const supportLinks: NavLink[] = [
      { label: 'Contact', url: '#' },
      { label: 'Privacy Policy', url: '#' },
      { label: 'Terms of Service', url: '#' },
      { label: 'Imprint', url: '#' },
    ]

    return (
      <footer className="footer-glow relative overflow-hidden px-4 pb-10 pt-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {(showBanner || bannerHeading || bannerBtnLabel) && (
            <div className="mb-12 rounded-[2rem] bg-white/6 px-7 py-8 backdrop-blur-sm lg:flex lg:items-center lg:justify-between lg:px-10">
              <div className="max-w-2xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-indigo-100">
                  Ready to start?
                </p>
                <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                  {bannerHeading ||
                    'A premium first impression, with a clearer path for the client.'}
                </h2>
              </div>
              {bannerDesc && (
                <p className="mt-4 max-w-xl text-sm leading-7 text-indigo-100 lg:mt-0">
                  {bannerDesc}
                </p>
              )}
              {(bannerBtnLabel || bannerBtnUrl) && (
                <Link
                  href={bannerBtnUrl || '#'}
                  className="mt-6 rounded-full bg-amber-200 px-7 py-3.5 text-sm font-bold text-amber-900 transition hover:-translate-y-0.5 lg:mt-0"
                >
                  {bannerBtnLabel || 'Schedule an Intro Call'}
                </Link>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-indigo-100">
                  ✦
                </div>
                <div>
                  <p className="text-2xl font-extrabold">{siteName}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-indigo-100/70">
                    Precision meets empathy
                  </p>
                </div>
              </div>
              <p className="mt-6 max-w-sm text-sm leading-7 text-indigo-100/75">{tagline}</p>
              {footerNote && (
                <p className="mt-3 max-w-sm text-sm leading-7 text-indigo-100/60">{footerNote}</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-extrabold">Quick Links</h3>
              <ul className="mt-5 space-y-3 text-sm text-indigo-100/75">
                {links.map((link) => (
                  <li key={link.url}>
                    <Link href={link.url} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-extrabold">Support</h3>
              <ul className="mt-5 space-y-3 text-sm text-indigo-100/75">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.url} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
                {socialLinks.map((link) => (
                  <li key={`${link.platform}-${link.url}`}>
                    <Link href={link.url || '#'} className="transition hover:text-white">
                      {link.label || link.platform || 'Social'}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-extrabold">Newsletter</h3>
              <p className="mt-5 text-sm leading-7 text-indigo-100/75">
                Stay updated with changes in admissions, student visas, and planning tips for
                Germany.
              </p>
              <div className="mt-5 flex rounded-full bg-white/8 p-1.5 backdrop-blur-sm">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full border-0 bg-transparent px-4 py-2 text-sm text-white placeholder:text-indigo-100/55 focus:outline-none"
                />
                <button className="rounded-full bg-amber-200 px-4 py-2 text-sm font-bold text-amber-900">
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-indigo-100/65 md:flex-row md:items-center md:justify-between">
            <p>
              {site?.copyrightText ||
                `© ${year} ${siteName}. Crafted for clarity, trust, and conversion.`}
            </p>
            <div>
              {email && <span>{email}</span>}
              {email && phone && <span> • </span>}
              {phone && <span>{phone}</span>}
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // Default variant — dark gradient footer
  return (
    <footer className="fe-bg-gradient-dark py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <span className="text-base font-bold text-[var(--fe-text-on-dark)]">{siteName}</span>
            {tagline && (
              <p className="mt-1 text-sm text-[var(--fe-text-on-dark-secondary)]">{tagline}</p>
            )}
            {footerNote && (
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--fe-text-on-dark-muted)]">
                {footerNote}
              </p>
            )}
            {(email || phone) && (
              <div className="mt-3 flex flex-col gap-1">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="text-sm text-[var(--fe-primary-light)] transition-colors hover:text-white"
                  >
                    {email}
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="text-sm text-[var(--fe-text-on-dark-secondary)] transition-colors hover:text-white"
                  >
                    {phone}
                  </a>
                )}
              </div>
            )}
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className="text-sm text-[var(--fe-text-on-dark-secondary)] transition-colors hover:text-[var(--fe-text-on-dark)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        {socialLinks.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <Link
                key={`${link.platform}-${link.url}`}
                href={link.url || '#'}
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[var(--fe-text-on-dark-secondary)] transition-colors hover:text-[var(--fe-text-on-dark)]"
              >
                {link.label || link.platform || 'Social'}
              </Link>
            ))}
          </div>
        )}
        <hr className="fe-divider my-8 opacity-20" />
        <p className="text-xs text-[var(--fe-text-on-dark-muted)]">
          {site?.copyrightText || `© ${year} ${siteName}. All rights reserved.`}
        </p>
      </div>
    </footer>
  )
}
