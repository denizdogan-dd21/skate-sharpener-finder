'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function LanguageToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      // Store locale preference in localStorage
      localStorage.setItem('locale', newLocale)
      // Trigger a page reload to apply new locale
      window.location.reload()
    })
  }

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-primary-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('de')}
        disabled={isPending}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          locale === 'de'
            ? 'bg-primary-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        DE
      </button>
    </div>
  )
}
