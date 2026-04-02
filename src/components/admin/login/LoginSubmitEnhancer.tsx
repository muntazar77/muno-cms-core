'use client'

import { useEffect } from 'react'

export default function LoginSubmitEnhancer() {
  useEffect(() => {
    const root = document.documentElement
    const form = document.querySelector('.template-minimal form') as HTMLFormElement | null
    if (!form) return

    const handleSubmit = () => {
      root.dataset.loginPending = 'true'
    }

    form.addEventListener('submit', handleSubmit)

    return () => {
      form.removeEventListener('submit', handleSubmit)
      delete root.dataset.loginPending
    }
  }, [])

  return null
}
