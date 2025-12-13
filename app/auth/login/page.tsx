'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import type { LoginFormData } from '@/types'

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
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        accountType: formData.accountType,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      // Redirect based on account type
      if (formData.accountType === 'sharpener') {
        router.push('/dashboard')
      } else {
        router.push('/search')
      }
      router.refresh()
    } catch (err) {
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
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value as 'user' | 'sharpener' })}
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
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value as 'user' | 'sharpener' })}
                    className="mr-2"
                  />
                  <span className="text-gray-900">{t('auth.login.sharpener')}</span>
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
