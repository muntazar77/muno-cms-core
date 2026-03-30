'use client'

import { useEffect, useMemo, useState } from 'react'
import { Loader2, Upload, User2, Shield, Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import AccountAvatar from './AccountAvatar'

interface AccountProfile {
  id: string
  email: string
  fullName: string
  timezone: string
  language: string
  avatar: string | null
  avatarUrl: string | null
  siteId: string | null
  role: string | null
}

const timezoneOptions = [
  'UTC',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Riyadh',
  'Asia/Karachi',
  'Asia/Kuala_Lumpur',
  'America/New_York',
  'America/Los_Angeles',
]

export default function AccountView() {
  const [profile, setProfile] = useState<AccountProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  const [fullName, setFullName] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [language, setLanguage] = useState('en')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/account/profile', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to load account profile')
        const data = (await res.json()) as AccountProfile
        if (cancelled) return
        setProfile(data)
        setFullName(data.fullName || '')
        setTimezone(data.timezone || 'UTC')
        setLanguage(data.language || 'en')
      } catch {
        if (!cancelled) setError('Could not load your account profile.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const canSaveProfile = useMemo(() => {
    if (!profile) return false
    return (
      fullName.trim() !== (profile.fullName || '') ||
      timezone !== (profile.timezone || 'UTC') ||
      language !== (profile.language || 'en')
    )
  }, [profile, fullName, timezone, language])

  async function uploadAvatar(file: File) {
    if (!profile) return

    setError('')
    setMessage('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('alt', `${fullName || profile.email} avatar`)
    if (profile.siteId) formData.append('siteId', profile.siteId)

    try {
      const uploadRes = await fetch('/api/media', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      if (!uploadRes.ok) throw new Error('Failed to upload avatar image')
      const uploaded = (await uploadRes.json()) as { doc?: { id?: string | number; url?: string | null } }
      const avatarId = uploaded.doc?.id ? String(uploaded.doc.id) : null
      if (!avatarId) throw new Error('Missing uploaded media id')

      const saveRes = await fetch('/api/account/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: avatarId }),
      })
      if (!saveRes.ok) throw new Error('Failed to attach avatar to account')

      const result = (await saveRes.json()) as { profile?: AccountProfile }
      if (result.profile) {
        setProfile((prev) => ({ ...prev!, ...result.profile }))
      } else {
        const refreshed = await fetch('/api/account/profile', { credentials: 'include' })
        if (refreshed.ok) {
          const next = (await refreshed.json()) as AccountProfile
          setProfile(next)
        }
      }

      setMessage('Profile image updated.')
    } catch {
      setError('Failed to upload profile image.')
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!profile || !canSaveProfile) return

    setSavingProfile(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          timezone,
          language,
        }),
      })
      const json = (await res.json()) as { error?: string; profile?: AccountProfile }
      if (!res.ok) throw new Error(json.error || 'Failed to update profile')
      if (json.profile) {
        setProfile((prev) => ({ ...prev!, ...json.profile }))
      }
      setMessage('Profile updated successfully.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setChangingPassword(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch('/api/account/password', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) throw new Error(json.error || 'Failed to update password')

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setMessage('Password changed successfully.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-(--cms-text-secondary)">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Loading account...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-(--cms-danger-text)">
        Unable to load account profile.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-(--cms-bg-elevated)">
      <div className="mx-auto w-full max-w-330 space-y-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
        <section className="rounded-3xl border border-(--cms-card-border) bg-(--cms-card-bg) p-6 sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-(--cms-border) bg-(--cms-bg-muted) px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--cms-text-secondary)">
                Account
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-(--cms-text)">
                My Account
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-(--cms-text-secondary)">
                Manage your profile details and security settings.
              </p>
            </div>

            <AccountAvatar
              fullName={fullName || profile.fullName}
              email={profile.email}
              imageUrl={profile.avatarUrl}
              className="size-16"
              fallbackClassName="text-base"
            />
          </div>
        </section>

        {error ? (
          <div className="rounded-xl border border-(--cms-danger-soft) bg-(--cms-danger-soft) px-4 py-3 text-sm text-(--cms-danger-text)">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="rounded-xl border border-(--cms-success-soft) bg-(--cms-success-soft) px-4 py-3 text-sm text-(--cms-success-text)">
            {message}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Card className="rounded-3xl border-(--cms-card-border)">
            <CardHeader className="border-b border-(--cms-border-subtle) pb-4">
              <CardTitle className="inline-flex items-center gap-2 text-base">
                <User2 className="size-4 text-(--cms-primary)" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <form className="space-y-4" onSubmit={handleSaveProfile}>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.12em] text-(--cms-text-muted)">Full name</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.12em] text-(--cms-text-muted)">Email</label>
                  <Input value={profile.email} readOnly className="h-11 rounded-xl opacity-80" />
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.12em] text-(--cms-text-muted)">Profile image</label>
                  <div className="flex items-center gap-3">
                    <AccountAvatar
                      fullName={fullName || profile.fullName}
                      email={profile.email}
                      imageUrl={profile.avatarUrl}
                    />
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-(--cms-border) bg-(--cms-bg) px-3 py-2 text-sm font-medium text-(--cms-text-secondary) transition hover:bg-(--cms-bg-muted) hover:text-(--cms-text)">
                      <Upload className="size-4" />
                      Upload
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            void uploadAvatar(file)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-(--cms-text-muted)">Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="h-11 rounded-xl border border-(--cms-input-border) bg-(--cms-input-bg) px-3 text-sm text-(--cms-text)"
                    >
                      {timezoneOptions.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-(--cms-text-muted)">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="h-11 rounded-xl border border-(--cms-input-border) bg-(--cms-input-bg) px-3 text-sm text-(--cms-text)"
                    >
                      <option value="en">English</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!canSaveProfile || savingProfile}
                  className="h-11 rounded-xl bg-(--cms-primary) px-5 text-sm font-semibold text-white hover:bg-(--cms-primary-hover)"
                >
                  {savingProfile ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  Save Profile
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-(--cms-card-border)">
            <CardHeader className="border-b border-(--cms-border-subtle) pb-4">
              <CardTitle className="inline-flex items-center gap-2 text-base">
                <Shield className="size-4 text-(--cms-primary)" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <form className="space-y-4" onSubmit={handleChangePassword}>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.12em] text-(--cms-text-muted)">Current password</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.12em] text-(--cms-text-muted)">New password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.12em] text-(--cms-text-muted)">Confirm new password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={changingPassword}
                  className="h-11 rounded-xl bg-(--cms-primary) px-5 text-sm font-semibold text-white hover:bg-(--cms-primary-hover)"
                >
                  {changingPassword ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  Change Password
                </Button>
              </form>

              <div className="rounded-xl border border-(--cms-border) bg-(--cms-bg-muted) px-4 py-3 text-xs leading-6 text-(--cms-text-secondary)">
                <span className="inline-flex items-center gap-1.5 font-semibold text-(--cms-text)">
                  <Globe2 className="size-3.5" /> Security note
                </span>
                <p className="mt-1">Use a strong password with at least 8 characters. Avoid reusing passwords across services.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
