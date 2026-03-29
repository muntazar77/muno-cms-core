'use client'

import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-[var(--cms-primary)] focus-visible:ring-2 focus-visible:ring-[var(--cms-input-focus-ring)] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-[var(--cms-danger)] aria-invalid:ring-2 aria-invalid:ring-[var(--cms-danger-soft)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-[var(--cms-primary)] text-white hover:bg-[var(--cms-primary-hover)]',
        outline:
          'border-[var(--cms-border)] bg-[var(--cms-bg)] text-[var(--cms-text)] hover:bg-[var(--cms-bg-muted)] aria-expanded:bg-[var(--cms-bg-muted)]',
        secondary:
          'bg-[var(--cms-bg-muted)] text-[var(--cms-text)] hover:bg-[var(--cms-border-subtle)] aria-expanded:bg-[var(--cms-border-subtle)]',
        ghost:
          'text-[var(--cms-text-secondary)] hover:bg-[var(--cms-bg-muted)] hover:text-[var(--cms-text)] aria-expanded:bg-[var(--cms-bg-muted)]',
        destructive:
          'bg-[var(--cms-danger-soft)] text-[var(--cms-danger-text)] hover:opacity-90 focus-visible:border-[var(--cms-danger)] focus-visible:ring-[var(--cms-danger-soft)]',
        link: 'text-[var(--cms-primary)] underline-offset-4 hover:underline',
      },
      size: {
        default:
          'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
