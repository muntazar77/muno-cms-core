import { getPayload } from 'payload'
import config from '@payload-config'

async function seedMarketing() {
  const payload = await getPayload({ config })

  const existingHome = await payload.find({
    collection: 'marketing-pages',
    where: {
      and: [{ isHome: { equals: true } }],
    },
    limit: 1,
    depth: 0,
  })

  if (existingHome.totalDocs === 0) {
    await payload.create({
      collection: 'marketing-pages',
      data: {
        title: 'MonoCMS Home',
        slug: 'home',
        status: 'published',
        isHome: true,
        publishedAt: new Date().toISOString(),
        blocks: [],
      },
    })
    payload.logger.info('Created default marketing homepage document.')
  } else {
    payload.logger.info('Marketing homepage already exists. Skipping document creation.')
  }

  await payload.updateGlobal({
    slug: 'platform-settings',
    data: {
      productName: 'MonoCMS',
      tagline: 'Build and manage multiple websites from one dashboard.',
      defaultSeoTitle: 'MonoCMS — Multi-Site Website Builder',
      defaultSeoDescription:
        'Build and manage multiple client websites from one powerful dashboard. Page builder, forms, media, and more.',
      navLinks: [
        { label: 'Features', url: '/features', openInNewTab: false },
        { label: 'Pricing', url: '/pricing', openInNewTab: false },
        { label: 'Contact', url: '/contact', openInNewTab: false },
      ],
      navCta: {
        label: 'Start Free',
        url: '/admin',
        variant: 'primary',
      },
      footerLegalLinks: [
        { label: 'Privacy', url: '/privacy' },
        { label: 'Terms', url: '/terms' },
      ],
      copyrightText: '© {year} MonoCMS. All rights reserved.',
    },
  })

  payload.logger.info('Platform settings seeded/updated successfully.')
}

seedMarketing()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
