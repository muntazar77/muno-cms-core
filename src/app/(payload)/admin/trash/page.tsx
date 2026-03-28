/* Redirect legacy /admin/trash to Payload's catch-all so the custom view renders correctly */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({
    config,
    params: Promise.resolve({ segments: ['trash'] }),
    searchParams,
  })

const Page = ({ searchParams }: Args) =>
  RootPage({
    config,
    params: Promise.resolve({ segments: ['trash'] }),
    searchParams,
    importMap,
  })

export default Page
