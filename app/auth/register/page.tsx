'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import type { RegisterFormData } from '@/types'

export default function RegisterPage() {
  const router = useRouter()
  const t = useTranslations()
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    accountType: 'user',
    bio: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      // Auto-login after successful registration
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        accountType: formData.accountType,
        redirect: false,
      })

      if (result?.error) {
        // Registration succeeded but login failed, redirect to login page
        router.push('/auth/login')
      } else {
        // Redirect based on account type
        if (formData.accountType === 'sharpener') {
          router.push('/dashboard')
        } else {
          router.push('/search')
        }
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">{t('auth.register.title')}</h2>
          <p className="mt-2 text-gray-600">
            {t('auth.register.haveAccount')}{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
              {t('auth.register.signIn')}
            </Link>
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.register.iAm')}
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
                  <span className="text-gray-900">{t('auth.register.customer')}</span>
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
                  <span className="text-gray-900">{t('auth.register.sharpener')}</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.register.firstName')}
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  className="input-field"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.register.lastName')}
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  className="input-field"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.register.email')}
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.register.phone')}
              </label>
              <input
                id="phone"
                type="tel"
                required
                className="input-field"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.register.password')}
              </label>
              <input
                id="password"
                type="password"
                required
                className="input-field"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('auth.register.passwordHint')}
              </p>
            </div>

            {formData.accountType === 'sharpener' && (
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.register.bio')}
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  className="input-field"
                  placeholder={t('auth.register.bioPlaceholder')}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('auth.register.submitting') : t('auth.register.submitButton')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
