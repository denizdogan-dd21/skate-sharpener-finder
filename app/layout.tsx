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
      <body className={inter.className}>
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center text-2xl font-bold text-primary-600">
                  <Image 
                    src="/hockey-skates.jpeg" 
                    alt="Ice Hockey Skates" 
                    width={40} 
                    height={40}
                    className="mr-2 rounded object-cover"
                  />
                  Skate Sharpener Finder
                </Link>
              </div>
              <div className="flex items-center space-x-4">
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
