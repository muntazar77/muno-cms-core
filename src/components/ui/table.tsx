'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string
}

function Table({ className, wrapperClassName, ...props }: TableProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-auto rounded-xl border bg-[var(--cms-card-bg)] shadow-[var(--cms-card-shadow)]',
        'border-[var(--cms-card-border)]',
        wrapperClassName,
      )}
    >
      <table
        className={cn('w-full caption-bottom text-sm [border-collapse:separate]', className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        'bg-[var(--cms-table-header-bg)] [&_tr]:border-b [&_tr]:border-[var(--cms-table-border)]',
        className,
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn(
        'divide-y divide-[var(--cms-table-border)] [&_tr:last-child]:border-0 [&_tr:nth-child(even)]:bg-[var(--cms-bg-elevated)]',
        className,
      )}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn(
        'border-t border-[var(--cms-border)] bg-[var(--cms-table-header-bg)] font-medium',
        className,
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'transition-colors hover:bg-[var(--cms-table-row-hover)]',
        'data-[state=selected]:bg-[var(--cms-primary-soft)]',
        className,
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'h-12 px-5 text-left align-middle text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--cms-text-secondary)]',
        '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        'px-5 py-4 align-middle text-[13.5px] text-[var(--cms-text-secondary)]',
        '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption className={cn('mt-4 text-xs text-[var(--cms-text-muted)]', className)} {...props} />
  )
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
