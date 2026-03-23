import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Forms } from './collections/Forms'
import { FormSubmissions } from './collections/FormSubmissions'
import { Services } from './collections/Services'
import { Sites } from './collections/Sites'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,

    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      actions: [
        './components/admin/dashboard/UserActions',
        './components/admin/dashboard/SearchAction',
      ],
      Nav: '/components/admin/Sidebar#default',
      providers: ['/components/admin/GlobalProvider#default'],
      afterLogin: ['/components/admin/AfterLoginRedirect#default'],

      views: {
        dashboard: {
          Component: '/components/admin/dashboard/DashboardView',
        },
        builder: {
          path: '/pages/:id/builder',
          Component: '/components/admin/builder/BuilderPage',
          exact: true,
        },
        trash: {
          path: '/trash',
          Component: '/components/admin/trash/TrashView',
          exact: true,
        },
      },
    },
  },
  collections: [Users, Sites, Media, Pages, Forms, FormSubmissions, Services],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
