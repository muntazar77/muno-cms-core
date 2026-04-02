import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import type { PlatformSetting } from '@/payload-types'

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

  return (
    <>
      <MarketingNav settings={settings} />
      <main>{children}</main>
      <MarketingFooter settings={settings} />
    </>
  )
}
