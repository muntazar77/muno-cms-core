import Link from 'next/link'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { getCurrentSite } from '@/lib/sites'
import { cn } from '@/lib/utils'

type HeaderVariant =
  | 'default'
  | 'centered'
  | 'minimal'
  | 'transparent'
  | 'editorial'
  | null
  | undefined

interface NavLink {
  label: string
  url: string
}

interface HeaderProps {
  variant?: HeaderVariant
  site?: Awaited<ReturnType<typeof getCurrentSite>>
}

export async function Header({ variant = 'default', site: siteProp }: HeaderProps) {
  const site = siteProp ?? (await getCurrentSite(1))

  const siteName = site?.siteName || 'Muno CMS'
  const logo = typeof site?.logo === 'object' && site?.logo !== null ? (site.logo as Media) : null
  const navLinks: NavLink[] = ((site?.headerNav ?? []) as NavLink[]).filter(
    (item) => item.label && item.url,
  )
  const ctaLabel = site?.ctaLabel || ''
  const ctaUrl = site?.ctaUrl || ''
  const showSiteTitle = site?.showSiteTitle !== false
  const showLanguageSwitcher = site?.showLanguageSwitcher === true
  const showThemeToggle = site?.showThemeToggle === true
  const stickyHeader = site?.stickyHeader !== false
  const v = variant && variant !== 'default' ? variant : 'editorial'

  // Fallback nav when no links configured
  const fallbackLinks: NavLink[] = [
    { label: 'About', url: '#' },
    { label: 'Services', url: '#' },
    { label: 'Contact', url: '#' },
  ]
  const links = navLinks.length > 0 ? navLinks : fallbackLinks
  const utilityPills = [
    ...(showLanguageSwitcher ? ['Language'] : []),
    ...(showThemeToggle ? ['Theme'] : []),
  ]
  const headerClassName = stickyHeader ? 'sticky top-0 z-40' : ''

  if (v === 'editorial') {
    return (
      <header
        className={cn('fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8', headerClassName)}
      >
        <nav className="glass-shell mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-5 py-4 shadow-lg ring-1 ring-white/50 lg:px-7">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--fe-primary)] to-[var(--fe-primary-dark)] text-white shadow-lg">
              {logo?.url ? (
                <Image
                  src={logo.url}
                  alt={siteName}
                  width={26}
                  height={26}
                  className="h-6 w-auto"
                />
              ) : (
                <span className="text-[22px] font-black">⌘</span>
              )}
            </div>
            <div>
              {showSiteTitle && (
                <p className="font-headline text-lg font-extrabold tracking-tight text-[var(--fe-primary)] sm:text-xl">
                  {siteName}
                </p>
              )}
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--fe-text-tertiary)]">
                Admissions • Visa • Relocation
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-[15px] font-bold tracking-tight md:flex">
            {links.map((link, index) => (
              <Link
                key={link.url}
                href={link.url}
                className={cn(
                  'transition hover:text-[var(--fe-primary)]',
                  index === 0 ? 'text-[var(--fe-primary)]' : 'text-[var(--fe-text-tertiary)]',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {showLanguageSwitcher && (
              <button className="hidden items-center gap-2 rounded-full bg-[var(--fe-surface-secondary)] px-4 py-2 text-sm font-semibold text-[var(--fe-primary)] transition hover:bg-[var(--fe-surface-primary)] md:inline-flex">
                <span aria-hidden="true">🌐</span>
                EN
              </button>
            )}
            {showThemeToggle && (
              <span className="hidden rounded-full border border-[var(--fe-border-subtle)] px-3 py-1 text-[11px] font-medium text-[var(--fe-text-tertiary)] md:inline-flex">
                Theme
              </span>
            )}
            {ctaLabel && ctaUrl && (
              <Link
                href={ctaUrl}
                className="rounded-full bg-gradient-to-br from-[var(--fe-primary)] to-[var(--fe-primary-dark)] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 sm:px-6"
              >
                {ctaLabel}
              </Link>
            )}
          </div>
        </nav>
      </header>
    )
  }

  if (v === 'transparent') {
    return (
      <header className={`absolute inset-x-0 top-0 z-50 py-4 ${headerClassName}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            {logo?.url && (
              <Image src={logo.url} alt={siteName} width={32} height={32} className="h-8 w-auto" />
            )}
            {showSiteTitle && <span className="text-lg font-bold text-white">{siteName}</span>}
          </Link>
          <nav className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            {utilityPills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-medium text-white/75"
              >
                {pill}
              </span>
            ))}
            {ctaLabel && ctaUrl && (
              <Link href={ctaUrl} className="fe-btn-primary !px-4 !py-2 !text-xs">
                {ctaLabel}
              </Link>
            )}
          </nav>
        </div>
      </header>
    )
  }

  if (v === 'centered') {
    return (
      <header
        className={cn(
          'border-b border-[var(--fe-border-subtle)] bg-[var(--fe-surface-primary)] py-4',
          headerClassName,
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            {logo?.url && (
              <Image src={logo.url} alt={siteName} width={32} height={32} className="h-8 w-auto" />
            )}
            {showSiteTitle && (
              <span className="text-lg font-bold text-[var(--fe-text-primary)]">{siteName}</span>
            )}
          </Link>
          <nav className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className="text-sm font-medium text-[var(--fe-text-secondary)] transition-colors hover:text-[var(--fe-primary)]"
              >
                {link.label}
              </Link>
            ))}
            {ctaLabel && ctaUrl && (
              <Link href={ctaUrl} className="fe-btn-primary !py-2 !px-4 !text-xs">
                {ctaLabel}
              </Link>
            )}
          </nav>
        </div>
      </header>
    )
  }

  if (v === 'minimal') {
    return (
      <header className={cn('bg-[var(--fe-surface-primary)] py-3', headerClassName)}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            {logo?.url && (
              <Image src={logo.url} alt={siteName} width={24} height={24} className="h-6 w-auto" />
            )}
            {showSiteTitle && (
              <span className="text-sm font-semibold text-[var(--fe-text-primary)]">
                {siteName}
              </span>
            )}
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
            {ctaLabel && ctaUrl && (
              <Link href={ctaUrl} className="fe-btn-primary !py-2 !px-4 !text-xs">
                {ctaLabel}
              </Link>
            )}
          </nav>
        </div>
      </header>
    )
  }

  // Default variant
  return (
    <header
      className={cn(
        'border-b border-[var(--fe-border-subtle)] bg-[var(--fe-surface-primary)] py-4',
        headerClassName,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          {logo?.url && (
            <Image src={logo.url} alt={siteName} width={32} height={32} className="h-8 w-auto" />
          )}
          {showSiteTitle && (
            <span className="text-lg font-bold text-[var(--fe-text-primary)]">{siteName}</span>
          )}
        </Link>
        <nav className="hidden items-center gap-8 sm:flex">
          {links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              className="text-sm font-medium text-[var(--fe-text-secondary)] transition-colors hover:text-[var(--fe-primary)]"
            >
              {link.label}
            </Link>
          ))}
          {utilityPills.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-[var(--fe-border-subtle)] px-3 py-1 text-[11px] font-medium text-[var(--fe-text-tertiary)]"
            >
              {pill}
            </span>
          ))}
          {ctaLabel && ctaUrl && (
            <Link href={ctaUrl} className="fe-btn-primary !py-2 !px-4 !text-xs">
              {ctaLabel}
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
