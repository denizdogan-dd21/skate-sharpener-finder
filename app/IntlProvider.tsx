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
  const [locale, setLocale] = useState('de')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get locale from localStorage or default to 'de' (German)
    const storedLocale = localStorage.getItem('locale') || 'de'
    setLocale(storedLocale)
  }, [])

  // Render with default locale until client-side hydration
  return (
    <NextIntlClientProvider 
      locale={mounted ? locale : 'de'} 
      messages={messages[mounted ? (locale as 'en' | 'de') : 'de']}
      timeZone="Europe/Berlin"
    >
      {children}
    </NextIntlClientProvider>
  )
}
