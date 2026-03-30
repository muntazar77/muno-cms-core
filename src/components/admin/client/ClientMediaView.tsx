import Link from 'next/link'
import type { DocumentViewServerProps } from 'payload'
import { Image as ImageIcon, Plus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import WorkspaceHeader from '@/components/admin/shared/WorkspaceHeader'
import ClientMediaBrowser from './ClientMediaBrowser'

/* ─── Types ───────────────────────────────────────────────────────── */

interface UserWithSite {
  id?: string | number
  email?: string
  role?: string
  siteId?: string
}

interface SiteDoc {
  id: number | string
  siteId?: string | null
  siteName?: string | null
}

interface MediaDoc {
  id: string | number
  alt?: string | null
  caption?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  url?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

/* ─── Helpers ─────────────────────────────────────────────────────── */

function notDeletedWhere() {
  return { or: [{ isDeleted: { equals: false } }, { isDeleted: { exists: false } }] }
}

/* ─── Component ───────────────────────────────────────────────────── */

export default async function ClientMediaView(props: DocumentViewServerProps) {
  const user = props.user as UserWithSite | null
  const site = props.doc as SiteDoc | null

  if (!site) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-(--cms-text-secondary)">
        Site not found.
      </div>
    )
  }

  const siteKey = String(site.siteId ?? '')

  const baseWhere = {
    and: [{ siteId: { equals: siteKey } }, notDeletedWhere()],
  }

  // Fetch stat counts + initial page in parallel
  const [totalResult, imagesResult, pdfsResult, initialResult] = await Promise.all([
    props.payload.find({
      collection: 'media',
      depth: 0,
      limit: 0,
      user,
      overrideAccess: false,
      where: baseWhere,
    }),
    props.payload.find({
      collection: 'media',
      depth: 0,
      limit: 0,
      user,
      overrideAccess: false,
      where: {
        and: [
          { siteId: { equals: siteKey } },
          { mimeType: { contains: 'image' } },
          notDeletedWhere(),
        ],
      },
    }),
    props.payload.find({
      collection: 'media',
      depth: 0,
      limit: 0,
      user,
      overrideAccess: false,
      where: {
        and: [
          { siteId: { equals: siteKey } },
          { mimeType: { contains: 'pdf' } },
          notDeletedWhere(),
        ],
      },
    }),
    props.payload.find({
      collection: 'media',
      depth: 0,
      limit: 50,
      sort: '-createdAt',
      user,
      overrideAccess: false,
      where: baseWhere,
    }),
  ])

  const totalAll = totalResult.totalDocs
  const totalImages = imagesResult.totalDocs
  const totalPdfs = pdfsResult.totalDocs
  const totalOther = totalAll - totalImages - totalPdfs

  const initialMedia = initialResult.docs as unknown as MediaDoc[]

  const uploadHref = `/admin/collections/media/create?siteId=${encodeURIComponent(siteKey)}`

  return (
    <div className="min-h-screen bg-(--cms-bg-elevated)">
      <div className="mx-auto w-full max-w-[1680px] space-y-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
        <WorkspaceHeader
          eyebrow={site.siteName || siteKey}
          title="Media Library"
          description="Browse, organize, and manage images, PDFs, and file assets for this site. Select any file to preview details and copy its URL."
          primaryActionHref={uploadHref}
        //   primaryActionLabel="Upload File"
          stats={[
            { label: 'Total Files', value: `${totalAll} assets` },
            { label: 'Images', value: `${totalImages}` },
            { label: 'Documents', value: `${totalPdfs + totalOther}` },
          ]}
          aside={
            <div className="space-y-3">
              <div className="rounded-[24px] border border-(--cms-card-border) bg-(--cms-bg)/90 px-5 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-(--cms-primary-soft) text-(--cms-primary)">
                    <ImageIcon className="size-4.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                      Images
                    </p>
                    <p className="mt-0.5 text-xl font-semibold tracking-[-0.03em] text-(--cms-text)">
                      {totalImages}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[18px] border border-(--cms-border) bg-(--cms-bg-muted) px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                    PDFs
                  </p>
                  <p className="mt-1 text-lg font-semibold text-(--cms-text)">{totalPdfs}</p>
                </div>
                <div className="rounded-[18px] border border-(--cms-border) bg-(--cms-bg-muted) px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-muted)">
                    Other
                  </p>
                  <p className="mt-1 text-lg font-semibold text-(--cms-text)">
                    {Math.max(totalOther, 0)}
                  </p>
                </div>
              </div>
              <Link href={uploadHref}>
                <Button className="h-10 w-full gap-2 rounded-2xl bg-(--cms-primary) text-sm font-semibold text-white hover:bg-(--cms-primary-hover)">
                  <Upload className="size-4" />
                  Upload File
                </Button>
              </Link>
            </div>
          }
        />

        <ClientMediaBrowser
          siteKey={siteKey}
          initialMedia={initialMedia}
          totalAll={totalAll}
          totalImages={totalImages}
          totalPdfs={totalPdfs}
          totalOther={Math.max(totalOther, 0)}
          uploadHref={uploadHref}
        />
      </div>
    </div>
  )
}
