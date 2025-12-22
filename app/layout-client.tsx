'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import LanguageToggle from '@/components/LanguageToggle'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = useTranslations()

  const user = session?.user

  const handleSignOut = async () => {
    // Preserve device trust cookie before sign out
    const deviceTrusted = document.cookie
      .split('; ')
      .find(row => row.startsWith('device_trusted='))
      ?.split('=')[1]
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Signing out, preserving device_trusted cookie:', deviceTrusted ? 'found' : 'not found')
    }
    
    await signOut({ redirect: false })
    
    // Restore device trust cookie after sign out if it existed
    if (deviceTrusted) {
      const maxAge = 180 * 24 * 60 * 60 // 180 days in seconds
      const cookieString = `device_trusted=${deviceTrusted}; path=/; max-age=${maxAge}; samesite=lax${process.env.NODE_ENV === 'production' ? '; secure' : ''}`
      document.cookie = cookieString
      
      // Verify cookie was set
      setTimeout(() => {
        const restored = document.cookie.includes('device_trusted=')
        if (process.env.NODE_ENV === 'development') {
          console.log('Device trust cookie restored:', restored)
        }
      }, 100)
    }
    
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-lg sm:text-xl md:text-2xl font-bold text-primary-600">
                <Image 
                  src="/hockey-skates.jpeg" 
                  alt="Ice Hockey Skates" 
                  width={32} 
                  height={32}
                  className="mr-1 sm:mr-2 rounded object-cover"
                />
                <span className="hidden sm:inline">{t('app.name')}</span>
                <span className="sm:hidden">SSC</span>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden gap-2">
              <LanguageToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-primary-600 p-2"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/search" className="text-gray-700 hover:text-primary-600 font-medium">
                {t('nav.search')}
              </Link>
              {user ? (
                <>
                  {user.accountType === 'user' && (
                    <Link href="/appointments" className="text-gray-700 hover:text-primary-600 font-medium">
                      {t('nav.appointments')}
                    </Link>
                  )}
                  {user.accountType === 'sharpener' && (
                    <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium">
                      {t('nav.dashboard')}
                    </Link>
                  )}
                  {user.accountType === 'admin' && (
                    <Link href="/admin/dashboard" className="text-gray-700 hover:text-primary-600 font-medium">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="btn-secondary"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 font-medium">
                    {t('nav.login')}
                  </Link>
                  <Link href="/auth/register" className="btn-primary">
                    {t('nav.register')}
                  </Link>
                </>
              )}
              <LanguageToggle />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              <Link 
                href="/search" 
                className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.search')}
              </Link>
              {user ? (
                <>
                  {user.accountType === 'user' && (
                    <Link 
                      href="/appointments" 
                      className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.appointments')}
                    </Link>
                  )}
                  {user.accountType === 'sharpener' && (
                    <Link 
                      href="/dashboard" 
                      className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.dashboard')}
                    </Link>
                  )}
                  {user.accountType === 'admin' && (
                    <Link 
                      href="/admin/dashboard" 
                      className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleSignOut()
                    }}
                    className="block w-full text-left text-gray-700 hover:text-primary-600 font-medium py-2"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login" 
                    className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main>{children}</main>

      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} Skate Sharpener Connection. All rights reserved.</p>
            <p className="text-sm text-gray-400 mt-2">Version 2.0.1</p>
          </div>
        </div>
      </footer>
    </>
  )
}
