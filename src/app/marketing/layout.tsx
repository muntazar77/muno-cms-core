import React from 'react'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import type { Media, PlatformSetting } from '@/payload-types'
import '../(frontend)/styles.css'

export const metadata: Metadata = {
  title: {
    default: 'MonoCMS — Multi-Site Website Builder',
    template: '%s | MonoCMS',
  },
  description:
    'Build and manage multiple client websites from one powerful dashboard. Page builder, forms, media, and more.',
}

async function getPlatformSettings(): Promise<PlatformSetting | null> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: 'platform-settings',
      depth: 1,
    })
    return settings as PlatformSetting
  } catch {
    return null
  }
}

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const settings: PlatformSetting | null = await getPlatformSettings()
  const favicon =
    typeof settings?.favicon === 'object' && settings.favicon !== null
      ? (settings.favicon as Media)
      : null

  return (
    <html lang="en">
      <head>
        {favicon?.url && <link rel="icon" href={favicon.url} />}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-(--fe-surface-primary) text-(--fe-text-primary) antialiased">
        <MarketingNav settings={settings} />
        <main>{children}</main>
        <MarketingFooter settings={settings} />
      </body>
    </html>
  )
}
