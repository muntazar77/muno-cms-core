import React from 'react'

/**
 * ClientShellInit — Server Component registered as admin.components.header[0].
 *
 * Runs on the server at SSR time and emits a synchronous inline <script> that
 * sets data attributes on <html> before the browser can paint. Because CSS
 * link tags are render-blocking, the browser will not paint until the
 * stylesheet has loaded. Inline scripts in <body> wait for preceding CSS to
 * complete before executing. So by the time frame #1 is painted:
 *   • the stylesheet is applied
 *   • this script has already set the data attributes
 *   • CSS rules like [data-admin-role='client'] match immediately
 *
 * This eliminates the "flash of Payload chrome" that occured when the
 * previous pure-CSS approach relied on useEffect (fires after hydration, long
 * after first paint).
 */

type ShellInitProps = {
  user?: Record<string, unknown> | null
  params?: { segments?: string[] }
}

const EXCLUDED_SITE_SEGS = new Set(['create', 'versions', 'version', 'api', 'preview'])

export default function ClientShellInit({ user, params }: ShellInitProps) {
  const rawRole = user && typeof user === 'object' && 'role' in user ? String(user.role ?? '') : ''

  // Validate against known values — prevents arbitrary strings entering the
  // script. The only outputs are "client", "super-admin", or "unknown".
  const adminRole = rawRole === 'client' || rawRole === 'super-admin' ? rawRole : 'unknown'

  const segments = Array.isArray(params?.segments) ? params.segments : []

  const isClientRole = adminRole === 'client'

  const clientSiteWorkspace =
    isClientRole &&
    segments[0] === 'collections' &&
    segments[1] === 'sites' &&
    !!segments[2] &&
    !EXCLUDED_SITE_SEGS.has(segments[2])

  const clientWorkspace =
    clientSiteWorkspace ||
    (isClientRole &&
      segments.length === 1 &&
      (segments[0] === 'account' || segments[0] === 'trash'))

  // JSON.stringify produces safe JS string literals even if values were
  // somehow unexpected. All values here are pre-validated booleans or
  // one of three known role strings.
  const script = `(function(d){var r=d.documentElement;r.dataset.adminRole=${JSON.stringify(adminRole)};r.dataset.clientWorkspace=${JSON.stringify(String(clientWorkspace))};r.dataset.clientSiteWorkspace=${JSON.stringify(String(clientSiteWorkspace))};})(document);`

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
