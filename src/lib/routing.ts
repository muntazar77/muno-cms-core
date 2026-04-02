export const ROOT_DOMAIN = (process.env.ROOT_DOMAIN || 'monocms.app').trim().toLowerCase()

export const PLATFORM_HOST_ALIASES = [ROOT_DOMAIN, `www.${ROOT_DOMAIN}`, 'localhost', '127.0.0.1']

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
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/:\d+$/, '')
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
