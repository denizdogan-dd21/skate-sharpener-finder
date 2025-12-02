'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { SearchResult, SearchCoordinates } from '@/types'

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  )
})

export default function SearchPage() {
  const t = useTranslations()
  const [searchParams, setSearchParams] = useState({
    city: 'Munich',
    state: 'Bayern',
    zipCode: ''
  })
  const [results, setResults] = useState<SearchResult[]>([])
  const [searchCoordinates, setSearchCoordinates] = useState<SearchCoordinates | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSearched(true)

    const query = new URLSearchParams()
    if (searchParams.city) query.append('city', searchParams.city)
    if (searchParams.state) query.append('state', searchParams.state)
    if (searchParams.zipCode) query.append('zipCode', searchParams.zipCode)

    try {
      const response = await fetch(`/api/sharpeners/search?${query.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Search failed')
        setResults([])
        setSearchCoordinates(null)
      } else {
        setResults(data.results || [])
        setSearchCoordinates(data.searchCoordinates || null)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setResults([])
      setSearchCoordinates(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('search.title')}</h1>

        {/* Search Form */}
        <div className="card mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('search.city')}
                </label>
                <input
                  id="city"
                  type="text"
                  className="input-field"
                  placeholder="e.g., Munich"
                  value={searchParams.city}
                  onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('search.state')}
                </label>
                <input
                  id="state"
                  type="text"
                  className="input-field"
                  placeholder="e.g., Bayern"
                  value={searchParams.state}
                  onChange={(e) => setSearchParams({ ...searchParams, state: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('search.zipCode')}
                </label>
                <input
                  id="zipCode"
                  type="text"
                  className="input-field"
                  placeholder="e.g., 80331"
                  value={searchParams.zipCode}
                  onChange={(e) => setSearchParams({ ...searchParams, zipCode: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center mb-4">
              <input
                id="showAll"
                type="checkbox"
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
              />
              <label htmlFor="showAll" className="ml-2 text-sm font-medium text-gray-700">
                {t('search.showAll')}
              </label>
            </div>
            <button
              type="submit"
              disabled={loading || (!searchParams.city && !searchParams.state && !searchParams.zipCode)}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('search.searching') : t('search.searchButton')}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {results.filter(r => showAll || (r.upcomingAvailability && r.upcomingAvailability.length > 0)).length > 0 
                ? `Found ${results.filter(r => showAll || (r.upcomingAvailability && r.upcomingAvailability.length > 0)).length} sharpener${results.filter(r => showAll || (r.upcomingAvailability && r.upcomingAvailability.length > 0)).length > 1 ? 's' : ''}` 
                : 'No sharpeners found'}
            </h2>
            
            {/* Map and Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Results List */}
              <div className="space-y-6 order-2 lg:order-1">
                {results
                  .filter(result => showAll || (result.upcomingAvailability && result.upcomingAvailability.length > 0))
                  .map((result) => (
                  <div key={result.locationId} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{result.sharpenerName}</h3>
                        <p className="text-gray-600">{result.locationName}</p>
                        <p className="text-sm text-gray-500">
                          {result.city}, {result.state} {result.zipCode}
                        </p>
                        {result.distance !== null && (
                          <div className="mt-2 inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
                            📍 {result.distance.toFixed(1)} km away
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        {result.averageRating && (
                          <div className="flex items-center justify-end">
                            <div className="flex mr-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`text-xl ${
                                    star <= Math.round(result.averageRating)
                                      ? 'text-yellow-500'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  ⭐
                                </span>
                              ))}
                            </div>
                            <span className="text-lg font-bold">{result.averageRating.toFixed(1)}</span>
                            <span className="text-gray-500 text-sm ml-1">({result.totalRatings})</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Machines */}
                    {result.machines && result.machines.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2">{t('search.machines')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.machines.map((machine: any) => (
                            <span key={machine.machineId} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                              {machine.machineType}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Availability for Next 14 Days */}
                    {result.upcomingAvailability && result.upcomingAvailability.length > 0 ? (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2">{t('search.available14Days')}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {result.upcomingAvailability.map((slot: any) => (
                            <div key={slot.availabilityId} className="text-sm bg-green-50 border border-green-200 rounded px-3 py-2">
                              <div className="font-medium text-gray-900">
                                {new Date(slot.availableDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-gray-600">
                                {slot.startTime} - {slot.endTime} • ${slot.price}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 italic">No availability in the next 14 days</p>
                      </div>
                    )}

                    <Link
                      href={`/sharpener/${result.sharpenerId}`}
                      className="btn-primary inline-block"
                    >
                      {t('search.viewProfile')}
                    </Link>
                  </div>
                ))}
              </div>
              
              {/* Map */}
              {searchCoordinates && (
                <div className="order-1 lg:order-2 h-[400px] lg:h-auto lg:sticky lg:top-4">
                  <MapView 
                    searchCoordinates={searchCoordinates} 
                    results={results.filter(r => showAll || (r.upcomingAvailability && r.upcomingAvailability.length > 0))}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
