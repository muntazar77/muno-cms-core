import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--cms-primary)] text-white',
        secondary: 'bg-[var(--cms-bg-muted)] text-[var(--cms-text-secondary)]',
        success: 'bg-[var(--cms-success-soft)] text-[var(--cms-success-text)]',
        warning: 'bg-[var(--cms-warning-soft)] text-[var(--cms-warning-text)]',
        destructive: 'bg-[var(--cms-danger-soft)] text-[var(--cms-danger-text)]',
        outline: 'border border-[var(--cms-border)] text-[var(--cms-text-secondary)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
