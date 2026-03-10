'use client'

import { Toaster } from 'sonner'
import dynamic from 'next/dynamic'
import { TooltipProvider } from '@/components/ui/tooltip'

const CommandMenu = dynamic(() => import('./command-menu/CommandMenu'), { ssr: false })

/**
 * Global provider for admin panel.
 * Wraps the entire admin with TooltipProvider and global components.
 */
export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={300}>
      {children}
      <CommandMenu />
      <Toaster position="bottom-right" richColors closeButton />
    </TooltipProvider>
  )
}
