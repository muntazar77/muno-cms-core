function toHost(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/:\d+$/, '')
    .replace(/\/$/, '')
}

function parseAliasList(value: string | undefined): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((item) => toHost(item))
    .filter(Boolean)
}

const envRootDomain =
  process.env.ROOT_DOMAIN || process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.NEXT_PUBLIC_SITE_URL

export const ROOT_DOMAIN = toHost(envRootDomain || 'munocms.app')

const explicitAliases = parseAliasList(process.env.PLATFORM_HOST_ALIASES)

export const PLATFORM_HOST_ALIASES = Array.from(
  new Set([
    ROOT_DOMAIN,
    `www.${ROOT_DOMAIN}`,
    // Keep backward-compatible platform aliases for existing deployments.
    'monocms.app',
    'www.monocms.app',
    'munocms.app',
    'www.munocms.app',
    'localhost',
    '127.0.0.1',
    ...explicitAliases,
  ]),
)

export const RESERVED_TENANT_IDENTIFIERS = [
  'about',
  'pricing',
  'contact',
  'features',
  'login',
  'admin',
  'app',
  'api',
  'www',
  'cms',
  'marketing',
  'media',
  'blog',
  'help',
  'docs',
  'support',
  'status',
  'dev',
  'staging',
  's',
] as const

export function normalizeHost(value: string): string {
  return toHost(value)
}

export function extractSubdomainFromHost(host: string): string | null {
  const normalized = normalizeHost(host)
  if (!normalized) return null

  if (normalized.endsWith('.localhost')) {
    return normalized.replace('.localhost', '') || null
  }

  const parts = normalized.split('.')
  return parts.length > 2 ? parts[0] : null
}

export function isPlatformHost(host: string): boolean {
  const normalized = normalizeHost(host)
  return PLATFORM_HOST_ALIASES.includes(normalized)
}

export function extractPathModeSiteSlug(pathname: string): string | null {
  if (!pathname.startsWith('/s/')) return null

  const parts = pathname.split('/').filter(Boolean)
  if (parts.length < 2) return null
  return parts[1] || null
}
