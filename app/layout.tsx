'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [pathname]) // Re-check user on route change

  const handleSignOut = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
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
                  <span className="hidden sm:inline">Skate Sharpener Finder</span>
                  <span className="sm:hidden">SSF</span>
                </Link>
              </div>
              
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-700 hover:text-primary-600 p-2"
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
                  Search Sharpeners
                </Link>
                {user ? (
                  <>
                    {user.accountType === 'user' && (
                      <Link href="/appointments" className="text-gray-700 hover:text-primary-600 font-medium">
                        My Appointments
                      </Link>
                    )}
                    {user.accountType === 'sharpener' && (
                      <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium">
                        Dashboard
                      </Link>
                    )}
                    <span className="text-gray-600">
                      {user.firstName} {user.lastName}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-gray-700 hover:text-red-600 font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 font-medium">
                      Login
                    </Link>
                    <Link href="/auth/register" className="btn-primary">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 py-3">
                <div className="flex flex-col space-y-3">
                  <Link 
                    href="/search" 
                    className="text-gray-700 hover:text-primary-600 font-medium px-4 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Search Sharpeners
                  </Link>
                  {user ? (
                    <>
                      {user.accountType === 'user' && (
                        <Link 
                          href="/appointments" 
                          className="text-gray-700 hover:text-primary-600 font-medium px-4 py-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          My Appointments
                        </Link>
                      )}
                      {user.accountType === 'sharpener' && (
                        <Link 
                          href="/dashboard" 
                          className="text-gray-700 hover:text-primary-600 font-medium px-4 py-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      )}
                      <div className="text-gray-600 px-4 py-2">
                        {user.firstName} {user.lastName}
                      </div>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false)
                          handleSignOut()
                        }}
                        className="text-left text-gray-700 hover:text-red-600 font-medium px-4 py-2"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/auth/login" 
                        className="text-gray-700 hover:text-primary-600 font-medium px-4 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link 
                        href="/auth/register" 
                        className="btn-primary mx-4"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>
        
        <main className="min-h-screen">
          {children}
        </main>
        
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2025 Skate Sharpener Finder. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
