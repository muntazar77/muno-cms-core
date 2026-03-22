import React from 'react'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import './styles.css'

// Font URL map — loaded from Google Fonts when selected
const FONT_URLS: Record<string, string> = {
  poppins:
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap',
  outfit:
    'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap',
  'plus-jakarta-sans':
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
  'dm-sans':
    'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap',
  geist:
    'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap',
}

// CSS font-family stack per option
const FONT_STACKS: Record<string, string> = {
  inter: '"Inter", system-ui, -apple-system, sans-serif',
  geist: '"Geist", system-ui, sans-serif',
  poppins: '"Poppins", system-ui, sans-serif',
  outfit: '"Outfit", system-ui, sans-serif',
  'plus-jakarta-sans': '"Plus Jakarta Sans", system-ui, sans-serif',
  'dm-sans': '"DM Sans", system-ui, sans-serif',
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    const name = settings.siteName || 'Muno CMS'
    const desc = settings.seoDescription || settings.description || 'Built with Muno CMS'
    return {
      title: { default: settings.seoTitle || name, template: `%s | ${name}` },
      description: desc,
    }
  } catch {
    return {
      title: { default: 'Muno CMS', template: '%s | Muno CMS' },
      description: 'Built with Muno CMS',
    }
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  let primaryColor = '#6366f1'
  let fontFamily = 'inter'

  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    if (settings.primaryColor) primaryColor = settings.primaryColor
    if (settings.fontFamily) fontFamily = settings.fontFamily as string
  } catch {
    // fallback to defaults
  }

  const fontUrl = FONT_URLS[fontFamily]
  const fontStack = FONT_STACKS[fontFamily] ?? FONT_STACKS.inter

  // CSS color overrides injected at runtime
  const themeCSS = `
    :root {
      --fe-primary: ${primaryColor};
      --font-sans: ${fontStack};
    }
    body { font-family: ${fontStack}; }
  `

  return (
    <html lang="en">
      <head>
        {fontUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href={fontUrl} rel="stylesheet" />
          </>
        )}
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body className="min-h-screen bg-[var(--fe-surface-primary)] text-[var(--fe-text-primary)] antialiased">
        {children}
      </body>
    </html>
  )
}
