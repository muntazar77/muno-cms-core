'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface SoftDeleteButtonProps {
  collection: string
  docId: string
  label?: string
}

export default function SoftDeleteButton({
  collection,
  docId,
  label = 'item',
}: SoftDeleteButtonProps) {
  const [isWorking, setIsWorking] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setIsWorking(true)
    try {
      const res = await fetch(`/api/${collection}/${docId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: true }),
      })
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
      toast.success(`${label} moved to trash.`)
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      toast.error(`Unable to delete${message ? ` (${message})` : ''}`)
    } finally {
      setIsWorking(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isWorking}
          className="h-10 gap-2 rounded-xl border-(--cms-border) bg-(--cms-bg) px-3 text-(--cms-text-muted) hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-800 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          

>
          <Trash2 className="size-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Move to Trash</AlertDialogTitle>
          <AlertDialogDescription>
            This {label.toLowerCase()} will be moved to trash. You can restore it later from the
            trash view.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="danger"
            onClick={(e) => {
              e.preventDefault()
              void handleDelete()
            }}
          >
            Move to Trash
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
