'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { signIn } from 'next-auth/react'

type AccountType = 'user' | 'sharpener' | 'admin'

interface LoginFormData {
  email: string
  password: string
  accountType: AccountType
}

export default function LoginPage() {
  const router = useRouter()
  const t = useTranslations()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    accountType: 'user'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Submitting login with:', { email: formData.email, accountType: formData.accountType })
      
      // Call login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      console.log('Login response status:', response.status)
      
      const data = await response.json()
      console.log('Login response data:', data)

      if (!response.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // If OTP is required, redirect to verification page
      if (data.requiresOTP) {
        console.log('Redirecting to OTP verification')
        router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}&userType=${data.userType}`)
      } else {
        // Device is trusted, sign in directly
        const signInResult = await signIn('credentials', {
          email: data.email,
          password: 'verified',
          accountType: accountType,
          skipPasswordCheck: 'true',
          redirect: false,
        })

        if (signInResult?.error) {
          setError('Failed to create session')
          setLoading(false)
          return
        }

        // Redirect based on account type
        if (accountType === 'admin') {
          router.push('/admin/dashboard')
        } else if (accountType === 'sharpener') {
          router.push('/dashboard')
        } else {
          router.push('/search')
        }
        router.refresh()
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">{t('auth.login.title')}</h2>
          <p className="mt-2 text-gray-600">
            {t('auth.login.or')}{' '}
            <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
              {t('auth.login.createAccount')}
            </Link>
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
                {error.includes('verify your email') && (
                  <div className="mt-2">
                    <Link href="/auth/verification-sent" className="text-sm font-medium text-red-800 hover:text-red-900 underline">
                      Resend verification email
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.login.accountType')}
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accountType"
                    value="user"
                    checked={formData.accountType === 'user'}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value as AccountType })}
                    className="mr-2"
                  />
                  <span className="text-gray-900">{t('auth.login.customer')}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accountType"
                    value="sharpener"
                    checked={formData.accountType === 'sharpener'}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value as AccountType })}
                    className="mr-2"
                  />
                  <span className="text-gray-900">{t('auth.login.sharpener')}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accountType"
                    value="admin"
                    checked={formData.accountType === 'admin'}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value as AccountType })}
                    className="mr-2"
                  />
                  <span className="text-gray-900">{t('auth.login.admin')}</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.login.email')}
              </label>
              <input
                id="email"
                type="email"
                required
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.login.password')}
              </label>
              <input
                id="password"
                type="password"
                required
                className="input-field"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('auth.login.submitting') : t('auth.login.submitButton')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
