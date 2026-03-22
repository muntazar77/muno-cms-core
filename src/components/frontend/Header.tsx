import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/payload-types'

type HeaderVariant = 'default' | 'centered' | 'minimal' | 'transparent' | null | undefined

interface NavLink {
  label: string
  url: string
  isButton?: boolean | null
}

interface HeaderProps {
  variant?: HeaderVariant
}

export async function Header({ variant = 'default' }: HeaderProps) {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })

  const siteName = settings.siteName || 'Muno CMS'
  const logo =
    typeof settings.logo === 'object' && settings.logo !== null ? (settings.logo as Media) : null
  const navLinks: NavLink[] = (settings.headerNav ?? []) as NavLink[]
  const v = variant || 'default'

  // Fallback nav when no links configured
  const fallbackLinks: NavLink[] = [
    { label: 'About', url: '#' },
    { label: 'Services', url: '#' },
    { label: 'Contact', url: '#', isButton: true },
  ]
  const links = navLinks.length > 0 ? navLinks : fallbackLinks

  if (v === 'transparent') {
    return (
      <header className="absolute inset-x-0 top-0 z-50 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            {logo?.url && (
              <Image src={logo.url} alt={siteName} width={32} height={32} className="h-8 w-auto" />
            )}
            <span className="text-lg font-bold text-white">{siteName}</span>
          </Link>
          <nav className="flex items-center gap-6">
            {links.map((link) =>
              link.isButton ? (
                <Link key={link.url} href={link.url} className="fe-btn-primary !py-2 !px-4 !text-xs">
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.url}
                  href={link.url}
                  className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </header>
    )
  }

  if (v === 'centered') {
    return (
      <header className="border-b border-[var(--fe-border-subtle)] bg-[var(--fe-surface-primary)] py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            {logo?.url && (
              <Image src={logo.url} alt={siteName} width={32} height={32} className="h-8 w-auto" />
            )}
            <span className="text-lg font-bold text-[var(--fe-text-primary)]">{siteName}</span>
          </Link>
          <nav className="flex items-center gap-6">
            {links.map((link) =>
              link.isButton ? (
                <Link key={link.url} href={link.url} className="fe-btn-primary !py-2 !px-4 !text-xs">
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.url}
                  href={link.url}
                  className="text-sm font-medium text-[var(--fe-text-secondary)] transition-colors hover:text-[var(--fe-primary)]"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </header>
    )
  }

  if (v === 'minimal') {
    return (
      <header className="bg-[var(--fe-surface-primary)] py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            {logo?.url && (
              <Image src={logo.url} alt={siteName} width={24} height={24} className="h-6 w-auto" />
            )}
            <span className="text-sm font-semibold text-[var(--fe-text-primary)]">{siteName}</span>
          </Link>
          <nav className="flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className="text-xs font-medium text-[var(--fe-text-tertiary)] transition-colors hover:text-[var(--fe-text-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    )
  }

  // Default variant
  return (
    <header className="border-b border-[var(--fe-border-subtle)] bg-[var(--fe-surface-primary)] py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          {logo?.url && (
            <Image src={logo.url} alt={siteName} width={32} height={32} className="h-8 w-auto" />
          )}
          <span className="text-lg font-bold text-[var(--fe-text-primary)]">{siteName}</span>
        </Link>
        <nav className="hidden items-center gap-8 sm:flex">
          {links.map((link) =>
            link.isButton ? (
              <Link key={link.url} href={link.url} className="fe-btn-primary !py-2 !px-4 !text-xs">
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.url}
                href={link.url}
                className="text-sm font-medium text-[var(--fe-text-secondary)] transition-colors hover:text-[var(--fe-primary)]"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  )
}
