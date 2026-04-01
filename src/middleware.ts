import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── Config ───────────────────────────────────────────────────────────────────

const ROOT_DOMAIN = process.env.ROOT_DOMAIN || 'monocms.app'

/**
 * Paths that bypass marketing rewrites entirely.
 * These must always pass through to the underlying Next.js/Payload routing.
 */
const BYPASS_PREFIXES = [
  '/admin',
  '/api',
  '/_next',
  '/my-route',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeHost(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-host')
  const host = forwarded ?? req.headers.get('host') ?? ''
  return host
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/:\d+$/, '')
}

function shouldBypass(pathname: string): boolean {
  return BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const host = normalizeHost(req)

  // Always pass through admin/API/static paths
  if (shouldBypass(pathname)) {
    return NextResponse.next()
  }

  // www → root redirect (301, preserves path)
  if (host === `www.${ROOT_DOMAIN}`) {
    const url = req.nextUrl.clone()
    url.host = ROOT_DOMAIN
    // Ensure port isn't carried over into production redirect
    url.port = ''
    return NextResponse.redirect(url, 301)
  }

  // Root domain → rewrite to /marketing/* (URL bar stays clean)
  if (host === ROOT_DOMAIN) {
    const url = req.nextUrl.clone()
    // Rewrite / → /marketing, /pricing → /marketing/pricing, etc.
    url.pathname = '/marketing' + (pathname === '/' ? '' : pathname)
    return NextResponse.rewrite(url)
  }

  // All other hosts (tenant subdomains + custom domains) → pass through unchanged.
  // The tenant resolution is handled at render time by getCurrentSite() in each
  // Server Component.
  return NextResponse.next()
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     *   - _next/static (static files)
     *   - _next/image  (image optimisation)
     *   - favicon.ico
     *   - Files with extensions (e.g. .js, .css, .png …)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
