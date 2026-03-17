import React from 'react'
import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: {
    default: 'Muno CMS',
    template: '%s | Muno CMS',
  },
  description: 'Built with Muno CMS',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--fe-surface-primary)] text-[var(--fe-text-primary)] antialiased">
        {children}
      </body>
    </html>
  )
}
