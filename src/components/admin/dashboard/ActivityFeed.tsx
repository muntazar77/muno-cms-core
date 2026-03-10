import { User, Image as ImageIcon, FileText, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ActivityItem {
  id: string
  type: 'user' | 'media' | 'page'
  label: string
  sublabel: string
  time: string | Date
}

function timeAgo(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

const TYPE_META = {
  user: {
    icon: User,
    color: 'bg-blue-50 text-blue-600',
    badge: 'secondary' as const,
    label: 'User',
  },
  media: {
    icon: ImageIcon,
    color: 'bg-violet-50 text-violet-600',
    badge: 'secondary' as const,
    label: 'Media',
  },
  page: {
    icon: FileText,
    color: 'bg-emerald-50 text-emerald-600',
    badge: 'secondary' as const,
    label: 'Page',
  },
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="size-8 text-gray-300 mb-3" />
        <p className="text-sm font-medium text-gray-500">No recent activity</p>
        <p className="text-xs text-gray-400 mt-1">
          Activity will appear here as content is created.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col divide-y divide-gray-50">
      {items.map((item, i) => {
        const meta = TYPE_META[item.type]
        const Icon = meta.icon

        return (
          <div
            key={item.id}
            className={cn(
              'flex items-start gap-3 py-3 transition-colors hover:bg-gray-50 px-1 rounded-lg',
              i === 0 && 'pt-0',
            )}
          >
            <div
              className={cn(
                'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
                meta.color,
              )}
            >
              <Icon className="size-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-gray-900">{item.label}</p>
                <Badge variant={meta.badge} className="shrink-0 text-[10px]">
                  {meta.label}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{item.sublabel}</p>
            </div>
            <time className="shrink-0 text-[11px] text-gray-400 mt-0.5">{timeAgo(item.time)}</time>
          </div>
        )
      })}
    </div>
  )
}
