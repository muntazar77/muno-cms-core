import { redirect } from 'next/navigation'

export default function SitesCreatePageRedirect() {
  redirect('/admin/collections/sites')
}
