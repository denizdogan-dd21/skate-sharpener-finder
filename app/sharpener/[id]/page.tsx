'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import type { Sharpener, SharpenerLocation, SharpeningMachine, Availability } from '@/types'

interface SharpenerWithDetails extends Sharpener {
  locations: (SharpenerLocation & {
    machines: SharpeningMachine[]
    availabilities: Availability[]
  })[]
  ratings: any[]
}

export default function SharpenerProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const t = useTranslations()
  const [sharpener, setSharpener] = useState<SharpenerWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | null>(null)
  const [bookingNotes, setBookingNotes] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [selectedInterval, setSelectedInterval] = useState('')
  const [bookedIntervals, setBookedIntervals] = useState<{[key: number]: string[]}>({}) // availabilityId -> array of booked intervals

  useEffect(() => {
    loadSharpener()
  }, [params.id])

  const loadSharpener = async () => {
    try {
      const res = await fetch(`/api/sharpeners/${params.id}`)
      const data = await res.json()
      
      if (res.ok) {
        setSharpener(data)
        // Fetch booked intervals for all availabilities immediately
        await loadBookedIntervals(data)
      } else {
        setError(data.error || 'Sharpener not found')
      }
    } catch (err) {
      setError('Failed to load sharpener details')
    } finally {
      setLoading(false)
    }
  }

  const refreshBookedIntervals = async () => {
    if (sharpener) {
      await loadBookedIntervals(sharpener)
    }
  }

  const loadBookedIntervals = async (sharpenerData: any) => {
    try {
      // Fetch appointments for this sharpener
      const res = await fetch(`/api/appointments?sharpenerId=${sharpenerData.sharpenerId}`)
      const appointmentsData = await res.json()
      
      console.log('=== LOADING BOOKED INTERVALS ===')
      console.log('Sharpener ID:', sharpenerData.sharpenerId)
      console.log('Appointments response:', appointmentsData)
      
      if (res.ok) {
        // Build map of booked intervals
        const booked: {[key: number]: string[]} = {}
        appointmentsData.appointments?.forEach((apt: any) => {
          console.log(`Processing appointment ${apt.appointmentId}:`, {
            availabilityId: apt.availabilityId,
            startTime: apt.startTime,
            endTime: apt.endTime,
            status: apt.status,
            startTimeType: typeof apt.startTime,
            endTimeType: typeof apt.endTime
          })
          
          if (['PENDING', 'CONFIRMED'].includes(apt.status)) {
            if (!booked[apt.availabilityId]) {
              booked[apt.availabilityId] = []
            }
            // Ensure consistent format - trim any whitespace
            const startTime = apt.startTime.trim()
            const endTime = apt.endTime.trim()
            const intervalKey = `${startTime}-${endTime}`
            booked[apt.availabilityId].push(intervalKey)
            console.log(`Added to booked: availabilityId ${apt.availabilityId} -> "${intervalKey}" (length: ${intervalKey.length})`)
          }
        })
        console.log('Final booked intervals map:', JSON.stringify(booked, null, 2))
        setBookedIntervals(booked)
      }
    } catch (err) {
      console.error('Failed to load booked intervals:', err)
    }
  }

  const handleBooking = async () => {
    if (!session?.user) {
      router.push('/auth/login')
      return
    }

    if (session.user.accountType !== 'user') {
      alert('Only customers can book appointments')
      return
    }

    if (!selectedAvailability) {
      alert('Please select an available time slot')
      return
    }

    if (!selectedInterval) {
      alert('Please select a 15-minute time interval')
      return
    }

    if (!sharpener) {
      alert('Sharpener data not loaded')
      return
    }

    try {
      const [start, end] = selectedInterval.split('-')
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          sharpenerId: sharpener.sharpenerId,
          locationId: selectedAvailability.locationId,
          machineId: selectedAvailability.machineId,
          availabilityId: selectedAvailability.availabilityId,
          selectedInterval: { start, end },
          notes: bookingNotes
        })
      })

      const data = await res.json()
      
      if (res.ok) {
        setBookingSuccess(true)
        setSelectedAvailability(null)
        setBookingNotes('')
        setSelectedInterval('')
        setTimeout(() => setBookingSuccess(false), 5000)
        await refreshBookedIntervals() // Refresh booked intervals
        loadSharpener() // Reload to update availability
      } else {
        alert(data.error || 'Booking failed')
      }
    } catch (err) {
      alert('An error occurred while booking')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !sharpener) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {bookingSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {t('booking.success')}
          </div>
        )}

        {/* Sharpener Header */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                {sharpener.firstName} {sharpener.lastName}
              </h1>
              {sharpener.bio && (
                <p className="text-sm sm:text-base text-gray-600 mt-2">{sharpener.bio}</p>
              )}
            </div>
            {sharpener.averageRating && (
              <div className="text-left sm:text-right">
                <div className="flex items-center">
                  <span className="text-yellow-500 text-xl sm:text-2xl mr-2">⭐</span>
                  <span className="text-xl sm:text-2xl font-bold">{sharpener.averageRating.toFixed(1)}</span>
                </div>
                <p className="text-gray-500 text-xs sm:text-sm">{sharpener.totalRatings} {t('search.reviews')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Locations */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{t('sharpener.locations')}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
            {sharpener.locations.map((location: any) => (
              <div key={location.locationId} className="card">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{location.locationName}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-1">{location.city}, {location.state} {location.zipCode}</p>
                
                {/* Machines */}
                {location.machines.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">{t('sharpener.machines')}:</h4>
                    <div className="space-y-2">
                      {location.machines.map((machine: any) => (
                        <div key={machine.machineId} className="bg-gray-50 p-2 sm:p-3 rounded">
                          <p className="text-sm sm:text-base font-medium text-gray-900">{machine.machineType}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{t('sharpener.radiusOptions')}: {machine.radiusOptions}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availabilities */}
                {location.availabilities.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">{t('sharpener.availability')} ({t('search.results')}):</h4>
                    <div className="space-y-2">
                      {location.availabilities.map((avail: any) => (
                        <div
                          key={avail.availabilityId}
                          onClick={async () => {
                            if (!session?.user) {
                              if (confirm('You need to log in to book an appointment. Would you like to log in now?')) {
                                router.push('/auth/login')
                              }
                              return
                            }
                            if (session.user.accountType !== 'user') {
                              alert('Only customers can book appointments')
                              return
                            }
                            setSelectedAvailability({ ...avail, locationId: location.locationId })
                          }}
                          className={`p-3 border rounded-lg cursor-pointer transition ${
                            selectedAvailability?.availabilityId === avail.availabilityId
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm sm:text-base font-medium text-gray-900">
                                {new Date(avail.availableDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600">
                                {avail.startTime} - {avail.endTime}
                              </p>
                            </div>
                            <p className="text-base sm:text-lg font-bold text-primary-600">${avail.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        {selectedAvailability && (
          <div className="card mb-6 bg-primary-50 border-2 border-primary-600">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{t('booking.title')}</h3>
            <div className="bg-white p-3 sm:p-4 rounded-lg mb-4">
              <p className="text-sm sm:text-base text-gray-900">
                <strong>{t('sharpener.date')}:</strong> {new Date(selectedAvailability.availableDate).toLocaleDateString()}
              </p>
              <p className="text-sm sm:text-base text-gray-900">
                <strong>{t('sharpener.time')}:</strong> {selectedAvailability.startTime} - {selectedAvailability.endTime}
              </p>
              <p className="text-sm sm:text-base text-gray-900">
                <strong>{t('sharpener.price')}:</strong> ${selectedAvailability.price}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select 15-minute interval <span className="text-red-500">*</span>
              </label>
              <select
                className="input-field"
                value={selectedInterval}
                onChange={(e) => setSelectedInterval(e.target.value)}
                required
              >
                <option value="">Choose a time...</option>
                {(() => {
                  const intervals = []
                  const [startHour, startMin] = selectedAvailability.startTime.split(':').map(Number)
                  const [endHour, endMin] = selectedAvailability.endTime.split(':').map(Number)
                  
                  let currentMinutes = startHour * 60 + startMin
                  const endMinutes = endHour * 60 + endMin
                  
                  const booked = bookedIntervals[selectedAvailability.availabilityId] || []
                  console.log('=== RENDERING DROPDOWN ===')
                  console.log('Selected Availability ID:', selectedAvailability.availabilityId)
                  console.log('All booked intervals state:', JSON.stringify(bookedIntervals, null, 2))
                  console.log('Booked intervals for this availability:', booked)
                  console.log('Booked array length:', booked.length)
                  
                  while (currentMinutes + 15 <= endMinutes) {
                    const startH = Math.floor(currentMinutes / 60)
                    const startM = currentMinutes % 60
                    const endH = Math.floor((currentMinutes + 15) / 60)
                    const endM = (currentMinutes + 15) % 60
                    
                    const startTime = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`
                    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
                    const intervalKey = `${startTime}-${endTime}`
                    
                    const isBooked = booked.includes(intervalKey)
                    console.log(`Checking "${intervalKey}" (length: ${intervalKey.length}) against booked:`, booked, `=> isBooked: ${isBooked}`)
                    
                    // Only show available intervals - skip booked ones completely
                    if (!isBooked) {
                      intervals.push(
                        <option 
                          key={startTime} 
                          value={intervalKey}
                        >
                          {startTime} - {endTime}
                        </option>
                      )
                    }
                    
                    currentMinutes += 15
                  }
                  
                  console.log(`Total available intervals: ${intervals.length}`)
                  return intervals
                })()}
              </select>
              <p className="text-xs text-gray-600 mt-1">Choose your preferred 15-minute time slot</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('booking.notes')}
              </label>
              <textarea
                className="input-field"
                rows={3}
                placeholder={t('booking.notesPlaceholder')}
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleBooking}
                className="btn-primary flex-1 w-full sm:w-auto"
              >
                {t('booking.submitButton')}
              </button>
              <button
                onClick={() => {
                  setSelectedAvailability(null)
                  setSelectedInterval('')
                }}
                className="btn-secondary w-full sm:w-auto"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        )}

        {/* Reviews */}
        {sharpener.ratings && sharpener.ratings.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{t('sharpener.ratings')}</h2>
            <div className="space-y-4">
              {sharpener.ratings.map((review: any) => (
                <div key={review.ratingId} className="card">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-2 gap-2">
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">{review.userName}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {review.comment && (
                    <p className="text-sm sm:text-base text-gray-700">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
