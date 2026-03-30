import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { getAvatarInitials, getAvatarToneClass } from '@/lib/avatar'

interface AccountAvatarProps {
  fullName?: string | null
  email?: string | null
  imageUrl?: string | null
  className?: string
  fallbackClassName?: string
}

export default function AccountAvatar({
  fullName,
  email,
  imageUrl,
  className,
  fallbackClassName,
}: AccountAvatarProps) {
  return (
    <Avatar className={cn('size-9 ring-1 ring-(--cms-border)', className)}>
      {imageUrl ? <AvatarImage src={imageUrl} alt={fullName || email || 'User avatar'} /> : null}
      <AvatarFallback
        className={cn(
          'text-[11px] font-semibold uppercase',
          getAvatarToneClass(fullName, email),
          fallbackClassName,
        )}
      >
        {getAvatarInitials(fullName, email)}
      </AvatarFallback>
    </Avatar>
  )
}
