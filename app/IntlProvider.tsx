'use client'

import { NextIntlClientProvider } from 'next-intl'
import { ReactNode, useEffect, useState } from 'react'
import enMessages from '@/locales/en.json'
import deMessages from '@/locales/de.json'

const messages = {
  en: enMessages,
  de: deMessages
}

export default function IntlProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get locale from localStorage or default to 'en'
    const storedLocale = localStorage.getItem('locale') || 'en'
    setLocale(storedLocale)
  }, [])

  // Render with default locale until client-side hydration
  return (
    <NextIntlClientProvider 
      locale={mounted ? locale : 'en'} 
      messages={messages[mounted ? (locale as 'en' | 'de') : 'en']}
      timeZone="Europe/Berlin"
    >
      {children}
    </NextIntlClientProvider>
  )
}
