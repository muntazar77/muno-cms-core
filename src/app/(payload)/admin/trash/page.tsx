import { redirect } from 'next/navigation'

export default function LegacyTrashRedirectPage() {
  redirect('/admin/collections/trash')
}
