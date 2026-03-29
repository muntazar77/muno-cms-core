import { User, Image as ImageIcon, FileText } from 'lucide-react'
import { DashboardActivityList, type DashboardActivityItem } from './primitives'

interface ActivityItem {
  id: string
  type: 'user' | 'media' | 'page'
  label: string
  sublabel: string
  time: string | Date
}

const TYPE_META = {
  user: { icon: User, tone: 'info' as const },
  media: { icon: ImageIcon, tone: 'primary' as const },
  page: { icon: FileText, tone: 'success' as const },
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  const mappedItems: DashboardActivityItem[] = items.map((item) => ({
    id: item.id,
    title: item.label,
    subtitle: item.sublabel,
    time: item.time,
    icon: TYPE_META[item.type].icon,
    tone: TYPE_META[item.type].tone,
  }))

  return (
    <DashboardActivityList
      items={mappedItems}
      emptyTitle="No recent activity"
      emptyDescription="Activity will appear here as content is created."
    />
  )
}
