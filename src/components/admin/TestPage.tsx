import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import React from 'react'

export default function TrashView(props: AdminViewServerProps) {
  return (
    <DefaultTemplate {...props}>
      <div style={{ padding: 24 }}>
        <h1>Trash</h1>
        <p>My trash UI here</p>
      </div>
    </DefaultTemplate>
  )
}