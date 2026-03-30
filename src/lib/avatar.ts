export function getAvatarInitials(fullName?: string | null, email?: string | null): string {
  const source = (fullName && fullName.trim()) || (email && email.split('@')[0]) || ''
  if (!source) return 'U'

  const parts = source.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 1) {
    const word = parts[0].replace(/[^a-zA-Z0-9]/g, '')
    return word.slice(0, 2).toUpperCase() || 'U'
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase() || 'U'
}

function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const AVATAR_TONES = [
  'bg-(--cms-primary-soft) text-(--cms-primary-text)',
  'bg-(--cms-success-soft) text-(--cms-success-text)',
  'bg-(--cms-info-soft) text-(--cms-info-text)',
  'bg-(--cms-warning-soft) text-(--cms-warning-text)',
  'bg-(--cms-danger-soft) text-(--cms-danger-text)',
]

export function getAvatarToneClass(fullName?: string | null, email?: string | null): string {
  const seed = `${fullName ?? ''}|${email ?? ''}`
  const index = hashString(seed) % AVATAR_TONES.length
  return AVATAR_TONES[index]
}
