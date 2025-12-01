'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations()
  
  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
            <Image 
              src="/hockey-skates.jpeg" 
              alt="Ice Hockey Skates" 
              width={80} 
              height={80}
              className="mb-4 sm:mb-0 sm:mr-4 rounded-lg object-cover"
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
              {t('app.name')}
            </h1>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            {t('home.hero.title')}
            <span className="text-primary-600"> {t('home.hero.subtitle')}</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto px-4">
            {t('home.hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <Link href="/search" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto">
              {t('home.hero.searchButton')}
            </Link>
            <Link href="/auth/login" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto">
              {t('nav.login')}
            </Link>
            <Link href="/auth/register" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto">
              {t('home.hero.joinButton')}
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
          {t('home.howItWorks.title')}
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="card text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">{t('home.howItWorks.search.title')}</h3>
            <p className="text-sm sm:text-base text-gray-900">
              {t('home.howItWorks.search.description')}
            </p>
          </div>
          <div className="card text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📅</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">{t('home.howItWorks.book.title')}</h3>
            <p className="text-sm sm:text-base text-gray-900">
              {t('home.howItWorks.book.description')}
            </p>
          </div>
          <div className="card text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⭐</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">{t('home.howItWorks.rate.title')}</h3>
            <p className="text-sm sm:text-base text-gray-900">
              {t('home.howItWorks.rate.description')}
            </p>
          </div>
        </div>
      </div>

      {/* For Sharpeners Section */}
      <div className="bg-primary-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{t('home.forSharpeners.title')}</h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
              {t('home.forSharpeners.description')}
            </p>
            <Link href="/auth/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 sm:px-8 rounded-lg transition duration-200 inline-block text-sm sm:text-base">
              {t('home.forSharpeners.ctaButton')}
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
            <div className="text-center">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold mb-2">{t('home.forSharpeners.locations.title')}</h3>
              <p className="text-primary-100">{t('home.forSharpeners.locations.description')}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⚙️</div>
              <h3 className="font-bold mb-2">{t('home.forSharpeners.equipment.title')}</h3>
              <p className="text-primary-100">{t('home.forSharpeners.equipment.description')}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="font-bold mb-2">{t('home.forSharpeners.reputation.title')}</h3>
              <p className="text-primary-100">{t('home.forSharpeners.reputation.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
