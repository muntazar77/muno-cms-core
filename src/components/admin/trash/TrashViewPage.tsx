import React from 'react'
import { DefaultTemplate } from '@payloadcms/next/templates'
import type { AdminViewServerProps } from 'payload'
import TrashView from './TrashView'

export default function TrashViewPage(props: AdminViewServerProps) {
  return (
    <DefaultTemplate
      i18n={props.i18n}
      locale={props.locale}
      params={props.params}
      payload={props.payload}
      permissions={props.permissions}
      searchParams={props.searchParams}
      user={props.user}
      visibleEntities={props.initPageResult.visibleEntities}
    >
      <TrashView />
    </DefaultTemplate>
  )

}