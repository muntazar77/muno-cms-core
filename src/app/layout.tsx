import type { ReactNode } from 'react'

// Passthrough root layout — required by Next.js App Router when using
// multiple root layouts inside route groups ((frontend), (payload), marketing).
// Each route group provides its own <html>+<body>; this file satisfies Next.js's
// requirement that a root layout exists at the app/ level.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children as React.ReactElement
}
