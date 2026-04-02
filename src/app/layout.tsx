import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import './(frontend)/styles.css'

export const metadata: Metadata = {
  title: {
    default: 'MonoCMS — Multi-Site Website Builder',
    template: '%s | MonoCMS',
  },
  description:
    'Build and manage multiple client websites from one powerful dashboard.',
}

/**
 * Root layout — provides the required <html> + <body> for Next.js production builds.
 *
 * This layout is used by the `marketing/` folder (plain folder, not a route group).
 * Route groups `(frontend)` and `(payload)` have their own root layouts and are
 * NOT affected by this file.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-[#0f172a] antialiased">
        {children}
      </body>
    </html>
  )
}
