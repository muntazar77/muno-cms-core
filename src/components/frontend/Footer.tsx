import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

type FooterVariant = 'default' | 'centered' | 'minimal' | 'columns' | null | undefined

interface FooterProps {
  variant?: FooterVariant
}

export async function Footer({ variant = 'default' }: FooterProps) {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })

  const siteName = settings.siteName || 'Muno CMS'
  const email = settings.contact?.email
  const phone = settings.contact?.phone
  const year = new Date().getFullYear()
  const v = variant || 'default'

  if (v === 'minimal') {
    return (
      <footer className="border-t border-[var(--fe-border-subtle)] bg-[var(--fe-surface-primary)] py-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <span className="text-xs font-medium text-[var(--fe-text-primary)]">{siteName}</span>
            <p className="text-xs text-[var(--fe-text-muted)]">
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
          <span className="text-lg font-bold text-[var(--fe-text-primary)]">{siteName}</span>
          <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {['About', 'Services', 'Pricing', 'Contact'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-sm text-[var(--fe-text-secondary)] transition-colors hover:text-[var(--fe-primary)]"
              >
                {item}
              </Link>
            ))}
          </nav>
          <hr className="fe-divider my-8" />
          <p className="text-xs text-[var(--fe-text-muted)]">
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
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <span className="text-base font-bold text-[var(--fe-text-on-dark)]">{siteName}</span>
              <p className="mt-3 text-sm leading-relaxed text-[var(--fe-text-on-dark-secondary)]">
                Building beautiful websites with the power of modern CMS technology.
              </p>
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="mt-3 block text-sm text-[var(--fe-primary-light)] hover:text-white transition-colors"
                >
                  {email}
                </a>
              )}
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Support', links: ['Documentation', 'Guides', 'API Status', 'Contact'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--fe-text-on-dark-muted)]">
                  {title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-[var(--fe-text-on-dark-secondary)] transition-colors hover:text-[var(--fe-text-on-dark)]"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <hr className="fe-divider mt-12 opacity-20" />
          <p className="mt-8 text-center text-xs text-[var(--fe-text-on-dark-muted)]">
            &copy; {year} {siteName}. All rights reserved.
          </p>
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
            <p className="mt-1 text-sm text-[var(--fe-text-on-dark-secondary)]">
              Building the modern web, one block at a time.
            </p>
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
            {['About', 'Services', 'Pricing', 'Contact'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-sm text-[var(--fe-text-on-dark-secondary)] transition-colors hover:text-[var(--fe-text-on-dark)]"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
        <hr className="fe-divider my-8 opacity-20" />
        <p className="text-xs text-[var(--fe-text-on-dark-muted)]">
          &copy; {year} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
