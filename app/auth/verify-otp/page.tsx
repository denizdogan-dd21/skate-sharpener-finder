'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'

function VerifyOTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations()
  
  const [email, setEmail] = useState('')
  const [userType, setUserType] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const emailParam = searchParams.get('email') || ''
    const userTypeParam = searchParams.get('userType') || ''
    setEmail(emailParam)
    setUserType(userTypeParam)
    
    if (!emailParam || !userTypeParam) {
      router.push('/auth/login')
    }
  }, [searchParams, router])

  if (!mounted) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Verify OTP
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          userType,
          token: otp,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Verification failed')
        setLoading(false)
        return
      }

      // Create session with NextAuth
      const signInResult = await signIn('credentials', {
        email,
        password: 'verified', // Special flag to indicate OTP was verified
        accountType: userType === 'CUSTOMER' ? 'user' : userType === 'SHARPENER' ? 'sharpener' : 'admin',
        skipPasswordCheck: 'true', // Flag to skip password verification in NextAuth
        redirect: false,
      })

      if (signInResult?.error) {
        setError('Failed to create session')
        setLoading(false)
        return
      }

      // Redirect based on user type
      if (userType === 'ADMIN') {
        router.push('/admin/dashboard')
      } else if (userType === 'SHARPENER') {
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

  const handleResend = async () => {
    setResending(true)
    setError('')

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userType }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to resend code')
      } else {
        setError('')
        alert(t('auth.otp.codeSent'))
      }
    } catch (err) {
      setError('Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  if (!mounted || !email || !userType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">{t('auth.otp.title')}</h2>
          <p className="mt-2 text-gray-600">
            {t('auth.otp.subtitle')} <strong>{email}</strong>
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">✓ One-time verification:</span> After you verify this code, 
              you won't need to enter a code again on this device for 180 days.
            </p>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.otp.enterCode')}
              </label>
              <input
                id="otp"
                type="text"
                required
                maxLength={6}
                pattern="[0-9]{6}"
                placeholder="000000"
                className="input-field text-center text-2xl tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                autoComplete="off"
              />
              <p className="mt-2 text-sm text-gray-500">
                {t('auth.otp.enterSixDigit')}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('auth.otp.verifying') : t('auth.otp.verify')}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
              >
                {resending ? t('auth.otp.resending') : t('auth.otp.resendCode')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  )
}
